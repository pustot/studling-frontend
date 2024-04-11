import "purecss/build/pure.css";
import * as React from "react";
import { useState } from "react";
import "../../styles.scss";

import {
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import API from "../../utils/API";

import { useNavigate } from "react-router-dom";
import { getLocaleText, I18nText } from "../../utils/I18n";

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



export default function ZhYueTrainings(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const navigate = useNavigate();
    const [messageSent, setMessageSent] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>(''); // 添加搜索框的状态
    const [searchResults, setSearchResults] = useState<Document[]>([]);

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
                    onClick={() => navigate('hanzi-training')}
                >
                    粤拼练习
                </Button>
            </Box>

            <Typography variant="body2" sx={{ color: 'text.secondary',  marginBottom: 2 }}>
                Below are test features:
            </Typography>
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
                    autoComplete="off" />
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
