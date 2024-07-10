interface DailyTrainingStats {
    userId: number;
    languageCode: string;
    trainingDate: string; // 使用 string 类型表示日期
    totalAttempts: number;
    correctAttempts: number;
    incorrectAttempts: number;
}