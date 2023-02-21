import { FormControlLabel, Radio } from "@mui/material";

export default function OptionsList({
    options,
    chosenOptions,
    setChosenOptions,
    questionIndex,
    isCorrect,
    correctOptionStyle,
    incorrectOptionStyle,
}) {
    const handler = (option) => {
        const newChosenOptions = [...chosenOptions];
        newChosenOptions[questionIndex] = option.id;
        setChosenOptions(newChosenOptions);
    };
    return (
        <>
            {options.map((option, i) => {
                <FormControlLabel
                    key={i}
                    value={option.text}
                    control={<Radio onChange={() => handler(option)} />}
                    label={option.text}
                    style={{ height: "30px" }}
                    sx={
                        chosenOptions[questionIndex] === option.id
                            ? isCorrect // style if chosen option
                                ? correctOptionStyle
                                : incorrectOptionStyle
                            : {} // don't style otherwise
                    }
                />;
            })}
        </>
    );
}
