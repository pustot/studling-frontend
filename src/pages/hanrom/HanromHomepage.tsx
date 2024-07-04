import {
    Container,
    Link as MuiLink,
    Typography
} from "@mui/material";
import "purecss/build/pure.css";
import * as React from "react";
import BackButton from "../../components/BackButton";
import "../../styles.scss";
import { I18nText, getLocaleText } from "../../utils/I18n";
import LangHomeCardContainer from "../../components/LangHomeCardContainer";

const items = [
    { name: "汉罗双文互转", link: "han-vs-rom", stage: "Beta" },
];

export default function HanromHomepage(props: { lang: keyof I18nText }) {
    const { lang } = props;

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

            <LangHomeCardContainer items={items} />

        </Container>
    );
}
