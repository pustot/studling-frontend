import {
  Container,
  Stack, Typography
} from '@mui/material';
import "purecss/build/pure.css";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import BackButton from "../../components/BackButton";
import FlashCard from "../../components/FlashCard";
import "../../styles.scss";
import { I18nText } from "../../utils/I18n";
import { promiseDataLarge } from "./data";

export default function CanFlashcards(props: { lang: keyof I18nText }) {
  const { lang } = props;

  const [pronunciationDataLarge, setPronunciationDataLarge] = useState([['字', 'zi6']]);
  const [char, setChar] = useState('字');
  const [roma, setRoma] = useState('zi6');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRomaVisible, setIsRomaVisible] = useState(true);
  const boardEventRef = useRef<number | undefined>(undefined); // 使用 useRef 存储定时器 ID

  useEffect(() => {
    (async () => {
      const pronunciationDataLarge0 = await promiseDataLarge;
      setPronunciationDataLarge(pronunciationDataLarge0);
      setIsInitialized(true);
    })();
  }, []);

  const refreshBoard = useCallback(() => {
    if (boardEventRef.current) {
      window.clearInterval(boardEventRef.current); // 确保只有一个定时器在运行
    }

    const idx = Math.floor(Math.random() * pronunciationDataLarge.length);
    const [nextchar, nextroma] = pronunciationDataLarge[idx];
    setIsRomaVisible(false); // 重置 roma 可见状态
    setChar(nextchar);
    setRoma(nextroma);

    // 2 秒后显示 roma
    window.setTimeout(() => {
      setIsRomaVisible(true); // 标记 roma 可见
    }, 2000);

    // 重新设置定时器
    boardEventRef.current = window.setInterval(refreshBoard, 4000);
  }, [pronunciationDataLarge]);

  useEffect(() => {
    if (isInitialized) {
      boardEventRef.current = window.setInterval(refreshBoard, 4000);
    }
    return () => {
      if (boardEventRef.current) {
        window.clearInterval(boardEventRef.current); // 清除定时器
      }
    };
  }, [refreshBoard, isInitialized]);

  const handleCardClick = () => {
    if (boardEventRef.current) {
      window.clearInterval(boardEventRef.current); // 清除当前定时器
    }
    if (isRomaVisible) {
      refreshBoard(); // 如果 roma 已显示，则直接刷新
    } else {
      setRoma(prevRoma => (prevRoma === '...' ? pronunciationDataLarge[Math.floor(Math.random() * pronunciationDataLarge.length)][1] : prevRoma));
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

          <FlashCard char={char} roma={isRomaVisible ? roma : '...'} onClick={handleCardClick}></FlashCard>

          {/* Speed Changing Module */}
        </Stack>
      </Container>
    </div>
  );
}
