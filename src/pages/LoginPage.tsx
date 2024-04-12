import { Authenticator } from "@aws-amplify/ui-react";
import { Box, Button, Container, Typography } from "@mui/material";
import { fetchUserAttributes } from "aws-amplify/auth";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { I18nText, getLocaleText } from "../utils/I18n";

const UserEmail: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('loading...');

    useEffect(() => {
        // 定义异步函数来获取当前认证用户的信息
        const fetchUserEmail = async () => {
            try {
                const userAttributes = await fetchUserAttributes();
                // 假设用户信息中包含电子邮件地址，并设置到状态中
                setEmail(userAttributes?.email as string);
            } catch (error) {
                console.error('Error fetching user email', error);
            }
        };

        // 调用异步函数
        fetchUserEmail();

    }, []); // 空依赖数组表示这个 effect 仅在组件挂载时执行一次

    return <Typography variant="body2" sx={{ color: 'text.secondary' }}>Hello, {email}</Typography>;
}

export default function LoginPage(props: { lang: keyof I18nText }) {
    const { lang } = props;

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

                            <Button variant="outlined" color="primary" onClick={signOut} style={{ fontSize: '0.75rem', margin: 4 }}>
                                Sign Out
                            </Button>

                        </div>
                    )}
                </Authenticator>
            </Container>
        </>
    );
}