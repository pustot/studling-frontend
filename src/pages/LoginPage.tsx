import { AuthEventData } from "@aws-amplify/ui";
import { Authenticator } from "@aws-amplify/ui-react";
import { Button, Container, Typography } from "@mui/material";
import { fetchUserAttributes } from "aws-amplify/auth";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import API from '../utils/API';
import { I18nText, getLocaleText } from "../utils/I18n";

const UserEmail: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('loading...');
    const fetchCalled = useRef(false); // 添加 useRef 防止多次调用

    useEffect(() => {
        // 定义异步函数来获取当前认证用户的信息
        const fetchUserEmail = async () => {
            try {
                const userAttributes = await fetchUserAttributes();
                // 假设用户信息中包含电子邮件地址，并设置到状态中
                const userEmail = userAttributes?.email as string;
                const cognitoSub = userAttributes?.sub as string;
                setEmail(userEmail);
                sessionStorage.setItem('userEmail', userEmail);
                sessionStorage.setItem('cognitoSub', cognitoSub);
                const userDTO = {
                    email: userEmail,
                    cognitoSub: cognitoSub
                };
                API.put(`/api/users`, userDTO); // 若后端DB无此用户email则添加
            } catch (error) {
                console.error('Error fetching user email', error);
            }
        };

        // 调用异步函数
        // 使用 useRef 防止多次调用
        if (!fetchCalled.current) {
            fetchUserEmail();
            fetchCalled.current = true; // 标记为已调用
        }

    }, []); // 空依赖数组表示这个 effect 仅在组件挂载时执行一次

    return <Typography variant="body2" sx={{ color: 'text.secondary' }}>Hello, {email}</Typography>;
}

export default function LoginPage(props: { lang: keyof I18nText }) {
    const { lang } = props;

    // 定义handleSignOut函数，并接收signOut作为参数
    const handleSignOut = (signOutFunc: ((data?: AuthEventData) => void) | undefined) => {
        // 清除SessionStorage中的用户信息
        sessionStorage.removeItem('userEmail'); // 假设这是存储用户电子邮件的键

        // 执行登出操作
        if (signOutFunc) signOutFunc(); // 调用传入的signOut函数
    };

    return (
        <>
            <Container maxWidth="md">
                <BackButton />
                <Authenticator>
                    {({ signOut, user }) => (
                        <div>
                            {/* <Box p={1} display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
                                <UserEmail />
                                <Button variant="outlined" color="primary" onClick={signOut} style={{ fontSize: '0.75rem' }}>
                                    Sign Out
                                </Button>
                            </Box> */}


                            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                                {getLocaleText(
                                    {
                                        "zh-Hans": "用户信息",
                                        "zh-Hant": "用戶信息",
                                        "en": "User Information",
                                        "ja": "ユーザー情報",
                                        "de": "Benutzerinformation",
                                        "ko": "사용자 정보",
                                        "ko-Han": "使用者 情報",
                                        "eo": "Uzantinformo",
                                        "fr": "Informations de l'utilisateur",
                                        "vi": "Thông tin người dùng",
                                        "vi-Han": "通信𠊛用",
                                        "es": "Información del usuario",
                                        "tto-bro": "UsrIfoDta",
                                        "tto": "UsrInf",
                                    },
                                    lang
                                )}
                            </Typography>

                            <UserEmail />

                            <Button variant="outlined" color="primary"
                                onClick={() => handleSignOut(signOut)}
                                style={{ fontSize: '0.75rem', margin: 4 }}>
                                Sign Out
                            </Button>

                        </div>
                    )}
                </Authenticator>
            </Container>
        </>
    );
}