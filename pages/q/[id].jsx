import prisma from "@/lib/prisma";
import QuestionsList from "@/components/QuestionsList";
import { useState } from "react";
import styles from "@/styles/Home.module.css";

export const getServerSideProps = async ({ params }) => {
    let quiz = await prisma.quiz.findUnique({
        where: {
            id: String(params?.id),
        },
        include: {
            questions: {
                include: {
                    options: true,
                },
            },
            creator: true,
        },
    });
    quiz = JSON.stringify(quiz);
    return {
        props: { quiz },
        revalidate: 10,
    };
};

export default function Quiz({ quiz }) {
    quiz = JSON.parse(quiz);
    const [chosenOptions, setChosenOptions] = useState(
        Array.from({ length: quiz.questions.length }).fill(null)
    );
    const [results, setResults] = useState(null);
    const [pressedSubmit, setPressedSubmit] = useState(false);
    const [quizTaken, setQuizTaken] = useState(false);
    const [score, setScore] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPressedSubmit(true);
        const res = await fetch("/api/results", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chosenOptions,
            }),
        });
        const results = await res.json();

        if (res.ok) {
            setResults(results.results);
            setQuizTaken(true);

            let score = 0;
            for (let result of results.results) {
                if (result.isCorrect) {
                    score++;
                }
            }
            setScore(score);
        } else {
            console.log(res.statusText);
            setPressedSubmit(false);
        }
    };
    return (
        <>
            <div className={styles.quizHeading}>
                <div className={styles.quizHeadingEl}>
                    <h3>{quiz.title}</h3>
                </div>
                <h3 className={styles.quizHeadingEl}>
                    Score:{" "}
                    {quizTaken && (
                        <>
                            {score}/{results.length}
                        </>
                    )}
                </h3>
            </div>
            <div>- {quiz.creator.name}</div>
            <QuestionsList
                questions={quiz.questions}
                chosenOptions={chosenOptions}
                setChosenOptions={setChosenOptions}
                handleSubmit={handleSubmit}
                quizTaken={quizTaken}
                pressedSubmit={pressedSubmit}
            />
        </>
    );
}
