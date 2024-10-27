import {
    Container,
    FormControlLabel,
    Stack, Switch, Typography,
    useTheme
} from '@mui/material';
import "purecss/build/pure.css";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import BackButton from "../../components/BackButton";
import FlashCard from "../../components/FlashCard";
import "../../styles.scss";
import { getLocaleText, I18nText } from "../../utils/I18n";
import { hanziUtils, tupaToMarkings } from '../../utils/SinoUtils';
import { Dict, loadDict } from './ZhLtcSinoDict';
import { dialectConfigMap } from './dialectConfig';

const dialectDictMap: Map<string, Dict> = new Map();

export default function ZhLtcFlashcards(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const theme = useTheme();

    const [char, setChar] = useState('字');
    const [roma, setRoma] = useState<string | undefined>('dzɨ̀');
    const [isInitialized, setIsInitialized] = useState(false);
    const [isHiddenVisible, setIsHiddenVisible] = useState(false); // 控制隐藏内容的可见性
    const [isTupaVisual, setIsTupaVisual] = useState(true);
    const [charFirst, setCharFirst] = useState(false); // 控制显示顺序亦即是隐藏汉字还是隐藏读音
    const boardEventRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        (async () => {
            await loadDict('zh-ltc', dialectConfigMap['zh-ltc'], dialectDictMap)
            setIsInitialized(true);
        })();
    }, []);

    const refreshBoard = useCallback(() => {
        if (boardEventRef.current) {
            window.clearInterval(boardEventRef.current);
        }

        const nextchar = hanziUtils.getRandomCommonWord();
        let nextroma;
        if (isTupaVisual) {
            nextroma = dialectDictMap.get('zh-ltc')?.get(nextchar)
                ? dialectDictMap.get('zh-ltc')!.get(nextchar)!.map((pron) => pron.split(' ').map(x => tupaToMarkings(x)).join(' ')).join('/')
                : nextchar.split('').map((char, index) => {
                    return dialectDictMap.get('zh-ltc')?.get(char)?.map(x => tupaToMarkings(x)).join('/')
                }).join(' ');
        } else {
            nextroma = dialectDictMap.get('zh-ltc')?.get(nextchar)
                ? dialectDictMap.get('zh-ltc')!.get(nextchar)!.join('/')
                : nextchar.split('').map((char, index) => {
                    return dialectDictMap.get('zh-ltc')?.get(char)?.join('/')
                }).join(' ');
        }

        setIsHiddenVisible(false); // 重置隐藏内容的可见性
        setChar(nextchar);
        setRoma(nextroma);

        // 2 秒后根据显示顺序显示隐藏内容
        window.setTimeout(() => {
            setIsHiddenVisible(true);
        }, 2000);

        boardEventRef.current = window.setInterval(refreshBoard, 4000);
    }, [isInitialized, isTupaVisual, charFirst]);

    useEffect(() => {
        if (isInitialized) {
            boardEventRef.current = window.setInterval(refreshBoard, 4000);
        }
        return () => {
            if (boardEventRef.current) {
                window.clearInterval(boardEventRef.current);
            }
        };
    }, [refreshBoard, isInitialized, isTupaVisual]);

    const handleCardClick = () => {
        if (boardEventRef.current) {
            window.clearInterval(boardEventRef.current);
        }
        if (isHiddenVisible) {
            refreshBoard(); // 如果隐藏内容已显示，则直接刷新
        } else {
            setIsHiddenVisible(true); // 如果隐藏内容未显示，立即显示
            boardEventRef.current = window.setInterval(refreshBoard, 2000);
        }
    };

    return (
        <div>
            <Container maxWidth="sm">
                <BackButton />
                <Stack spacing={4} px={2} pb={4}>
                    <Typography>
                        Display flashcards with Chinese characters and Middle Chinese Pronunciation/Pinyin with your comfortable order.
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={3}
                        flexWrap="wrap"
                        justifyContent="flex-start"
                    >

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isTupaVisual}
                                    onChange={() => setIsTupaVisual(!isTupaVisual)}
                                    name="TUPA 視覺優化"
                                    color="primary"
                                />
                            }
                            label={getLocaleText(
                                { "zh-Hans": "TUPA 视觉优化", "zh-Hant": "TUPA 視覺優化", en: "TUPA Visual" },
                                lang
                            )}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={charFirst}
                                    onChange={() => setCharFirst(!charFirst)}
                                    name="显示顺序"
                                    color="primary"
                                />
                            }
                            label={
                                <span>
                                    <Typography
                                        variant="body1"
                                        style={{
                                            color: charFirst ? theme.palette.text.disabled : theme.palette.text.primary,
                                            display: 'inline',
                                        }}
                                    >
                                        {getLocaleText(
                                            { "zh-Hans": "先看音", "zh-Hant": "先看音", en: "Tupa First" },
                                            lang
                                        )}
                                    </Typography>
                                    <span> / </span>
                                    <Typography
                                        variant="body1"
                                        style={{
                                            color: charFirst ? theme.palette.text.primary : theme.palette.text.disabled,
                                            display: 'inline',
                                        }}
                                    >
                                        {getLocaleText(
                                            { "zh-Hans": "先看字", "zh-Hant": "先看字", en: "Hanzi First" },
                                            lang
                                        )}
                                    </Typography>
                                </span>
                            }
                        />
                    </Stack>

                    {/* 根据 charFirst 和 isHiddenVisible 显示内容 */}
                    <FlashCard
                        char={!charFirst ? (isHiddenVisible ? char : '...') : char}
                        roma={charFirst ? (isHiddenVisible ? roma : '...') : roma}
                        onClick={handleCardClick}
                    />

                </Stack>
            </Container>
        </div>
    );
}
