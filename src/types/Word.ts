export interface Word {
    wordId: number;
    word: string;
    pronunciation: string;
    meaning: string | null;
    exampleCombination: string | null;
    exampleSentence: string | null;
};