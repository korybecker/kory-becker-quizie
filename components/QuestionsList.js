import OptionsList from "./OptionsList";
import { FormControl, FormLabel, RadioGroup, Button } from "@mui/material";

const correctOptionStyle = {
    fontWeight: "bold",
    color: "green",
};
const incorrectOptionStyle = {
    fontWeight: "bold",
    color: "red",
};

export default function QuestionsList({
    questions,
    chosenOptions,
    setChosenOptions,
    handleSubmit,
    quizTaken,
    pressedSubmit,
    results,
}) {
    return (
        <form onSubmit={handleSubmit} style={{ minWidth: "auto" }}>
            <FormControl
                focused={false}
                color="primary"
                margin="dense"
                sx={{
                    width: "100%",
                    maxWidth: 500,
                }}
            >
                {questions.map((question, questionIndex) => {
                    const isCorrect =
                        quizTaken && results[questionIndex]?.isCorrect;
                    return (
                        <div
                            style={{
                                display: "block",
                                marginLeft: "1rem",
                                marginRight: "1rem",
                            }}
                            key={questionIndex}
                        >
                            <FormLabel id="demo-radio-buttons-group-label">
                                {questionIndex + 1}. {question.text}
                            </FormLabel>
                            <RadioGroup aria-labelledby="demo-radio-buttons-group-label">
                                <OptionsList
                                    options={question.options}
                                    questionIndex={questionIndex}
                                    chosenOptions={chosenOptions}
                                    setChosenOptions={setChosenOptions}
                                    isCorrect={isCorrect}
                                    correctOptionStyle={correctOptionStyle}
                                    incorrectOptionStyle={incorrectOptionStyle}
                                    quizTaken={quizTaken}
                                />
                            </RadioGroup>
                            <hr width="100%" />
                        </div>
                    );
                })}
                {!quizTaken && (
                    <Button
                        type="submit"
                        variant="outlined"
                        disabled={pressedSubmit}
                        sx={{
                            mr: 2,
                            ml: 2,
                        }}
                    >
                        Submit
                    </Button>
                )}
            </FormControl>
        </form>
    );
}
