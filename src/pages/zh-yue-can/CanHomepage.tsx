import {
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import "purecss/build/pure.css";
import * as React from "react";
import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import LangHomeCardContainer from "../../components/LangHomeCardContainer";
import "../../styles.scss";
import API from "../../utils/API";
import { I18nText, getLocaleText } from "../../utils/I18n";
import { getUserEmailPromise } from "../LoginPage";

interface Document {
    id: string;
    title: string;
    content: string;
}

const items = [
    { name: "汉字拼读训练（云端记录，需👤登陆）", link: "hanzi-training-synced", stage: "Beta" },
    { name: "汉字拼读训练（无记录）", link: "hanzi-training-non-synced", stage: "Beta" },
    { name: "普转粤难点标注", link: "difficulties-cmn-to-yue", stage: "Beta" },
    { name: "汉字读音抽认卡", link: "flashcards", stage: "Beta" },
    { name: "特有词汇训练", link: "", stage: "Alpha" },
    { name: "普转粤1对1规则练习", link: "", stage: "Alpha" },
    { name: "普转粤1对多规则练习", link: "", stage: "Alpha" },
    { name: "中古汉语音韵地位练习", link: "", stage: "Alpha" },
    { name: "歌词特训", link: "", stage: "Alpha" },
    { name: "掌握情况分析", link: "", stage: "Alpha" },
];

export default function CanHomepage(props: { lang: keyof I18nText }) {
    const { lang } = props;
    const [dailyStats, setDailyStats] = useState<DailyTrainingStats | null>(null);
    const [userEmail, setUserEmail] = useState(sessionStorage.getItem('userEmail'));

    useEffect(() => {
        getUserEmailPromise().then(emailAndCognitoSub => {
            if (emailAndCognitoSub) {
                const [email, cognitoSub] = emailAndCognitoSub;
                setUserEmail(email);
                console.log(email);
            }
        });
    }, []);

    useEffect(() => {
        if (userEmail) {
            API.get<DailyTrainingStats>(`/api/daily-training-stats/today`, {
                params: {
                    userEmail: userEmail, // 替换为实际的用户邮箱
                    languageCode: 'zh-yue-can' // 替换为实际的语言代码
                }
            }).then(response => {
                setDailyStats(response.data);
            }).catch(err => {
                console.log('后端错误', err);
            });
        }
    }, [userEmail]);

    const [searchValue, setSearchValue] = useState<string>(''); // 添加搜索框的状态
    const [searchResults, setSearchResults] = useState<Document[]>([]);

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
            <BackButton />
            <Typography variant="h5" p={2}>
                {getLocaleText(
                    {
                        "en": "Cantonese",
                        "zh-Hant": "粵語（廣州話）",
                        "zh-Hans": "粤语（广州话）",
                        "tto-bro": "YnrZ2 Tn X8FrtE3",
                        "tto": "YnmZ9tnFr",
                        "ja": "粤語（広東語）",
                        "de": "Kantonesisch",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1" p={2}>
                {getLocaleText(
                    {
                        "en": "Welcome to 甪端 Studling, your one-stop multilingual learning platform.",
                        "zh-Hant": "歡迎來到甪端 Studling，一站式多語種學習平臺。",
                        "zh-Hans": "欢迎来到甪端 Studling，一站式多语种学习平台。",
                    },
                    lang
                )}
            </Typography>

            {dailyStats && <Typography variant="h6" align="center" p={2}>
                🏆 今日已训练 {dailyStats.totalAttempts} 个条目，正确率 {(dailyStats.correctAttempts * 100.0 / dailyStats.totalAttempts).toFixed(1)}%
            </Typography>}

            <LangHomeCardContainer items={items} />

            {/* 以下为文本搜索功能，建设中 */}
            <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 2, mt: 8 }}>
                Below are test features:
            </Typography>

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
