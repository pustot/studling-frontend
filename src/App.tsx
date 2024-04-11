import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Box, Button, CssBaseline, PaletteMode, Typography } from "@mui/material";
import { Theme, ThemeProvider, createTheme } from "@mui/material/styles";
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes } from 'aws-amplify/auth';
import "purecss/build/pure.css";
import * as React from "react";
import { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./styles.scss";

import awsconfig from './aws-exports'; // 如果你通过 Amplify CLI 初始化，配置信息会自动生成在这个文件
import NavBarAndMenu, { NavItem } from "./components/NavBarAndMenu";
import Home from "./pages/Home";
import LanguageSelection from "./pages/LanguageSelection";
import ZhYueTrainings from "./pages/ZhYueTrainings";
import { I18nText } from "./utils/I18n";

import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import Footer from "./components/Footer";


Amplify.configure(awsconfig);

export default function App() {
    // Prepare global states: 
    // `lang` for I18n languages
    // `theme` for color themes (dark or light)
    const [lang, setLang] = React.useState<keyof I18nText>(
        (localStorage.getItem("pustot/0.1/lang") as keyof I18nText) || ("en" as keyof I18nText)
    );

    const systemColor: string =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    // 获取 localStorage 中的 mode 和时间戳
    let storedMode = localStorage.getItem("pustot/0.1/mode");
    let storedTimestamp = localStorage.getItem("pustot/0.1/timestamp");

    // 检查时间戳是否在一小时内
    const isWithinHour = (timestamp: number | null) => {
        if (!timestamp) return false;
        const hourInMillis = 60 * 60 * 1000; // 一小时的毫秒数
        return Date.now() - Number(timestamp) <= hourInMillis;
    };

    // 如果时间戳超过一小时，则恢复到系统颜色
    if (storedTimestamp && !isWithinHour(Number(storedTimestamp))) {
        storedMode = systemColor;
    }

    const [mode, setMode] = React.useState<string>(storedMode || systemColor);

    const toggleColorMode = () => {
        // 保存设置的时间戳
        const timestamp = Date.now().toString();
        localStorage.setItem("pustot/0.1/mode", mode === "light" ? "dark" : "light");
        localStorage.setItem("pustot/0.1/timestamp", timestamp);
        setMode(prevMode => (prevMode === "light" ? "dark" : "light"));
    };

    const theme: Theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode as PaletteMode,
                },
            }),
        [mode]
    );

    const langSetter = (tar: keyof I18nText) => {
        setLang(tar);
    };

    // Prepare items and subpages used in NavBar, SideDrawer and Footer
    const title: I18nText = {
        "en": "甪端 Studling",
        "zh-Hant": "甪端 Studling",
        "zh-Hans": "甪端 Studling",
        "tto-bro": "EeRZ T8eHXQea",
        "tto": "hFCmo mAFKRHm",
        "ja": "甪端 Studling",
        "de": "甪端 Studling",
    };

    const navItems: NavItem[] = [
        {
            name: {
                "zh-Hant": "首頁",
                "zh-Hans": "首页",
                "en": "Home",
                "ja": "ホーム",
                "de": "Startseite",
                "ko": "대문",
                "ko-Han": "大門",
                "eo": "Ĉefpaĝo",
                "fr": "Accueil",
                "vi": "Trang chủ",
                "vi-Han": "張主",
                "es": "Inicio",
                "tto-bro": "6dn2X8aL",
                "tto": "XoV",
            },
            link: "/",
            icon: <HomeIcon />,
        },
        {
            name: {
                "zh-Hant": "關於",
                "zh-Hans": "关于",
                "en": "About",
                "ja": "私について",
                "de": "Über Mich",
                "ko": "나에 대해서",
                "ko-Han": "나에 對해서",
                "eo": "Pri mi",
                "fr": "À propos de moi",
                "vi": "Về tôi",
                "vi-Han": "𡗅碎",
                "es": "Sobre mí",
                "tto-bro": "YQnrHOei",
                "tto": "aCLqSqv",
            },
            link: "https://www.pustot.com/#/about",
            icon: <InfoIcon />,
        },
        {
            name: {
                "zh-Hant": "愛",
                "zh-Hans": "爱",
                "en": "Love",
                "ja": "愛",
                "de": "Liebe",
                "ko": "사랑",
                "ko-Han": "사랑",
                "eo": "Amo",
                "fr": "L'amour",
                "vi": "Tình yêu",
                "vi-Han": "情𢞅",
                "es": "Amor",
                "tto-bro": "Oie3",
                "tto": "re",
            },
            link: "https://love.pustot.com/",
            icon: <FavoriteIcon />,
        },
    ];

    const repoLink = "https://github.com/pustot/studling-frontend";

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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HashRouter>
                <NavBarAndMenu
                    theme={theme}
                    toggleColorMode={toggleColorMode}
                    lang={lang}
                    langSetter={langSetter}
                    title={title}
                    navItems={navItems}
                />

                <br />
                <br />
                <br />

                <Authenticator>

                    {({ signOut, user }) => (
                        <div>
                            <Box p={1} display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
                                <Typography variant="body2">Hello, {email}</Typography>
                                <Button variant="outlined" color="primary" onClick={signOut} style={{ fontSize: '0.75rem' }}>
                                    Sign Out
                                </Button>
                            </Box>

                            <Routes>
                                <Route path="/" element={<LanguageSelection lang={lang} />} />
                                <Route path="/language-selection" element={<LanguageSelection lang={lang} />} />
                                <Route path="/zh-yue" element={<ZhYueTrainings lang={lang} />} />
                                <Route path="/home" element={<Home lang={lang} />} />
                            </Routes>
                        </div>
                    )}



                </Authenticator>

                <br />
                <br />

                <Footer repoLink={repoLink} theme={theme} />
            </HashRouter>
        </ThemeProvider>
    );
}
