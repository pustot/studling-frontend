import { Box, Button, Container, TextField } from '@mui/material';
import axios from 'axios';
import * as React from "react";
import { useEffect, useState } from 'react';
import { I18nText } from "../../utils/I18n";

type Dictionary = Record<string, string>;

export default function HanromHanVsRom(props: { lang: keyof I18nText }) {
    const [hanInput, setHanInput] = useState('');
  const [romInput, setRomInput] = useState('');
  const [dictionary, setDictionary] = useState<Dictionary>({});
  const [reverseDictionary, setReverseDictionary] = useState<Dictionary>({});

  useEffect(() => {
    const loadDictionary = async () => {
      const response = await axios.get('https://raw.githubusercontent.com/pustot/world-building/main/Hanroman-leks-kolekt.csv');
      const lines = response.data.split('\n');
      const dict: Dictionary = {};
      const revDict: Dictionary = {};

      lines.forEach((line: string) => {
        const [han, rom] = line.split(',');
        if (han && rom) {
          dict[han.trim()] = rom.trim();
          revDict[rom.trim()] = han.trim();
        }
      });

      setDictionary(dict);
      setReverseDictionary(revDict);
    };

    loadDictionary();
  }, []);

  const handleHanToRom = () => {
    let result = '';
    let previousWasChinese = false;
    for (let i = 0; i < hanInput.length; i++) {
      const char = hanInput[i];
      if (char === ' ') {
        result += ' ';
        previousWasChinese = false;
        continue;
      }
      const rom = dictionary[char] || char;
      if (previousWasChinese && dictionary[char]) {
        result += '-';
      }
      result += rom;
      previousWasChinese = !!dictionary[char];
    }
    setRomInput(result);
  };

  const handleRomToHan = () => {
    // 使用正则表达式来分割词组、连字符、标点符号及空格
    const tokens = romInput.split(/(\s+|[\w'-]+|[^\w\s])/).filter(token => token);
    const result = tokens.map(token => {
      // 处理由连字符连接的词组
      if (token.includes('-')) {
        return token.split('-').map(word => reverseDictionary[word] || word).join('');
      } else if (token.match(/^\s+$|^[\w'-]+$/)) {
        // 如果是空格或单词，则查找字典，如果没有找到，返回原词
        return reverseDictionary[token] || token;
      } else {
        // 直接返回标点符号
        return token;
      }
    }).join('');
  
    setHanInput(result);
  };
  
  

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Han" multiline value={hanInput} onChange={e => setHanInput(e.target.value)} variant="outlined" />
                <Button variant="contained" onClick={handleHanToRom}>汉-罗</Button>
                <br/>
                <br/>
                <TextField label="Rom" multiline value={romInput} onChange={e => setRomInput(e.target.value)} variant="outlined" />
                <Button variant="contained" onClick={handleRomToHan}>罗-汉</Button>
            </Box>
        </Container>
    );
};
