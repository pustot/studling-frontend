import "purecss/build/pure.css";
import * as React from "react";
import { useState } from "react";
import "../styles.scss";

import { Button, Container, Grid, IconButton, Link as MuiLink, Stack, Typography } from "@mui/material";
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

export default function Home(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const [messageSent, setMessageSent] = useState<boolean>(false);

    const sendMessage = async () => {
        try {
            // 发送示例消息给后端的逻辑
            await API.post('/api/training/results', example_training_results); // 使用导入的 axios 实例发送请求
            setMessageSent(true); // 暂时设为 true，表示消息发送成功
        } catch (error) {
            console.error("发送消息失败:", error);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h5">
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
            <Button
                variant="contained"
                color="primary"
                onClick={sendMessage}
                disabled={messageSent} // 如果消息已发送，按钮将被禁用
            >
                发送示例训练结果给后端
            </Button>
        </Container>
    );
}
