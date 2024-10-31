import * as OpenCC from "opencc-js";
// import Yitizi from 'yitizi'; // 模块定义中没有默认导出，故需命名导入的方式
import * as Yitizi from 'yitizi';

class HanziUtils {
  private commonHanzi: string[] = [];
  private commonWords: string[] = [];
  private isHanziFetched = false;
  private isWordsFetched = false;
  public converterCH = OpenCC.Converter({ from: "cn", to: "hk" });
  public converterHC = OpenCC.Converter({ from: "hk", to: "cn" });
  private converterHT = OpenCC.Converter({ from: "hk", to: "tw" });
  private converterHJ = OpenCC.Converter({ from: "hk", to: "jp" });

  constructor() {
    this.fetchCommonHanzi();
    this.fetchCommonWords();
  }

  private async fetchCommonHanzi() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/nk2028/commonly-used-chinese-characters-and-words/main/char.txt');
      const text = await response.text();
      this.commonHanzi = text.split('\n').filter(char => char.trim() !== '');
      this.isHanziFetched = true;
    } catch (error) {
      console.error('Failed to fetch common hanzi:', error);
    }
  }

  private async fetchCommonWords() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/nk2028/commonly-used-chinese-characters-and-words/refs/heads/main/words.txt');
      const text = await response.text();
      this.commonWords = text.split('\n').filter(char => char.trim() !== '');
      this.isWordsFetched = true;
    } catch (error) {
      console.error('Failed to fetch common Chinese words:', error);
    }
  }

  public getRandomCommonHanzi(): string {
    if (!this.isHanziFetched || this.commonHanzi.length === 0) {
      return '字';
    }
    const randomIndex = Math.floor(Math.random() * this.commonHanzi.length);
    return this.commonHanzi[randomIndex];
  }

  public getRandomCommonWord(): string {
    if (!this.isWordsFetched || this.commonWords.length === 0) {
      return '詞語';
    }
    const randomIndex = Math.floor(Math.random() * this.commonWords.length);
    return this.commonWords[randomIndex];
  }

  public isChinese = (s: string): boolean => {
    // CJK Unified Ideographs (4E00–9FFF)
    // CJK Unified Ideographs Extension A (3400–4DBF)
    return /[\u4e00-\u9fa5]/.test(s) || /[\u3400-\u4dbf]/.test(s);
  }

  public getHanziVariants = (character: string): string[] => {
    let ch_hk = this.converterCH(character);
    let variants = [ch_hk, this.converterHT(ch_hk), this.converterHC(ch_hk), this.converterHJ(ch_hk), ...Yitizi.get(ch_hk)];
    return variants;
  }
}

export const hanziUtils = new HanziUtils();

// Convert tupa, which uses only 26 ASCII letters, to broader range of letters
// 原则：既然不再限于26字母，就多用些字母，尽量短、尽量靠拢IPA，但避免与tupa冲突者（如 y、j）
export function tupaToMarkings(tupa: string): string {
  // Step 1: Replace specific substrings
  tupa = tupa
    // basic
    .replace(/ae/g, 'aˤ')
    .replace(/ee/g, 'eˤ')
    .replace(/oeu/g, 'oˤ')
    .replace(/ng/g, 'ŋ')
    .replace(/ou/g, 'ᵒu')
    // Consonant: q -> ʔ (when q is at the beginning)
    .replace(/^q/, 'ʔ')
    // Consonant: h -> x ? (when h is at the beginning) (use h or x?)
    .replace(/^h/, 'x')
    // Consonant: h -> ʰ for aspiration (thus not include h or gh)
    .replace(/(?<=p|t|k|tr|ts|tsr|tj)h/g, 'ʰ')
    // Consonant: sr, zr -> circumflex like Esperanto (or use ʂ ʐ ?)
    ////    Note: currently not doing r -> dor-below like tr->ṭ in Sanskrit IAST
    ////          mainly because tr is already equally long as ts, tj and tŝ
    // .replace(/sr/g, 'ŝ')
    // .replace(/zr/g, 'ẑ')
    // Consonant: 知澈澄娘 r -> (whether use ʵ , ɻ , ʴ, or ʈ ɖ ɳ ?)
    // .replace(/r/g, 'ʵ')
    .replace(/tr/g, 'ʈ')
    .replace(/dr/g, 'ɖ')
    .replace(/nr/g, 'ɳ')
    .replace(/sr/g, 'ʂ')
    .replace(/zr/g, 'ʐ')
    // Consonant: 章昌常书船 j -> (whether use j , ʲ , or ɕ ʑ ȵ ?)
    .replace(/sj/g, 'ɕ')
    .replace(/zj/g, 'ʑ')
    .replace(/nj/g, 'ȵ')
    .replace(/tj/g, 'tɕ')
    .replace(/dj/g, 'dʑ')
    // Consonant: gh -> (ğ or ɣ or ʁ or?)
    .replace(/gh/g, 'ʁ')
    // Medial: wi -> ü
    ////    Note: maybe not doing wi -> y because y is not otherwise used
    .replace(/wi/g, 'ü')
    // Medial: y -> ɨ (not sure, whether ɨ or ɿ or ʅ or ɨ̧  or ɨʴ or ɨʵ or keep using y ?)
    //      In fact ɨ with acute/grave is in some text envs not clear at all...
    //      But ɨ is the most IPA-ish one, and ï ɯ̈ etc. also have problems with accents
    //      But in some cases it can also mean ɻ, not only a vowel, thus hesitating
    .replace(/y/g, 'ɨ')
    // Medial: w -> ʷ (when is not followed by h, q or ending)
    .replace(/w(?![hq]|\b)/g, 'ʷ')
    // Vowel: eo -> ə
    .replace(/eo/g, 'ə')
    ;

  // Step 2: Handle tone marks
  const toneMarks = {
    q: { 'a': 'á', 'e': 'é', 'o': 'ó', 'ə': 'ǝ́', 'u': 'ú', 'i': 'í', 'y': 'ý', 'ɨ': 'ɨ́', 'ɿ': 'ɿ́', 'ü': 'ǘ' },
    h: { 'a': 'à', 'e': 'è', 'o': 'ò', 'ə': 'ǝ̀', 'u': 'ù', 'i': 'ì', 'y': 'ỳ', 'ɨ': 'ɨ̀', 'ɿ': 'ɿ̀', 'ü': 'ǜ' }
  };

  // Unicode combining diacritical marks
  const combiningMarks = {
    q: '\u0301', // Combining acute accent
    h: '\u0300'  // Combining grave accent
  };

  // Helper function to add tone mark
  function addToneMark(str: string, toneMap: { [key: string]: string }, combiningMark: string): string {
    const priority = ['a', 'e', 'o', 'ə', 'i', 'u', 'y', 'ɨ', 'ɿ', 'ü'];
    for (let char of priority) {
      const index = str.lastIndexOf(char);
      if (index !== -1) {
        return str.slice(0, index) + toneMap[char] + str.slice(index + 1);
      }
    }
    // Fallback: add combining mark to the last character
    return str + combiningMark;
  }

  // Check for 'q' or 'h' at the end of the string
  if (tupa.endsWith('q') || tupa.endsWith('h')) {
    const tone = tupa.slice(-1) as 'q' | 'h';
    tupa = addToneMark(tupa.slice(0, -1), toneMarks[tone], combiningMarks[tone]);
  }

  return tupa;
}
