import { Box, Button, Container, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { I18nText } from "../../utils/I18n";

type JyutpingMapping = { [character: string]: string[] };

const parseRimeDictionary = (content: string): JyutpingMapping => {
    const lines = content.split('\n');
    const mapping: JyutpingMapping = {};

    const lineRegex = /^(.)\s+([a-z0-9]+)(\s+\d+%?)?$/;

    for (const line of lines) {
        const match = line.match(lineRegex);
        if (match) {
            const [, character, jyutping] = match;
            if (!mapping[character]) {
                mapping[character] = [jyutping];
            } else {
                // 避免重复添加相同的粤拼
                if (!mapping[character].includes(jyutping)) {
                    mapping[character].push(jyutping);
                }
            }
        }
    }

    return mapping;
};

export default function ZhYueTrainings(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const [characters, setCharacters] = useState<string[]>([]);
    const [jyutpingMapping, setJyutpingMapping] = useState<JyutpingMapping | null>(null);
    const [currentCharacter, setCurrentCharacter] = useState<string>('');
    const [userInput, setUserInput] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/nk2028/commonly-used-chinese-characters-and-words/main/char.txt');
                const text = await response.text();
                const charArray = text.split('\n').filter(char => char.trim() !== ''); // 去除空行
                setCharacters(charArray);
                console.log("已加载常用汉字个数 " + charArray.length)
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/rime/rime-cantonese/main/jyut6ping3.chars.dict.yaml');
                const text = await response.text();
                const parsedMapping = parseRimeDictionary(text);
                setJyutpingMapping(parsedMapping);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    const startExercise = () => {
        if (characters.length > 0) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            const randomCharacter = characters[randomIndex];
            setCurrentCharacter(randomCharacter);
            setUserInput('');
            setFeedback('');
        }
    };

    useEffect(() => {
        startExercise();
    }, [characters, jyutpingMapping]);

    const checkAnswer = () => {
        if (currentCharacter && jyutpingMapping) {
            const correctAnswers = jyutpingMapping[currentCharacter];
            if (correctAnswers && correctAnswers.includes(userInput.trim())) {
                setFeedback('✅️ 正确！（正确答案：' + correctAnswers + '）');
            } else {
                setFeedback('❌️ 错误！（正确答案：' + correctAnswers + '）');
            }
        }
    };

    return (
        <Container maxWidth="md">
            <BackButton />
            <Box marginBottom={4}>
                <Typography variant="h6">请为以下汉字输入粤拼：</Typography>
                <Typography variant="h4" sx={{ marginBottom: 2 }}>{currentCharacter}</Typography>
                <TextField
                    label="输入粤拼"
                    variant="outlined"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    sx={{ marginBottom: 2 }}
                    autoComplete="off"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={checkAnswer}
                    sx={{ margin: 2 }}
                >
                    提交
                </Button>
                {feedback && <Typography sx={{ marginTop: 2 }}>{feedback}</Typography>}
                {feedback && <Button
                    variant="contained"
                    color="secondary"
                    onClick={startExercise}
                >
                    下一题
                </Button>}
            </Box>
        </Container>
    )
}