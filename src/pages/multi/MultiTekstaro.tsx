import {
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup
} from '@mui/material';
import "purecss/build/pure.css";
import * as React from "react";
import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import MyMuiMarkdown from '../../components/MyMuiMarkdown';
import "../../styles.scss";
import { I18nText } from "../../utils/I18n";

export default function MultiTekstaro(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const UN_LANGUAGES = ['zh', 'ru', 'en', 'fr', 'es', 'ar'];
    const DEFAULT_LANGUAGES = ['ja', 'eo', 'ko', 'vi', 'ru', 'ar'];
    const INITIAL_DISPLAY_LIMIT = 32;

    const [markdownContent, setMarkdownContent] = useState('');
    const [rawContent, setRawContent] = useState('');
    const [uniqueLanguages, setUniqueLanguages] = useState(new Set(DEFAULT_LANGUAGES));
    const [validFirstColumns, setValidFirstColumns] = useState(DEFAULT_LANGUAGES);
    const [showAllLanguages, setShowAllLanguages] = useState(false);

    useEffect(() => {
        // 发送 GET 请求获取 Markdown 内容
        fetch('https://raw.githubusercontent.com/pustot/PustoNoto/master/H-Lingvo/H0-9-Kernoj/Tekstaro.md')
            .then(response => response.text())
            .then(content => {
                let inTable = false;
                const lines = content.split('\n');
                const resultLines: string[] = [];

                const languages = new Set<string>();

                lines.forEach(line => {
                    if (line.startsWith('-') || line.startsWith('-|-')) {
                        inTable = true;
                        resultLines.push(line);
                    } else if (line.trim() === '') {
                        inTable = false;
                    } else if (inTable && !line.startsWith('#') && !line.startsWith('-|-')) {
                        const firstCellStart = 0;
                        const firstCellEnd = line.indexOf('|');
                        const firstCell = line.substring(firstCellStart, firstCellEnd).trim();
                        languages.add(firstCell);
                    }
                });

                setUniqueLanguages(languages);
                setRawContent(content);
            })
            .catch(error => console.error('Error fetching Markdown content:', error));
    }, []);

    useEffect(() => {
        let inTable = false;

        const lines = rawContent.split('\n');
        const resultLines: string[] = [];

        lines.forEach(line => {
            if (line.startsWith('-') || line.startsWith('-|-')) {
                inTable = true;
                resultLines.push(line);
            } else if (line.trim() === '') {
                inTable = false;
                resultLines.push(line);
            } else if (inTable && !line.startsWith('#') && !line.startsWith('-|-')) {
                const firstCellStart = 0;
                const firstCellEnd = line.indexOf('|');
                const firstCell = line.substring(firstCellStart, firstCellEnd).trim();
                if (validFirstColumns.includes(firstCell)) {
                    resultLines.push(line);
                }
            } else {
                resultLines.push(line);
            }
        });

        let content = resultLines.join('\n');
        setMarkdownContent(content);
    }, [rawContent, validFirstColumns]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const language = event.target.value;
        if (event.target.checked) {
            setValidFirstColumns(prev => [...prev, language]);
        } else {
            setValidFirstColumns(prev => prev.filter(l => l !== language));
        }
    };

    const displayedLanguages = showAllLanguages
        ? Array.from(uniqueLanguages)
        : Array.from(uniqueLanguages).slice(0, INITIAL_DISPLAY_LIMIT);

    return (
        <div>
            <Container maxWidth="sm">
                <BackButton />
                <div style={{ display: 'flex', gap: '8px', padding: '8px', marginTop: '16px' }}>
                    <Button variant="outlined" onClick={()=>setValidFirstColumns(Array.from(uniqueLanguages))}>全选</Button>
                    <Button variant="outlined" onClick={()=>setValidFirstColumns([])}>全不选</Button>
                    <Button variant="outlined" onClick={()=>setValidFirstColumns(UN_LANGUAGES.filter(lang => uniqueLanguages.has(lang)))}>联合国正式语文</Button>
                    <Button variant="outlined" onClick={()=>setValidFirstColumns(DEFAULT_LANGUAGES)}>默认语言</Button>
                </div>
                <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {displayedLanguages.map(language => (
                        <FormControlLabel
                            key={language}
                            control={
                                <Checkbox
                                    value={language}
                                    onChange={handleCheckboxChange}
                                    checked={validFirstColumns.includes(language)} // 这里控制 checked 状态
                                />
                            }
                            label={language}
                            sx={{ marginRight: 2, marginBottom: 2 }}
                        />
                    ))}
                </FormGroup>
                {uniqueLanguages.size > INITIAL_DISPLAY_LIMIT && (
                    <Button onClick={()=>setShowAllLanguages(prevShowAll => !prevShowAll)} style={{ padding: '4px', marginBottom: '32px' }}>
                        {showAllLanguages ? '折叠' : '展开更多语言'}
                    </Button>
                )}
                <MyMuiMarkdown markdown={markdownContent} />
            </Container>
        </div>
    );
}
