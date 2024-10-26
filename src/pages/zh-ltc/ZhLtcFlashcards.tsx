import {
    Container,
    FormControlLabel,
    Stack, Switch, Typography
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

// 资料来源：tupa-rime 之字表、词表，以及常用词语表。
// 逻辑：随机展示常用词语表之词，每个词先在 tupa-rime 查询是否有读音，无则罗列单字读音，其中多音字用斜杠分割
// - 《教師語文能力評核（普通話）參照使用普通話詞語表》 https://raw.githubusercontent.com/nk2028/commonly-used-chinese-characters-and-words/refs/heads/main/words.txt

const dialectDictMap: Map<string, Dict> = new Map();

export default function ZhLtcFlashcards(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const [char, setChar] = useState('字');
    const [roma, setRoma] = useState<string | undefined>('dzɨ̀');
    const [isInitialized, setIsInitialized] = useState(false);
    const [isRomaVisible, setIsRomaVisible] = useState(true);
    const [isTupaVisual, setIsTupaVisual] = useState(true);
    const boardEventRef = useRef<number | undefined>(undefined); // 使用 useRef 存储定时器 ID

    useEffect(() => {
        (async () => {
            await loadDict('zh-ltc', dialectConfigMap['zh-ltc'], dialectDictMap)
            setIsInitialized(true);
        })();
    }, []);

    const refreshBoard = useCallback(() => {
        if (boardEventRef.current) {
            window.clearInterval(boardEventRef.current); // 确保只有一个定时器在运行
        }

        const nextchar = hanziUtils.getRandomCommonWord();
        // 若词典无此词读音，则按每字之音，多音字分以斜杠
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
        setIsRomaVisible(false); // 重置 roma 可见状态
        setChar(nextchar);
        setRoma(nextroma);

        // 2 秒后显示 roma
        window.setTimeout(() => {
            setIsRomaVisible(true); // 标记 roma 可见
        }, 2000);

        // 重新设置定时器
        boardEventRef.current = window.setInterval(refreshBoard, 4000);
    }, [isInitialized, isTupaVisual]);

    useEffect(() => {
        if (isInitialized) {
            boardEventRef.current = window.setInterval(refreshBoard, 4000);
        }
        return () => {
            if (boardEventRef.current) {
                window.clearInterval(boardEventRef.current); // 清除定时器
            }
        };
    }, [refreshBoard, isInitialized, isTupaVisual]);

    const handleCardClick = () => {
        if (boardEventRef.current) {
            window.clearInterval(boardEventRef.current); // 清除当前定时器
        }
        if (isRomaVisible) {
            refreshBoard(); // 如果 roma 已显示，则直接刷新
        } else {
            setIsRomaVisible(true); // 如果 roma 未显示，立即显示
            boardEventRef.current = window.setInterval(refreshBoard, 2000);
        }
    };

    return (
        <div>
            <Container maxWidth="sm">
                <BackButton />
                <Stack spacing={4} px={2} pb={4}>
                    <Typography>
                        Display flashcards with Chinese characters and Jyutping with your comfortable speed.
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
                    </Stack>

                    <FlashCard char={char} roma={isRomaVisible ? roma : '...'} onClick={handleCardClick}></FlashCard>

                    {/* Speed Changing Module */}
                </Stack>
            </Container>
        </div>
    );
}
