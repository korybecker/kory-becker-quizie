import prisma from "@/lib/prisma";
import QuestionsList from "@/components/QuestionsList";
import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import { Button } from "@mui/material";

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
    };
};

const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    let result = "";

    if (hours > 0) {
        result += `${hours}h `;
    }

    if (minutes > 0 || hours > 0) {
        result += `${minutes}min `;
    }

    if (seconds > 0 || (minutes === 0 && hours === 0)) {
        result += `${seconds}s`;
    }

    return result.trim();
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
    const [timeLimit, setTimeLimit] = useState(quiz.timeLimit);
    const [startQuiz, setStartQuiz] = useState(false);
    console.log(timeLimit);

    useEffect(() => {
        if (timeLimit && startQuiz && !quizTaken) {
            const interval = setInterval(() => {
                setTimeLimit((time) => time - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timeLimit, startQuiz]);

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
                <span className={styles.quizHeadingElTop}>
                    <h3>{quiz.title}</h3>
                </span>
                <span className={styles.quizHeadingElBottom}>
                    <h3>
                        Score:{" "}
                        {quizTaken && (
                            <>
                                {score}/{results.length}
                            </>
                        )}
                    </h3>
                    {timeLimit && <h3>Time Left: {formatTime(timeLimit)}</h3>}
                </span>
            </div>
            {!startQuiz ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <Button
                        sx={{ width: "300px" }}
                        variant="contained"
                        onClick={() => setStartQuiz(true)}
                    >
                        Start Quiz
                    </Button>
                </div>
            ) : (
                <QuestionsList
                    questions={quiz.questions}
                    chosenOptions={chosenOptions}
                    setChosenOptions={setChosenOptions}
                    handleSubmit={handleSubmit}
                    quizTaken={quizTaken}
                    pressedSubmit={pressedSubmit}
                    results={results}
                />
            )}
        </>
    );
}
