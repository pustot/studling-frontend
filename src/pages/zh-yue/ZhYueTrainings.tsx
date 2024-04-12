import {
    Box,
    Button,
    Card,
    CardActionArea,
    Chip,
    Container,
    Grid,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import "purecss/build/pure.css";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import "../../styles.scss";
import API from "../../utils/API";
import { I18nText, getLocaleText } from "../../utils/I18n";

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

interface Document {
    id: string;
    title: string;
    content: string;
}

const items = [
    { name: "汉字读音自测（纯前端）", link: "hanzi-training", stage: "Beta" },
    { name: "汉字读音抽认卡", link: "flashcards", stage: "Beta" },
    { name: "普转粤难点标注", link: "difficulties-cmn-to-yue", stage: "Beta" },
    { name: "汉字读音自测（后端交互）", link: "", stage: "Alpha" },
    { name: "特有词汇自测", link: "", stage: "Alpha" },
    { name: "普转粤1对1规则练习", link: "", stage: "Alpha" },
    { name: "普转粤1对多规则练习", link: "", stage: "Alpha" },
    { name: "中古汉语音韵地位练习", link: "", stage: "Alpha" },
    { name: "歌词特训", link: "", stage: "Alpha" },
    { name: "掌握情况分析", link: "", stage: "Alpha" },
];

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
            <BackButton />
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

            <Grid container spacing={2}>
                {items.map((item, index) => (
                    <Grid item p={1} xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Card
                            sx={{ width: 240, transition: '0.3s ease-in-out', position: 'relative' }}
                            onClick={() => navigate(item.link)}
                        >
                            <CardActionArea sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'end', // 从底部开始排列内容
                                alignItems: 'center',
                            }}>
                                <Typography gutterBottom variant="h5" component="div" sx={{ m: 1, textAlign: 'center' }}>
                                    {item.name}
                                </Typography>
                                <Chip
                                    label={item.stage}
                                    sx={{
                                        mb: 1,
                                        backgroundColor: item.stage === "Beta" ? '#6002EE' : '#e0e0e0',  // ？色背景显眼，其他为灰色
                                        color: item.stage === "Beta" ? '#fff' : 'rgba(0, 0, 0, 0.87)',  // 白色字体与？色背景配合，黑色字体与灰色背景配合
                                        fontWeight: item.stage === "Beta" ? 'bold' : 'normal'
                                    }}
                                />
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 2, mt: 8 }}>
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
