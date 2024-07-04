import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import * as React from "react";
import { useEffect, useState } from 'react';
import BackButton from '../../components/BackButton';
import { I18nText } from "../../utils/I18n";

// 单语 dict 的类型
type Dict = Map<string, string[]>;
// 由 language 到 dict 的 Map
const languageDictMap: Map<string, Dict> = new Map();

// 语言配置类型
interface LanguageConfig {
    displayName: string;
    link: string;
    format: 'yaml' | 'csv';
}

// 语言配置映射
const languageConfigMap: { [key: string]: LanguageConfig } = {
    'zh-ltc': {
        displayName: '切',
        link: 'https://raw.githubusercontent.com/nk2028/rime-tupa/main/tupa.dict.yaml',
        format: 'yaml'
    },
    'zh-cmn': {
        displayName: '普',
        link: 'https://raw.githubusercontent.com/rime/rime-terra-pinyin/master/terra_pinyin.dict.yaml',
        format: 'yaml'
    },
    'zh-yue': {
        displayName: '粤',
        link: 'https://raw.githubusercontent.com/rime/rime-cantonese/main/jyut6ping3.chars.dict.yaml',
        format: 'yaml'
    },
    'zh-hak': {
        displayName: '客',
        link: 'https://raw.githubusercontent.com/DaengGWokFook/Asian-Languages/master/Kak-Hak/Yat-Toi/moi-eian.dict.yaml',
        format: 'yaml'
    },
    'zh-nan-tst': {
        displayName: '厦',
        link: 'https://raw.githubusercontent.com/LimTo/etaiBLG/master/banlam_etai.dict.yaml',
        format: 'yaml'
    },
    'zh-nan-die': {
        displayName: '潮',
        link: 'https://raw.githubusercontent.com/kahaani/dieghv/master/dieziu.dict.yaml',
        format: 'yaml'
    }
    // 可以在这里添加更多语言配置
};

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

// 通用的加载字典函数
const loadDict = async (langName: string, config: LanguageConfig) => {
    try {
        const response = await axios.get(config.link);
        let dict: Dict;
        if (config.format === 'yaml') {
            dict = parseDialectDictionaryFromYAML(response.data);
        } else if (config.format === 'csv') {
            dict = parseDialectDictionaryFromCSV(response.data);
        } else {
            throw new Error(`Unsupported format: ${config.format}`);
        }
        languageDictMap.set(langName, dict);
    } catch (error) {
        console.error(`Failed to load dictionary for ${langName}:`, error);
    }
};

export default function ZhLtcSinoDict(props: { lang: keyof I18nText }) {
    const { lang } = props;
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ character: string, pronunciations: { [language: string]: string[] } }[]>([]);

    useEffect(() => {
        const loadDictionaries = async () => {
            const promises = Object.entries(languageConfigMap).map(([langName, config]) =>
                loadDict(langName, config)
            );

            const results = await Promise.allSettled(promises);

            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Failed to load dictionary ${index + 1}:`, result.reason);
                }
            });
        };

        loadDictionaries();
    }, []);

    const handleSearch = () => {
        const searchResults: { character: string, pronunciations: { [language: string]: string[] } }[] = [];

        const characters = query.split('').map(char => char.trim()).filter(char => char);

        characters.forEach(character => {
            const pronunciations: { [language: string]: string[] } = {};

            languageDictMap.forEach((dict, language) => {
                const langsPronunciations = dict.get(character);
                if (langsPronunciations) {
                    pronunciations[language] = langsPronunciations;
                }
            });

            searchResults.push({ character, pronunciations });
        });

        setResults(searchResults);
    };

    return (
        <Container maxWidth="md">
            <BackButton />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Han"
                    multiline
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{ width: 'auto', maxWidth: 200 }}
                >
                    搜索
                </Button>
                <br />
                <br />
                {results.length > 0 && (
                    <Box>
                        <Typography variant="h6">查询结果：</Typography>
                        {results.map((result, index) => (
                            <Box key={index} sx={{ marginBottom: 2 }}>
                                <Typography variant="body1"><strong>汉字:</strong> {result.character}</Typography>
                                {Object.keys(languageConfigMap).map((languageKey) => {
                                    const pronunciations = result.pronunciations[languageKey];
                                    if (pronunciations) {
                                        return (
                                            <Typography key={languageKey} variant="body1">
                                                <strong>{languageConfigMap[languageKey].displayName}:</strong> {pronunciations.join(", ")}
                                            </Typography>
                                        );
                                    }
                                    return null;
                                })}
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
}
