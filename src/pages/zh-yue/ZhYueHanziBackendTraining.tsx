import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, Button, Container, LinearProgress, TextField, Typography } from "@mui/material";
import { fetchUserAttributes } from 'aws-amplify/auth';
import * as Qieyun from "qieyun";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import BackButton from "../../components/BackButton";
import { Word } from '../../types/Word';
import API from '../../utils/API';
import { I18nText } from "../../utils/I18n";

const BATCH_SIZE = 10;

export default function ZhYueHanziBackendTraining(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const navigate = useNavigate(); // 获取navigate函数
    // 登陆验证相关
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");
    // 训练词表与记录
    const [words, setWords] = useState<Word[]>([]);
    const [qId, setQId] = useState(-1);
    const [userInput, setUserInput] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const correctRate = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;
    const [answerChecked, setAnswerChecked] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    // 记录伦次，即原地开启新一轮新词
    const [trainRound, setTrainRound] = useState(0);

    useEffect(() => {
        if (sessionStorage.getItem('userEmail') != null)
            setUserEmail(sessionStorage.getItem('userEmail')!);
        else {
            fetchUserAttributes().then(userAttributes => {
                const fetchedEmail = userAttributes?.email as string;
                setUserEmail(fetchedEmail);
                sessionStorage.setItem('userEmail', fetchedEmail);
                console.log(fetchedEmail)
            }).catch(err => {
                console.log('用户未登录', err);
                navigate('/login');
            });
        }
    }, []);

    useEffect(() => {
        if (userEmail) {
            API.get<Word[]>(`/api/zh-yue-can-words/random/${BATCH_SIZE}`).then(
                resp => {
                    setQId(-1);
                    setWords(resp.data);
                    setIsLoading(false);
                }
            ).catch(err => {
                console.log('后端错误', err);
            });
        }
    }, [userEmail, trainRound]);

    const startExercise = () => {
        setAnswerChecked(false);  // 重置答案检查状态
        if (words.length > 0) {
            if (qId + 1 < words.length) {
                setQId(prev => prev + 1);
                setUserInput('');
                setFeedback('');
            } else {
                setIsFinished(true);
            }
        }
    };

    useEffect(() => {
        startExercise();
    }, [words]);

    const checkAnswer = () => {
        if (qId >= 0 && qId < words.length) {
            setTotalAttempts(prev => prev + 1);
            const correctAnswers = words[qId].pronunciation.split(',');
            const isCorrect = correctAnswers.map(ans => ans.toLowerCase()).includes(userInput.trim().toLowerCase());
            if (isCorrect) {
                setCorrectAnswers(prev => prev + 1);
                setFeedback(`✅️ 正确！（正确答案：${correctAnswers.join(', ')}）`);
            } else {
                setFeedback(`❌️ 错误！（正确答案：${correctAnswers.join(', ')}）`);
            }
            setAnswerChecked(true);  // 设置答案已检查

            // 更新后端统计数据
            if (userEmail) {
                API.put('/api/zh-yue-can-masteries/update', [{
                    userEmail: userEmail,
                    wordId: words[qId].wordId,
                    correct: isCorrect ? 1 : 0
                }]).then(() => {
                    //console.log('训练结果已更新');
                }).catch(err => {
                    console.log('更新训练结果时出错', err);
                });

                API.put('/api/daily-training-stats/update', [{
                    userEmail: userEmail,
                    languageCode: "zh-yue-can",
                    correct: isCorrect ? 1 : 0
                }]).then(() => {
                    //console.log('每日训练统计已更新');
                }).catch(err => {
                    console.log('更新每日训练统计时出错', err);
                });
            }
        }
    };

    const startNewRoundResetPage = () => {
        setTrainRound(prevKey => prevKey + 1);
        setIsLoading(true);
        setIsFinished(false);
    };

    return (
        <div>
            {isLoading
                ? <Typography>Loading...</Typography>
                :
                <Container maxWidth="md">
                    <BackButton />
                    {isFinished ?
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                            height="80vh"
                        >
                            <Typography variant="h5" py={2}>
                                🎉本轮训练完成！正确率：{correctRate.toFixed(0)}%（{correctAnswers}／{totalAttempts}）
                            </Typography>
                            <Button
                                variant="outlined"
                                color={"primary"}
                                onClick={startNewRoundResetPage}
                                sx={{ margin: 2 }}
                            >
                                开启新一轮
                            </Button>
                        </Box>
                        : <Box marginBottom={4}>
                            <Typography variant="h6" py={2}>请为以下汉字输入粤拼：</Typography>
                            <Typography variant="h4" p={4} sx={{ marginBottom: 2 }}>{words[qId]?.word}</Typography>
                            <TextField
                                label="输入粤拼"
                                variant="outlined"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (!answerChecked) {
                                            checkAnswer();
                                        } else {
                                            startExercise();
                                        }
                                    }
                                }}
                                sx={{ marginBottom: 2 }}
                                autoComplete="off"
                            />
                            <Button
                                variant="contained"
                                color={answerChecked ? "secondary" : "primary"}
                                onClick={answerChecked ? startExercise : checkAnswer}
                                sx={{ margin: 2 }}
                            >
                                {answerChecked ? "继续" : "确定"}
                            </Button>
                            {totalAttempts > 0 && (
                                <>
                                    <Typography variant="body1" sx={{ my: 2 }}>正确率: {correctRate.toFixed(2)}%（{correctAnswers}／{totalAttempts}）</Typography>
                                    <LinearProgress variant="determinate" value={correctRate} sx={{ width: '100%', my: 2 }} />
                                </>
                            )}
                            {feedback && <><Typography
                                my={2}
                                sx={{
                                    marginTop: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: feedback.startsWith('✅️') ? 'green' : 'red',
                                    border: `2px solid ${feedback.startsWith('✅️') ? '#2e7d32' : '#c62828'}`,  // 边框颜色使用深绿或深红
                                    borderRadius: '4px',
                                    padding: 2,
                                    fontWeight: 'bold',
                                    backgroundColor: 'transparent',  // 去掉背景色，使用透明
                                    width: 'fit-content'  // 使得Typography仅占用所需宽度
                                }}
                                gutterBottom
                            >
                                {feedback.startsWith('✅️') ?
                                    <CheckCircleIcon sx={{ mr: 1, color: feedback.startsWith('✅️') ? '#2e7d32' : '#c62828' }} />
                                    :
                                    <ErrorIcon sx={{ mr: 1, color: feedback.startsWith('✅️') ? '#2e7d32' : '#c62828' }} />}
                                {feedback}
                            </Typography>
                                <Typography variant="body1" sx={{ my: 2 }}>
                                    中古汉语: {Qieyun.資料.query字頭(words[qId]?.word).map((v, i) => v.音韻地位.描述).join(", ")}
                                </Typography>
                            </>}
                        </Box>}
                </Container>}
        </div>
    )
}