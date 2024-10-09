import {
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

    const [markdownContent, setMarkdownContent] = useState('');
    const [rawContent, setRawContent] = useState('');
    const [uniqueLanguages, setUniqueLanguages] = useState(new Set(['ja', 'eo', 'ko', 'vi', 'ru', 'ar']));
    const [validFirstColumns, setValidFirstColumns] = useState(['ja', 'eo', 'ko', 'vi', 'ru', 'ar']);

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

    return (
        <div>
            <Container maxWidth="sm">
                <BackButton />
                <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {Array.from(uniqueLanguages).map(language => (
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
                <MyMuiMarkdown markdown={markdownContent} />
            </Container>
        </div>
    );
}
