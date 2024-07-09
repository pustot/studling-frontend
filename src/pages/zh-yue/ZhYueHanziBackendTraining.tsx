import { Box, Button, Container, Typography } from "@mui/material";
import { AuthUser, getCurrentUser } from 'aws-amplify/auth';
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import BackButton from "../../components/BackButton";
import API from '../../utils/API';
import { I18nText } from "../../utils/I18n";

const example_training_results = {
    "userId": 1,
    "results": [
        { "wordId": 1, "correct": true },
        { "wordId": 2, "correct": true },
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

export default function ZhYueHanziBackendTraining(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const navigate = useNavigate(); // 获取navigate函数


    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then(user => {
                setUser(user);
                setIsLoading(false);
            })
            .catch(err => {
                console.log('用户未登录', err);
                navigate('/login');
            });
    }, []);

    const [messageSent, setMessageSent] = useState<boolean>(false);

    const sendMessage = async () => {
        try {
            // 发送示例消息给后端的逻辑
            // await API.post('/api/training/results', example_training_results); // 使用导入的 axios 实例发送请求
            let words = await API.get('/api/zh-yue-can-words/random/5'); // 使用导入的 axios 实例发送请求
            setMessageSent(true); // 暂时设为 true，表示消息发送成功
            console.log(words.data)
        } catch (error) {
            console.error("发送消息失败:", error);
        }
    };

    return (
        <>
            {isLoading
                ? <Typography>Loading...</Typography>
                :
                <Container maxWidth="md">

                    <BackButton />
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
                </Container>}
        </>
    )
}