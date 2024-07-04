import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, Button, Container, LinearProgress, TextField, Typography } from "@mui/material";
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

export default function ZhYueHanziTraining(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const [characters, setCharacters] = useState<string[]>([]);
    const [jyutpingMapping, setJyutpingMapping] = useState<JyutpingMapping | null>(null);
    const [currentCharacter, setCurrentCharacter] = useState<string>('');
    const [userInput, setUserInput] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [answerChecked, setAnswerChecked] = useState(false);

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
        setAnswerChecked(false);  // 重置答案检查状态
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
        setTotalAttempts(prev => prev + 1);
        if (currentCharacter && jyutpingMapping) {
            const correctAnswers = jyutpingMapping[currentCharacter];
            if (correctAnswers && correctAnswers.map(ans => ans.toLowerCase()).includes(userInput.trim().toLowerCase())) {
                setCorrectAnswers(prev => prev + 1);
                setFeedback('✅️ 正确！（正确答案：' + correctAnswers + '）');
            } else {
                setFeedback('❌️ 错误！（正确答案：' + correctAnswers + '）');
            }
        }
        setAnswerChecked(true);  // 设置答案已检查
    };

    const correctRate = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;

    return (
        <Container maxWidth="md">
            <BackButton />
            <Box marginBottom={4}>
                <Typography variant="h6" py={2}>请为以下汉字输入粤拼：</Typography>
                <Typography variant="h4" p={4} sx={{ marginBottom: 2 }}>{currentCharacter}</Typography>
                <TextField
                    label="输入粤拼"
                    variant="outlined"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (!answerChecked) {
                                checkAnswer();
                            } else {
                                startExercise();
                            }
                        }
                    }}
                    sx={{ marginBottom: 2 }}
                    autoComplete="off"
                />
                <Button
                    variant="contained"
                    color={answerChecked ? "secondary" : "primary"}
                    onClick={answerChecked ? startExercise : checkAnswer}
                    sx={{ margin: 2 }}
                >
                    {answerChecked ? "继续" : "确定"}
                </Button>
                {totalAttempts > 0 && (
                    <>
                        <Typography variant="body1" sx={{ my: 2 }}>正确率: {correctRate.toFixed(2)}%（{correctAnswers}／{totalAttempts}）</Typography>
                        <LinearProgress variant="determinate" value={correctRate} sx={{ width: '100%', my: 2 }} />
                    </>
                )}
                {feedback && <Typography
                    my={2}
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        alignItems: 'center',
                        color: feedback.startsWith('✅️') ? 'green' : 'red',
                        border: `2px solid ${feedback.startsWith('✅️') ? '#2e7d32' : '#c62828'}`,  // 边框颜色使用深绿或深红
                        borderRadius: '4px',
                        padding: 2,
                        fontWeight: 'bold',
                        backgroundColor: 'transparent',  // 去掉背景色，使用透明
                        width: 'fit-content'  // 使得Typography仅占用所需宽度
                    }}
                    gutterBottom
                >
                    {feedback.startsWith('✅️') ? <CheckCircleIcon sx={{ mr: 1, color: feedback.startsWith('✅️') ? '#2e7d32' : '#c62828' }} /> : <ErrorIcon sx={{ mr: 1, color: feedback.startsWith('✅️') ? '#2e7d32' : '#c62828' }} />}
                    {feedback}
                </Typography>
                }
            </Box>
        </Container>
    )
}