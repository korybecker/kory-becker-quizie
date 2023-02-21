import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
    const { quizId } = req.body;

    try {
        await prisma.answer.deleteMany({
            where: {
                option: {
                    question: {
                        quizId: quizId,
                    },
                },
            },
        });
    } catch (err) {
        console.error(err);
    }

    try {
        await prisma.option.deleteMany({
            where: {
                question: {
                    quizId: quizId,
                },
            },
        });
    } catch (err) {
        console.error(err);
    }

    try {
        await prisma.question.deleteMany({
            where: {
                quizId: quizId,
            },
        });
    } catch (err) {
        console.error(err);
    }

    try {
        await prisma.quiz.delete({
            where: {
                id: quizId,
            },
        });
    } catch (err) {
        console.error(err);
    }

    res.status(204).json({ msg: "delete success" });
};
