import {
    Container,
    Typography
} from "@mui/material";
import "purecss/build/pure.css";
import * as React from "react";
import BackButton from "../../components/BackButton";
import LangHomeCardContainer from "../../components/LangHomeCardContainer";
import "../../styles.scss";
import { I18nText, getLocaleText } from "../../utils/I18n";

const items = [
    { name: "汉字古今中外读音查询", link: "sino-dict", stage: "Beta" },
    { name: "中古汉语读音抽认卡", link: "flashcards", stage: "Beta" },
];

export default function ZhLtcHomepage(props: { lang: keyof I18nText }) {
    const { lang } = props;

    return (
        <Container maxWidth="md">

            <BackButton />

            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {getLocaleText(
                    {
                        "en": "Middle Chinese, Chinese Dialects (Topolects) and Sino-Xenic Pronunciations",
                        "zh-Hant": "中古漢語與方言",
                        "zh-Hans": "中古汉语与方言",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {getLocaleText(
                    {
                        "en": "Middle Chinese phonology, and collections and comparisons of modern pronunciations in dialects (topolects) and sino-xenic systems.",
                        "zh-Hant": "中古漢語音韻學，並收集與比較現代方言與域外方音。",
                        "zh-Hans": "中古汉语音韵学，并收集与比较现代方言与域外方音。",
                    },
                    lang
                )}
            </Typography>

            <br />
            <br />

            <LangHomeCardContainer items={items} />

        </Container>
    );
}
