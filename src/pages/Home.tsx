import "purecss/build/pure.css";
import * as React from "react";
import { useEffect, useState } from "react";
import "../styles.scss";

import {
    Box,
    Button,
    Container,
    Link as MuiLink,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import API from "../utils/API";

import { getLocaleText, I18nText } from "../utils/I18n";

const example_training_results = {
    "userId": 1,
    "results": [
        {
            "wordId": 1,
            "correct": true
        },
        {
            "wordId": 2,
            "correct": true
        },
        {
            "wordId": 3,
            "correct": true
        },
        {
            "wordId": 4,
            "correct": false
        },
        {
            "wordId": 5,
            "correct": false
        }
        // 更多单词训练结果...
    ]
};

interface Document {
    id: string;
    title: string;
    content: string;
}

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

export default function Home(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const [messageSent, setMessageSent] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>(''); // 添加搜索框的状态
    const [searchResults, setSearchResults] = useState<Document[]>([]);
    const [characters, setCharacters] = useState<string[]>([]);
    const [jyutpingMapping, setJyutpingMapping] = useState<JyutpingMapping | null>(null);

    // roma 练习
    const [isExerciseVisible, setIsExerciseVisible] = useState<boolean>(false);
    const [currentCharacter, setCurrentCharacter] = useState<string>('');
    const [userInput, setUserInput] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');

    const sendMessage = async () => {
        try {
            // 发送示例消息给后端的逻辑
            await API.post('/api/training/results', example_training_results); // 使用导入的 axios 实例发送请求
            setMessageSent(true); // 暂时设为 true，表示消息发送成功
        } catch (error) {
            console.error("发送消息失败:", error);
        }
    };

    const handleSearch = async () => {
        // 在这里执行搜索操作，可以将搜索框的值发送到后端
        console.log('搜索值:', searchValue);
        try {
            // 发送示例消息给后端的逻辑
            const response = await API.get('/api/search', { params: { query: searchValue } }); // 使用导入的 axios 实例发送请求
            console.log('后端返回值:', response.data); // 打印后端返回的数据
            setSearchResults(response.data);
        } catch (error) {
            console.error("发送消息失败:", error);
        }
    };

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
            setIsExerciseVisible(true);
        }
    };

    const checkAnswer = () => {
        if (currentCharacter && jyutpingMapping) {
            const correctAnswers = jyutpingMapping[currentCharacter];
            if (correctAnswers && correctAnswers.includes(userInput.trim())) {
                setFeedback('✅️ 答对了！（正确答案：' + correctAnswers + '）');
            } else {
                setFeedback('❌️ 答错了！（正确答案：' + correctAnswers + '）');
            }
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {getLocaleText(
                    {
                        "en": "甪端 Studling",
                        "zh-Hant": "甪端 Studling",
                        "zh-Hans": "甪端 Studling",
                        "tto-bro": "EeRZ T8eHXQea",
                        "tto": "hFCmo mAFKRHm",
                        "ja": "甪端 Studling",
                        "de": "甪端 Studling",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {getLocaleText(
                    {
                        "en": "甪端 Studling",
                        "zh-Hant": "甪端 Studling",
                        "zh-Hans": "一站式多语种学习平台。",
                        "tto-bro": "EeRZ T8eHXQea",
                        "tto": "hFCmo mAFKRHm",
                        "ja": "甪端 Studling",
                        "de": "甪端 Studling",
                    },
                    lang
                )}
            </Typography>


            <Box marginBottom={2}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={startExercise}
                >
                    粤拼练习
                </Button>
            </Box>

            {isExerciseVisible && (
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
            )}


            <Box marginBottom={4}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={sendMessage}
                    disabled={messageSent} // 如果消息已发送，按钮将被禁用
                >
                    发送示例训练结果给后端
                </Button>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 2 }}> {/* 使用 Stack 组件对搜索框和按钮进行布局 */}
                <TextField
                    label="搜索"
                    variant="outlined"
                    value={searchValue} // 将搜索框的值绑定到状态
                    onChange={(e) => setSearchValue(e.target.value)} // 监听搜索框内容的变化，并更新状态
                    autoComplete="off"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch} // 将搜索按钮的点击事件绑定到 handleSearch 函数
                >
                    搜索
                </Button>
            </Stack>

            {/* 以后添加功能以分页、隐藏全文、高亮搜索词 */}
            <Box sx={{ marginTop: 2 }}>
                {searchResults.map((doc, index) => (
                    <Box key={doc.id} sx={{ marginBottom: 2, border: '1px solid #ccc', padding: 2 }}>
                        <Typography variant="h6">{doc.title}</Typography>
                        <Typography variant="body1">{doc.content}</Typography>
                    </Box>
                ))}
            </Box>
        </Container>
    );
}
