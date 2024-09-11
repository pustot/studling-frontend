import '@aws-amplify/ui-react/styles.css';
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import { CssBaseline, PaletteMode } from "@mui/material";
import { Theme, ThemeProvider, createTheme } from "@mui/material/styles";
import { Amplify } from 'aws-amplify';
import "purecss/build/pure.css";
import * as React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import awsconfig from './aws-exports'; // 如果你通过 Amplify CLI 初始化，配置信息会自动生成在这个文件
import Footer from "./components/Footer";
import NavBarAndMenu, { NavItem } from "./components/NavBarAndMenu";
import HanromHanVsRom from './pages/hanrom/HanromHanVsRom';
import HanromHomepage from "./pages/hanrom/HanromHomepage";
import Home from "./pages/Home";
import LanguageSelection from "./pages/LanguageSelection";
import LoginPage from './pages/LoginPage';
import MultiHomepage from './pages/multi/MultiHomepage';
import MultiTekstaro from './pages/multi/MultiTekstaro';
import ZhLtcHomepage from './pages/zh-ltc/ZhLtcHomepage';
import ZhLtcSinoDict from './pages/zh-ltc/ZhLtcSinoDict';
import CanDifficultiesCmnToYue from './pages/zh-yue-can/CanDifficultiesCmnToYue';
import CanFlashcards from './pages/zh-yue-can/CanFlashcards';
import CanHanziTrainingNonSynced from './pages/zh-yue-can/CanHanziTrainingNonSynced';
import CanHanziTrainingSynced from './pages/zh-yue-can/CanHanziTrainingSynced';
import CanHomepage from "./pages/zh-yue-can/CanHomepage";
import "./styles.scss";
import { I18nText } from "./utils/I18n";

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
                "zh-Hant": "關於作者",
                "zh-Hans": "关于作者",
                "en": "About the Author",
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

    const repoLink = "https://github.com/pustot/studling-backend";

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

                <Routes>
                    <Route path="/" element={<LanguageSelection lang={lang} />} >
                    </Route>
                    <Route path="/login" element={<LoginPage lang={lang} />} />
                    <Route path="/language-selection" element={<LanguageSelection lang={lang} />} />
                    {/* Home 页已取消，改为从语言选择开始 */}
                    <Route path="/home" element={<Home lang={lang} />} />

                    {/* 分语言诸页面 */}
                    {/* 多语言核心 */}
                    <Route path="/multi/tekstaro" element={<MultiTekstaro lang={lang} />} />
                    <Route path="/multi" element={<MultiHomepage lang={lang} />} />
                    {/* 中古汉语及方言 ISO: zh-ltc （注：ISO 693-3 中，英文称 Late Middle Chinese，中文仍称中古汉语） */}
                    <Route path="/zh-ltc" element={<ZhLtcHomepage lang={lang} />} />
                    <Route path="/zh-ltc/sino-dict" element={<ZhLtcSinoDict lang={lang} />} />
                    {/* 粤语（广州话） ISO: zh-yue，细分 `zh-yue-can` */}
                    <Route path="/zh-yue-can" element={<CanHomepage lang={lang} />} />
                    <Route path="/zh-yue-can/hanzi-training-synced" element={<CanHanziTrainingSynced lang={lang} />} />
                    <Route path="/zh-yue-can/hanzi-training-non-synced" element={<CanHanziTrainingNonSynced lang={lang} />} />
                    <Route path="/zh-yue-can/flashcards" element={<CanFlashcards lang={lang} />} />
                    <Route path="/zh-yue-can/difficulties-cmn-to-yue" element={<CanDifficultiesCmnToYue lang={lang} />} />
                    {/* 汉罗文（人造语言） */}
                    <Route path="/hanrom" element={<HanromHomepage lang={lang} />} />
                    <Route path="/hanrom/han-vs-rom" element={<HanromHanVsRom lang={lang} />} />
                </Routes>

                <br />
                <br />

                <Footer repoLink={repoLink} theme={theme} />
            </HashRouter>
        </ThemeProvider>
    );
}
