import { useState } from "react";
import Router from "next/router";
import styles from "@/styles/Home.module.css";
import { useSession } from "next-auth/react";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
const theme = createTheme({
    status: {
        danger: "#e53e3e",
    },
    palette: {
        primary: {
            main: "#0971f1",
            darker: "#053e85",
        },
        neutral: {
            main: "#64748B",
            contrastText: "#fff",
        },
    },
});

const alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
];

export default function Create() {
    const { data: session } = useSession();
    if (!session && typeof window !== "undefined") {
        Router.push("/login");
    }

    console.log(session.userId);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([
        { text: "", options: [{ text: "", isAnswer: false }] },
    ]);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleOptionChange = (questionIndex, optionIndex, event) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex][
            event.target.name
        ] = event.target.value;
        setQuestions(updatedQuestions);
    };

    const handleQuestionChange = (questionIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].text = e.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionAnswerChange = (questionIndex, optionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options = updatedQuestions[
            questionIndex
        ].options.map((option, i) => {
            return {
                ...option,
                isAnswer: i === optionIndex,
            };
        });
        setQuestions(updatedQuestions);
    };

    const addOption = (questionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options = [
            ...updatedQuestions[questionIndex].options,
            { text: "", isAnswer: false },
        ];
        setQuestions(updatedQuestions);
    };

    const removeOption = (questionIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[questionIndex].options.length === 1) return;

        updatedQuestions[questionIndex].options = updatedQuestions[
            questionIndex
        ].options.slice(0, updatedQuestions[questionIndex].options.length - 1);
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { text: "", options: [{ text: "", isAnswer: false }] },
        ]);
    };

    const removeQuestion = () => {
        setQuestions(questions.slice(0, questions.length - 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasCorrectOption = true;
        let hasCompletedOptionFields = true;
        let hasCompletedQuestionFields = true;
        questions.forEach((question) => {
            if (question.text === "") {
                hasCompletedQuestionFields = false;
            }
            if (!question.options.find((option) => option.isAnswer)) {
                hasCorrectOption = false;
            }
            if (!question.options.every((option) => option.text !== "")) {
                hasCompletedOptionFields = false;
            }
        });

        if (title === "") {
            return setError("Quizie must have a title.");
        }

        if (!hasCompletedQuestionFields) {
            return setError("Please complete all question fields.");
        }

        if (!hasCompletedOptionFields) {
            return setError("Please complete all option fields.");
        }

        if (!hasCorrectOption) {
            return setError("Each question must have a correct option.");
        }

        setIsUploading(true);

        const res = await fetch("/api/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
                questions,
                userId: session.userId,
            }),
        });

        if (res.ok) {
            setIsUploading(false);
            setIsFinished(true);
            Router.push("/");
        } else {
            console.log(res.statusText);
        }
    };

    return (
        <div
            style={{
                maxWidth: "50rem",
                margin: "0 auto",
            }}
        >
            <h1 style={{ textAlign: "center" }}>Create Quizie</h1>
            <h3 style={{ color: "red", textAlign: "center" }}>{error}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <label style={{ width: "4rem" }}>
                        <strong>Title</strong>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </div>

                <div className={styles.createquizblock}>
                    <div>
                        {questions.map((question, questionIndex) => (
                            <div key={questionIndex}>
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    <label
                                        style={{
                                            width: "3rem",
                                        }}
                                    >
                                        <strong>Q{questionIndex + 1}.</strong>
                                    </label>
                                    <input
                                        type="text"
                                        name="text"
                                        value={question.text}
                                        onChange={(e) =>
                                            handleQuestionChange(
                                                questionIndex,
                                                e
                                            )
                                        }
                                    />
                                </div>
                                {question.options.map((option, optionIndex) => (
                                    <div
                                        key={optionIndex}
                                        style={{ display: "flex" }}
                                    >
                                        <label
                                            style={{
                                                width: "3rem",
                                                textAlign: "right",
                                            }}
                                        >
                                            <strong>
                                                {alphabet[optionIndex % 26]}.
                                            </strong>
                                        </label>
                                        <input
                                            type="text"
                                            name="text"
                                            value={option.text}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    questionIndex,
                                                    optionIndex,
                                                    e
                                                )
                                            }
                                        />
                                        <label>
                                            <input
                                                type="radio"
                                                name={`question-${questionIndex}-answer`}
                                                checked={option.isAnswer}
                                                onChange={() =>
                                                    handleOptionAnswerChange(
                                                        questionIndex,
                                                        optionIndex
                                                    )
                                                }
                                            ></input>
                                            Correct
                                        </label>
                                    </div>
                                ))}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                    }}
                                >
                                    <ThemeProvider theme={theme}>
                                        <Button
                                            variant="text"
                                            startIcon={<AddIcon />}
                                            onClick={() =>
                                                addOption(questionIndex)
                                            }
                                            color="neutral"
                                            size="small"
                                        >
                                            Option
                                        </Button>
                                    </ThemeProvider>
                                    <Button
                                        variant="text"
                                        startIcon={<DeleteIcon />}
                                        onClick={() =>
                                            removeOption(questionIndex)
                                        }
                                        color="error"
                                        size="small"
                                    >
                                        Option
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <ThemeProvider theme={theme}>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => addQuestion()}
                                color="neutral"
                            >
                                Question
                            </Button>
                        </ThemeProvider>
                        {questions.length > 0 && (
                            <Button
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={() => removeQuestion()}
                                color="error"
                            >
                                Question
                            </Button>
                        )}
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isUploading}
                        sx={{ width: "50%" }}
                    >
                        Submit
                    </Button>
                    {isUploading && <p>Uploading...</p>}
                    {isFinished && <p>Finished!</p>}
                </div>
            </form>
        </div>
    );
}
