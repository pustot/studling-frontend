import { Authenticator } from "@aws-amplify/ui-react";
import { Box, Button, Container, Typography } from "@mui/material";
import { fetchUserAttributes } from "aws-amplify/auth";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { I18nText } from "../utils/I18n";

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
    return (
        <>
            <BackButton />
            <Authenticator>
                {({ signOut, user }) => (
                    <div>
                        <Box p={1} display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
                            <UserEmail />
                            <Button variant="outlined" color="primary" onClick={signOut} style={{ fontSize: '0.75rem' }}>
                                Sign Out
                            </Button>
                        </Box>

                        <Container maxWidth="md">

                        <UserEmail />

                        <Button variant="outlined" color="primary" onClick={signOut} style={{ fontSize: '0.75rem' }}>
                            Sign Out
                        </Button>

                        </Container>
                    </div>
                )}
            </Authenticator>
        </>
    );
}