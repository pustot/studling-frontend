import "purecss/build/pure.css";
import * as React from "react";
import "../styles.scss";

import {
    Box,
    Card,
    CardActionArea,
    Chip,
    Container,
    Grid,
    Link as MuiLink,
    Typography
} from "@mui/material";

import { getLocaleText, I18nText } from "../utils/I18n";

interface LanguageCardItem {
    name: string;
    stage: string; // 如 "ComingSoon", "Alpha", "Beta", "Released"
    icon: JSX.Element; // 假设每种语言都有一个图标
    link?: string;
}

const IconFromPublicRepo: React.FC<{ fileName: string }> = ({ fileName }) => {
    return (
        <img
            src={`https://raw.githubusercontent.com/pustot/pustot.github.io/master/public/studling/${fileName}`}
            alt="icon"
            style={{ width: '100%', height: 'auto' }}
        />
    );
}

const languageCardItems: LanguageCardItem[] = [
    {
        name: '中古汉语', stage: 'ComingSoon',
        icon: <IconFromPublicRepo fileName={"studling-icon-zh-ltc.png"} />
    },
    {
        name: '普通话', stage: 'ComingSoon',
        icon: <IconFromPublicRepo fileName={"studling-icon-zh-cmn.webp"} />
    },
    {
        name: '中原官话（菏泽话）', stage: 'ComingSoon',
        icon: <IconFromPublicRepo fileName={"studling-icon-zh-cmn-hza.webp"} />
    },
    { 
        name: '西南官话（石屏话）', stage: 'ComingSoon', 
        icon: <IconFromPublicRepo fileName={"studling-icon-zh-cmn-sph.jpeg"} />
    },
    {
        name: '粤语（广州话）', stage: 'Beta',
        icon: <IconFromPublicRepo fileName={"studling-icon-zh-yue.webp"} />,
        link: "#/zh-yue"
    },
    { 
        name: '吴语（上海话）', stage: 'ComingSoon', 
        icon: <IconFromPublicRepo fileName={"studling-icon-zh-wuu.webp"} />
    },
    {
        name: '英语', stage: 'Alpha',
        icon: <IconFromPublicRepo fileName={"studling-icon-en.webp"} />
    },
    { 
        name: '日语', stage: 'ComingSoon', 
        icon: <IconFromPublicRepo fileName={"studling-icon-ja.webp"} />
    },
    { 
        name: '德语', stage: 'ComingSoon', 
        icon: <IconFromPublicRepo fileName={"studling-icon-de.webp"} />
    },
    { name: '韩语', stage: 'ComingSoon', icon: <div>KO</div> },
    { name: '世界语', stage: 'ComingSoon', icon: <div>EO</div> },
    { name: '法语', stage: 'ComingSoon', icon: <div>FR</div> },
    { name: '越语', stage: 'ComingSoon', icon: <div>VI</div> },
    { name: '西班牙语', stage: 'ComingSoon', icon: <div>ES</div> },
    { name: '闽南语泉漳片（第一优势腔）', stage: 'ComingSoon', icon: <div>ZH-NAN</div> },
    { name: '西南官话（昆明话）', stage: 'ComingSoon', icon: <div>ZH-CMN</div> },
    { name: '闽南语潮汕片', stage: 'ComingSoon', icon: <div>ZH-NAN</div> },
    { name: '客家话', stage: 'ComingSoon', icon: <div>ZH-HAK</div> },
    { name: '荷兰语', stage: 'ComingSoon', icon: <div>NL</div> },
    { name: '瑞典语', stage: 'ComingSoon', icon: <div>SV</div> },
    { name: '葡萄牙语', stage: 'ComingSoon', icon: <div>PT</div> },
    { name: '意大利语', stage: 'ComingSoon', icon: <div>IT</div> },
    { name: '阿拉伯语', stage: 'ComingSoon', icon: <div>AR</div> },
    { name: '俄语', stage: 'ComingSoon', icon: <div>RU</div> },
    { name: '马来语', stage: 'ComingSoon', icon: <div>MS</div> },
    { name: '拉丁语', stage: 'ComingSoon', icon: <div>LA</div> },
    { name: '藏语', stage: 'ComingSoon', icon: <div>BO</div> },
    { name: '壮语', stage: 'ComingSoon', icon: <div>ZA</div> },
    { name: '高棉语', stage: 'ComingSoon', icon: <div>KM</div> },
    { name: '蒙语', stage: 'ComingSoon', icon: <div>MN</div> },
    { name: '满语', stage: 'ComingSoon', icon: <div>MNC</div> },
    { name: '维语', stage: 'ComingSoon', icon: <div>UG</div> },
    { name: '梵语', stage: 'ComingSoon', icon: <div>SA</div> },
    { name: '希伯来语', stage: 'ComingSoon', icon: <div>HE</div> },
    { name: '泰米尔语', stage: 'ComingSoon', icon: <div>TA</div> },
];

export default function LanguageSelection(props: { lang: keyof I18nText }) {
    const { lang } = props;

    // 阶段排序权重
    const stageOrder: Record<string, number> = {
        'Beta': 1,
        'Alpha': 2,
        'ComingSoon': 3,
    };
    // 首先根据阶段排序语言数组
    const sortedLanguages = languageCardItems.sort((a, b) => stageOrder[a.stage] - stageOrder[b.stage]);

    const groupedLanguages = sortedLanguages.reduce((acc, language) => {
        acc[language.stage] = [...(acc[language.stage] || []), language];
        return acc;
    }, {} as Record<string, LanguageCardItem[]>);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
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
                        "en": "Welcome to 甪端 Studling",
                        "zh-Hant": "甪端 Studling",
                        "zh-Hans": "欢迎来到甪端 Studling，一站式多语种学习平台。请选择您要学习的语言。",
                        "tto-bro": "EeRZ T8eHXQea",
                        "tto": "hFCmo mAFKRHm",
                        "ja": "甪端 Studling",
                        "de": "甪端 Studling",
                    },
                    lang
                )}
            </Typography>


            <Box padding={2}>
                {Object.entries(groupedLanguages).map(([stage, langs], stageIndex) => (
                    <Box key={stageIndex} marginBottom={4}>
                        <Typography variant="h5" gutterBottom>
                            {stage === 'Beta' ? 'Beta（公开测试）阶段：' : stage === 'Alpha' ? 'Alpha（内部测试）阶段：' : '即将到来：'}
                        </Typography>
                        <Grid container spacing={2}>
                            {langs.map((language, index) => (
                                <Grid item p={1} xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <MuiLink href={language.link ? `${language.link}` : '#'} underline="none" rel="noopener noreferrer">
                                        <Card sx={{ width: 240, transition: '0.3s ease-in-out', position: 'relative' }}> {/* 调整卡片高度以适应内容 */}
                                            <CardActionArea sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'start', // 从顶部开始排列内容
                                                alignItems: 'center',
                                                //':hover': { filter: 'blur(4px)' }, // 应用模糊效果
                                            }}>
                                                {/* Icon Container with Fixed Size */}
                                                <Box sx={{ height: 160, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                                    {language.icon}
                                                </Box>
                                                {/* Name and Stage Displayed Below Icon */}
                                                <Typography gutterBottom variant="h5" component="div" sx={{ mt: 1, textAlign: 'center' }}>
                                                    {language.name}
                                                </Typography>
                                                <Chip label={language.stage} sx={{ mb: 1 }} />
                                            </CardActionArea>
                                        </Card>
                                    </MuiLink>
                                </Grid>
                            ))}
                        </Grid>

                    </Box>
                ))}
            </Box>

        </Container>
    );
}
