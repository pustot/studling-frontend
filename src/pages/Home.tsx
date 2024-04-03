import "purecss/build/pure.css";
import * as React from "react";
import "../styles.scss";

import { Container, Grid, IconButton, Link as MuiLink, Stack, Typography } from "@mui/material";

import { getLocaleText, I18nText } from "../utils/I18n";

export default function Home(props: { lang: keyof I18nText }) {
    const { lang } = props;

    return (
            <Container maxWidth="md">
            <Typography variant="h5">
                {getLocaleText(
                    {
                        "en": "Chenxi Yang",
                        "zh-Hant": "楊晨曦",
                        "zh-Hans": "杨晨曦",
                        "tto-bro": "EeRZ T8eHXQea",
                        "tto": "hFCmo mAFKRHm",
                        "ja": "楊　晨曦（よう　しんぎ）",
                        "de": "Chenxi Yang",
                    },
                    lang
                )}
            </Typography>
            </Container>
    );
}
