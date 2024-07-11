import { AuthEventData } from "@aws-amplify/ui";
import { Authenticator } from "@aws-amplify/ui-react";
import { Button, Container, Typography } from "@mui/material";
import { fetchUserAttributes } from "aws-amplify/auth";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import BackButton from "../components/BackButton";
import API from '../utils/API';
import { I18nText, getLocaleText } from "../utils/I18n";

// 使用单独组件，以便登陆后自动重新挂载
const UserEmail: React.FC = () => {
    const fetchCalled = useRef(false); // 添加 useRef 防止多次调用
    const [userEmail, setUserEmail] = useState(sessionStorage.getItem('userEmail'));

    useEffect(() => {
        // 定义异步函数来获取当前认证用户的信息
        const fetchUserEmail = async () => {
            fetchUserAttributes().then((userAttributes) => {
                // 假设用户信息中包含电子邮件地址，并设置到状态中
                const email = userAttributes.email as string;
                setUserEmail(email);
                const cognitoSub = userAttributes.sub as string;
                sessionStorage.setItem('userEmail', email);
                sessionStorage.setItem('cognitoSub', cognitoSub);
                const userDTO = {
                    email: email,
                    cognitoSub: cognitoSub
                };
                API.put(`/api/users`, userDTO); // 若后端DB无此用户email则添加
                console.log(email);
            }).catch((err) => {
                console.log('用户未登录', err);
            });
        };

        // 调用异步函数
        // 使用 useRef 防止多次调用
        if (!fetchCalled.current && !userEmail) {
            fetchUserEmail();
            fetchCalled.current = true; // 标记为已调用
        }

    }, []); // 空依赖数组表示这个 effect 仅在组件挂载时执行一次
    return <Typography variant="body2" sx={{ color: 'text.secondary' }}>Hello, {userEmail}</Typography>

}

export default function LoginPage(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const handleSignOut = (signOutFunc: ((data?: AuthEventData) => void) | undefined) => {
        // 清除SessionStorage中的用户信息
        sessionStorage.removeItem('userEmail'); // 假设这是存储用户电子邮件的键

        if (signOutFunc) signOutFunc(); // 调用传入的signOut函数
    };

    return (
        <Container maxWidth="md">
            <BackButton />
            <Authenticator>
                {({ signOut, user }) => (
                    <div>
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
    );
}