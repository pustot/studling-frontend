import {
  Container,
  Stack, Typography
} from '@mui/material';
import "purecss/build/pure.css";
import * as React from "react";
import { useEffect } from "react";
import BackButton from "../../components/BackButton";
import FlashCard from "../../components/FlashCard";
import "../../styles.scss";
import { I18nText } from "../../utils/I18n";
import { promiseDataLarge } from "./data";

export default function CanFlashcards(props: { lang: keyof I18nText }) {
  const { lang } = props;

  const [pronunciationDataLarge, setPronunciationDataLarge] = React.useState([['字', 'zi6']]);
  const [char, setChar] = React.useState('字');
  const [roma, setRoma] = React.useState('zi6');
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    (async () => {
      // const [pronunciationDataSmall, pronunciationDataLarge] =
      //   await Promise.all([promiseDataSmall, promiseDataLarge]);
      // setPronunciationDataSmall(pronunciationDataSmall);
      const pronunciationDataLarge0 = await promiseDataLarge;
      setPronunciationDataLarge(pronunciationDataLarge0);
      setIsInitialized(true);
    })();
  }, []);

  useEffect(() => {
    const boardEvent = window.setInterval(refreshBoard, 4000);
    return () => {
      window.clearInterval(boardEvent);
    };
  }, [isInitialized]);

  const refreshBoard = () => {
    const idx = Math.floor(Math.random() * pronunciationDataLarge.length);
    const [nextchar, nextroma] = pronunciationDataLarge[idx];
    setChar(nextchar);
    setRoma('...');
    window.setTimeout(() => {
      setRoma(nextroma);
    }, 2000);
  }

  return (
    <div>

      <Container maxWidth="sm">
        <BackButton />
        <Stack spacing={4} px={2} pb={4}>
          <Typography>
            Display flashcards with Chinese characters and Jyutping with your comfortable speed.
          </Typography>

          <FlashCard char={char} roma={roma}></FlashCard>

          {/* Search Module */}
          {/* <TextField defaultValue="វិទ្យាស្ថានខុងជឺនៃរាជបណ្ឌិត្យសភាកម្ពុជា" id="input" onChange={(v) => setSentence(v.target.value)}
          multiline
          minRows={2} 
          maxRows={Infinity} />
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="outlined" onClick={() => handleClick()} sx={{width: "auto"}}>Lookup</Button>
        </Stack> */}


          {/* Speed Changing Module */}


        </Stack>
      </Container>
    </div>
  );
}