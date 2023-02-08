import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
    const { title, questions } = req.body;

    const uploadedQuiz = await prisma.quiz.create({
        data: {
            title,
            creator: {
                connect: { id: "cldpda7s10000v000aj8te2jg" },
            },
        },
    });

    const uploadedQuestions = [];
    for (const question of questions) {
        const createdQuestion = await prisma.question.create({
            data: {
                text: question.text,
                quizId: uploadedQuiz.id,
            },
        });
        uploadedQuestions.push(createdQuestion);
    }

    const uploadedOptions = [];
    const unresolvedAnswers = [];
    for (const [index, question] of questions.entries()) {
        for (const option of question.options) {
            const createdOption = await prisma.option.create({
                data: {
                    text: option.text,
                    question: {
                        connect: { id: uploadedQuestions[index].id },
                    },
                },
            });
            uploadedOptions.push(createdOption);

            unresolvedAnswers.push(
                prisma.answer.create({
                    data: {
                        isCorrect: option.isAnswer,
                        option: {
                            connect: { id: createdOption.id },
                        },
                    },
                })
            );
        }
    }

    await Promise.all(unresolvedAnswers);

    res.status(200).json({
        quiz: uploadedQuiz,
        questions: uploadedQuestions,
        options: uploadedOptions,
    });
};
