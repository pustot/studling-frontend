import { Box, Button, Card, Container, FormControlLabel, Grid, Stack, Switch, TextareaAutosize, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import * as React from "react";
import { useEffect, useState } from 'react';
import TshetUinh from 'tshet-uinh';
import BackButton from '../../components/BackButton';
import { I18nText, getLocaleText } from "../../utils/I18n";
import { hanziUtils, tupaToMarkings } from '../../utils/SinoUtils';
import { DialectConfig, dialectConfigMap } from './dialectConfig';

// 单语 dict 的类型
export type Dict = Map<string, string[]>;
// 由 dialect 到 dict 的 Map
const dialectDictMap: Map<string, Dict> = new Map();

// 解析 YAML 文件的函数
const parseDialectDictionaryFromYAML = (yamlContent: string): Dict => {
    const lines = yamlContent.split('\n');
    const mapping: Dict = new Map();

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('#') || trimmedLine === '') {
            continue; // 忽略注释和空行
        }

        // 使用制表符分割并只取前两个字段（第三个字段可能存在，表示百分数）
        const [character, pronunciation] = trimmedLine.split('\t').slice(0, 2);
        if (character && pronunciation) {
            if (!mapping.has(character)) {
                mapping.set(character, [pronunciation]);
            } else {
                const pronunciations = mapping.get(character)!;
                if (!pronunciations.includes(pronunciation)) {
                    pronunciations.push(pronunciation);
                }
            }
        }
    }

    return mapping;
};

// 解析 CSV 文件的函数（预留）
const parseDialectDictionaryFromCSV = (csvContent: string): Dict => {
    const lines = csvContent.split('\n');
    const mapping: Dict = new Map();

    // 假设 CSV 文件的每一行格式为 "汉字,发音"
    lines.forEach(line => {
        const [character, pronunciation] = line.split(',');
        if (character && pronunciation) {
            if (!mapping.has(character)) {
                mapping.set(character, [pronunciation]);
            } else {
                const pronunciations = mapping.get(character)!;
                if (!pronunciations.includes(pronunciation)) {
                    pronunciations.push(pronunciation);
                }
            }
        }
    });

    return mapping;
};

export const loadDict = async (dialectName: string, config: DialectConfig, dialectDictMap: Map<string, Dict>) => {
    // 获取或创建一个新的字典
    const existingDict = dialectDictMap.get(dialectName) || new Map();

    for (const link of config.links) {
        try {
            const response = await axios.get(link);
            let dict: Dict;

            if (config.format === 'yaml') {
                dict = parseDialectDictionaryFromYAML(response.data);
            } else if (config.format === 'csv') {
                dict = parseDialectDictionaryFromCSV(response.data);
            } else {
                throw new Error(`Unsupported format: ${config.format}`);
            }

            // 合并内容，以便来源于多个连接
            dict.forEach((pronunciations, character) => {
                if (!existingDict.has(character)) {
                    existingDict.set(character, pronunciations);
                } else {
                    const existingPronunciations = existingDict.get(character)!;
                    pronunciations.forEach(pronunciation => {
                        if (!existingPronunciations.includes(pronunciation)) {
                            existingPronunciations.push(pronunciation);
                        }
                    });
                }
            });
        } catch (error) {
            console.warn(`Failed to load dictionary from ${link} for ${dialectName}:`, error);
        }
    }

    // 更新/设置合并后的字典
    dialectDictMap.set(dialectName, existingDict);
};

export default function ZhLtcSinoDict(props: { lang: keyof I18nText }) {
    const { lang } = props;
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ character: string, pronunciations: { [dialect: string]: string[] } }[]>([]);
    const [showVariants, setShowVariants] = useState(true);
    const [showGuangyunOnly, setShowGuangyunOnly] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const loadDictionaries = async () => {
            const promises = Object.entries(dialectConfigMap).map(([dialectName, config]) =>
                loadDict(dialectName, config, dialectDictMap)
            );

            const results = await Promise.allSettled(promises);

            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Failed to load dictionary ${index + 1}:`, result.reason);
                }
            });
            setIsInitialized(true);
        };

        loadDictionaries();
    }, []);

    useEffect(() => {
        const searchResults: { character: string, pronunciations: { [dialect: string]: string[] } }[] = [];

        const characters = query.split('').map(char => char.trim()).filter(char => hanziUtils.isChinese(char));

        let terms: string[] = [];

        // 新增：尝试直接查询整个词语
        const wholeWordPronunciations: { [dialect: string]: string[] } = {};
        dialectDictMap.forEach((dict, dialect) => {
            const pronunciation = dict.get(query);
            if (pronunciation) {
                wholeWordPronunciations[dialect] = pronunciation;
            } else {
                // 如果未找到整个词的发音，但每个字都是单音节，则可通过每个字符推断
                const charPronunciations = query.split('').map(char => dict.get(char));
                if (charPronunciations.every(p => p && p.length === 1)) { // 每个字只有一个发音
                    wholeWordPronunciations[dialect] = [`(皆为单音字): ${charPronunciations.map(p => p![0]).join(' ')}`];
                }
            }
        });

        if (Object.keys(wholeWordPronunciations).length > 0) {
            searchResults.push({ character: query, pronunciations: wholeWordPronunciations });
        }

        // 获取单字的繁简或异体字
        characters.forEach(character => {
            // 繁简异体字转换逻辑
            let variants = hanziUtils.getHanziVariants(character);

            if (showGuangyunOnly) {
                // 仅查询广韵
                for (let yitiCh of variants) {
                    if (TshetUinh.資料.query字頭(yitiCh).length != 0) {
                        terms.push(yitiCh);
                    }
                }
            } else if (showVariants) {
                // 添加所有变体字
                terms = terms.concat(variants);
            } else {
                terms.push(character);
            }
        });

        terms = Array.from(new Set(terms));

        terms.forEach(term => {
            const pronunciations: { [dialect: string]: string[] } = {};

            dialectDictMap.forEach((dict, dialect) => {
                const currPronunciations = dict.get(term);
                if (currPronunciations) {
                    pronunciations[dialect] = currPronunciations;
                }
            });

            searchResults.push({ character: term, pronunciations });
        });
        setResults(searchResults);
    }, [query, showGuangyunOnly, showVariants]); // 每当 query, showGuangyunOnly, showVariants 变化时重新执行搜索

    return (
        <Container maxWidth="md">
            <BackButton />

            <br />
            <br />

            <Typography variant="h3">
                {getLocaleText(
                    {
                        "zh-Hans": "SinoDict 汉字古今中外读音查询",
                        "zh-Hant": "SinoDict 漢字古今中外讀音查詢",
                        en: "SinoDict",
                        // "ja": "浦司図のホームページ",
                        // "de": "Homepage von Pusto",
                        // "ko": "포사도 홈페이지",
                        // "ko-Han": "浦司圖 홈페이지",
                        // "eo": "Hejmpaĝo de Pusto",
                        // "fr": "Page d'Accueil de Pusto",
                        // "vi": "Trang cá nhân của Phổ Ti Đồ",
                        // "vi-Han": "張個人𧶮浦司圖",
                        // "es": "Página personal de Pusto",
                        // "tto-bro": "Dnr2Zu DaA Ym3HMeH Tvo2X8aL",
                        // "tto": "XoVhaeG D hnCLo LrnKrHL",
                    },
                    lang
                )}
            </Typography>

            <br />
            <br />

            <Typography variant="h6" gutterBottom>
                {getLocaleText(
                    {
                        "zh-Hans":
                            "查询汉字在诸多方言与语言（域外方音）里的发音与罗马字。",
                        "zh-Hant":
                            "查詢漢字在許多方言和語言（域外方音）中的發音和羅馬字。",
                        en:
                            "search Chinese characters and some of their " +
                            "romanizations for many languages (Sino-Xenic pronunciations) and dialects.",
                        ja: "多くの言語（音読み）や方言での漢字とそのローマ字の検索。",
                        de: "Suche nach chinesischen Schriftzeichen und einigen ihrer Romanisierungen für viele Sprachen (Sino-Xenische Aussprachen) und Dialekte.",
                        ko: "다양한 언어 (한자음) 및 방언에 대한 중국 문자 및 로마자의 검색.",
                        // "ko-Han": "浦司圖 홈페이지",
                        eo: "Serĉi ĉinajn signojn kaj kelkajn romanigojn por multaj lingvoj (Ĉina-Faraj prononcoj) kaj dialektoj.",
                        fr: "rechercher des caractères chinois et certaines de leurs romanisations pour de nombreuses langues (prononciations sino-xéniques) et dialectes.",
                        vi: "tìm kiếm ký tự Trung Quốc và một số cách viết lại bằng chữ La Tinh cho nhiều ngôn ngữ (Hán Việt) và các tiếng địa phương.",
                        // "vi-Han": "張個人𧶮浦司圖",
                        es: "buscar caracteres chinos y algunas de sus romanizaciones para muchos idiomas (pronunciaciones sino-xénicas) y dialectos.",
                        // "tto-bro": "Dnr2Zu DaA Ym3HMeH Tvo2X8aL",
                        // "tto": "XoVhaeG D hnCLo LrnKrHL",
                    },
                    lang
                )}
            </Typography>
            <br />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextareaAutosize
                    id="queryTextarea"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ width: "70vw", background: "transparent", fontSize: "1.5rem", color: 'inherit' }}
                    placeholder="Enter Chinese character(s) or romanization(s), or click on `RANDOM HAN`. No inspiration ? Try `文` or `myon`"
                />

                <Stack
                    direction="row"
                    spacing={3}
                    flexWrap="wrap"
                    justifyContent="flex-start"
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showVariants}
                                onChange={() => setShowVariants(!showVariants)}
                                name="繁/簡/異 Conversion"
                                color="primary"
                            />
                        }
                        label={getLocaleText(
                            { "zh-Hans": "繁/简/异体字转换", "zh-Hant": "繁/簡/異體字轉換", en: "繁/簡/異 Conversion" },
                            lang
                        )}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={showGuangyunOnly}
                                onChange={() => setShowGuangyunOnly(!showGuangyunOnly)}
                                name="廣韻 Guangyun Only"
                                color="primary"
                            />
                        }
                        label={getLocaleText(
                            { "zh-Hans": "仅《广韵》", "zh-Hant": "僅《廣韻》", en: "Guangyun Only" },
                            lang
                        )}
                    />

                    <Tooltip title="Random Hanzi from 4159 Most Common Ones (《教師語文能力評核（普通話）參照使用常用字表》)">
                        <Button onClick={() => setQuery(hanziUtils.getRandomCommonHanzi())}>{getLocaleText(
                            { "zh-Hans": "随机汉字", "zh-Hant": "隨機漢字", en: "Random Hanzi" },
                            lang
                        )}</Button>
                    </Tooltip>

                    <Tooltip title="Random Chinese Words from 16339 Most Common Ones (《教師語文能力評核（普通話）參照使用普通話詞語表》)">
                        <Button onClick={() => setQuery(hanziUtils.getRandomCommonWord())}>{getLocaleText(
                            { "zh-Hans": "随机词语", "zh-Hant": "隨機詞語", en: "Random Word" },
                            lang
                        )}</Button>
                    </Tooltip>
                    {!isInitialized && <Typography variant="body2" color="grey" p={1} gutterBottom>
                        词典加载中...
                    </Typography>}
                </Stack>

                {results.length > 0 && (
                    <Box>
                        <Grid container spacing={2}>
                            {results.map((result, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <Card variant="outlined" sx={{ padding: 2 }}>
                                        <Typography variant="h5">{result.character}</Typography>
                                        <Typography variant="body1">{TshetUinh.資料.query字頭(result.character).map((v, i) => v.音韻地位.描述).join(", ")}</Typography>
                                        {Object.keys(dialectConfigMap).map((dialectKey) => {
                                            const pronunciations = result.pronunciations[dialectKey];
                                            if (pronunciations) {
                                                return (
                                                    <>
                                                        {dialectKey == "zh-ltc" && <Typography key={dialectKey + "-visual"} variant="body1">
                                                            <strong>{dialectConfigMap[dialectKey].displayName + "(视)"}:</strong> {pronunciations.map((phraseTupa) => phraseTupa.split(' ').map((charTupa) => tupaToMarkings(charTupa)).join(' ')).join(", ")}
                                                        </Typography>}
                                                        <Typography key={dialectKey} variant="body1">
                                                            <strong>{dialectConfigMap[dialectKey].displayName}:</strong> {pronunciations.join(", ")}
                                                        </Typography>
                                                    </>
                                                );
                                            }
                                            return null;
                                        })}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

            </Box>
        </Container>
    );
}
