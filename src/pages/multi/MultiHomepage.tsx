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
    { name: "多语言核心课本", link: "tekstaro", stage: "Beta" },
];

export default function MultiHomepage(props: { lang: keyof I18nText }) {
    const { lang } = props;

    return (
        <Container maxWidth="md">

            <BackButton />

            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {getLocaleText(
                    {
                        "en": "Multilingual Core",
                        "zh-Hant": "多語言核心",
                        "zh-Hans": "多语言核心",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {getLocaleText(
                    {
                        "zh-Hans": "探究快速上手语言、达到基本交流所需的最少核心内容。",
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
