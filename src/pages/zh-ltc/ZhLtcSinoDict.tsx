import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import * as React from "react";
import { useEffect, useState } from 'react';
import BackButton from '../../components/BackButton';
import { I18nText } from "../../utils/I18n";
import { dialectConfigMap, DialectConfig } from './dialectConfig';

// 单语 dict 的类型
type Dict = Map<string, string[]>;
// 由 dialect 到 dict 的 Map
const dialectDictMap: Map<string, Dict> = new Map();

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
const loadDict = async (dialectName: string, config: DialectConfig) => {
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
        dialectDictMap.set(dialectName, dict);
    } catch (error) {
        console.error(`Failed to load dictionary for ${dialectName}:`, error);
    }
};

export default function ZhLtcSinoDict(props: { lang: keyof I18nText }) {
    const { lang } = props;
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ character: string, pronunciations: { [dialect: string]: string[] } }[]>([]);

    useEffect(() => {
        const loadDictionaries = async () => {
            const promises = Object.entries(dialectConfigMap).map(([dialectName, config]) =>
                loadDict(dialectName, config)
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
        const searchResults: { character: string, pronunciations: { [dialect: string]: string[] } }[] = [];

        const characters = query.split('').map(char => char.trim()).filter(char => char);

        characters.forEach(character => {
            const pronunciations: { [dialect: string]: string[] } = {};

            dialectDictMap.forEach((dict, dialect) => {
                const currPronunciations = dict.get(character);
                if (currPronunciations) {
                    pronunciations[dialect] = currPronunciations;
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
                                {Object.keys(dialectConfigMap).map((dialectKey) => {
                                    const pronunciations = result.pronunciations[dialectKey];
                                    if (pronunciations) {
                                        return (
                                            <Typography key={dialectKey} variant="body1">
                                                <strong>{dialectConfigMap[dialectKey].displayName}:</strong> {pronunciations.join(", ")}
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
