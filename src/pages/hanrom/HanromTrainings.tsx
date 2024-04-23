import {
    Card,
    CardActionArea,
    Chip,
    Container,
    Grid,
    Link as MuiLink,
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

interface Document {
    id: string;
    title: string;
    content: string;
}

const items = [
    { name: "汉罗双文互转", link: "han-vs-rom", stage: "Beta" },
];

export default function ZhYueTrainings(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const navigate = useNavigate();

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
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {getLocaleText(
                    {
                        "en": "Hanroman",
                        "zh-Hant": "漢羅文",
                        "zh-Hans": "汉罗文",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {getLocaleText(
                    {
                        "en": "A synthetic language that integrates Chinese and Western elements, combining Latin vocabulary with Chinese grammar: The Latin vocabulary, highly recognized internationally, corresponds one-to-one with Chinese characters, accommodating reading habits of both East and West; the grammar is primarily based on Chinese, thus highly analytic and without morphological changes, yet compatible with some convenient syntactic structures of Latin or Western languages.",
                        "zh-Hant": "貫通中西，綜合拉丁語詞彙與漢語語法的人造語言：詞彙來自國際認知度甚高的拉丁語，同時與漢字一一對應，兼顧東西閱讀習慣；語法主要參考漢語，故高度分析化且無詞形變化，但兼容拉丁語或西方語言一些較方便的語法結構。",
                        "zh-Hans": "贯通中西，综合拉丁语词汇与汉语语法的人造语言：词汇来自国际认知度甚高的拉丁语，同时与汉字一一对应，兼顾东西阅读习惯；语法主要参考汉语，故高度分析化且无词形变化，但兼容拉丁语或西方语言一些较方便的语法结构。",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                <MuiLink href="https://github.com/pustot/world-building/blob/main/Hanroman-lingua-demo.md" target="_blank" rel="noopener">Demo</MuiLink>
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                <MuiLink href="https://github.com/pustot/world-building/blob/main/Hanroman-leks-kolekt.csv" target="_blank" rel="noopener">lex-kolekt (詞集)</MuiLink>
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                graki Simplingua divid-fru inspir et Latin leks list (謝 Simplingua 分享 靈感 與 Latin 詞 列) <MuiLink href="https://zcyzcy88.github.io/Simplingua/Simplingua%E8%AF%8D%E5%85%B8.htm" target="_blank" rel="noopener">Simplingua 词典</MuiLink>
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                graki Wiktionary divid-fru ski de Latin lingu (謝 Wiktionary 分享 知 啲 Latin 語) <MuiLink href="https://en.wiktionary.org/" target="_blank" rel="noopener">Wiktionary</MuiLink>
            </Typography>

            <br />
            <br />

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

        </Container>
    );
}
