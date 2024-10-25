import * as OpenCC from "opencc-js";
// import Yitizi from 'yitizi'; // 模块定义中没有默认导出，故需命名导入的方式
import * as Yitizi from 'yitizi';

class HanziUtils {
  private commonHanzi: string[] = [];
  private isDataFetched = false;
  private converterCH = OpenCC.Converter({ from: "cn", to: "hk" });
  private converterHC = OpenCC.Converter({ from: "hk", to: "cn" });
  private converterHT = OpenCC.Converter({ from: "hk", to: "tw" });
  private converterHJ = OpenCC.Converter({ from: "hk", to: "jp" });

  constructor() {
    this.fetchCommonHanzi();
  }

  private async fetchCommonHanzi() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/nk2028/commonly-used-chinese-characters-and-words/main/char.txt');
      const text = await response.text();
      this.commonHanzi = text.split('\n').filter(char => char.trim() !== '');
      this.isDataFetched = true;
    } catch (error) {
      console.error('Failed to fetch common hanzi:', error);
    }
  }

  public getRandomCommonHanzi(): string {
    if (!this.isDataFetched || this.commonHanzi.length === 0) {
      return '字';
    }
    const randomIndex = Math.floor(Math.random() * this.commonHanzi.length);
    return this.commonHanzi[randomIndex];
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

export function tupaToMarkings(tupa: string): string {
  // Step 1: Replace specific substrings
  tupa = tupa
    // basic
    .replace(/ae/g, 'aˤ')
    .replace(/ee/g, 'eˤ')
    .replace(/oeu/g, 'oˤ')
    .replace(/ng/g, 'ŋ')
    .replace(/ou/g, 'ᵒu')
    // Consonant: h -> ʰ for aspiration (thus not include h or gh)
    .replace(/(?<=p|t|k|tr|ts|tsr|tj)h/g, 'ʰ')
    // Consonant: sr, zr -> circumflex like Esperanto
    ////    Note: currently not doing r -> dor-below like tr->ṭ in Sanskrit IAST
    ////          mainly because tr is already equally long as ts, tj and tŝ
    .replace(/sr/g, 'ŝ')
    .replace(/zr/g, 'ẑ')
    // Consonant: r -> ɻ (currently only on tr dr nr)
    .replace(/r/g, 'ɻ')
    // Consonant: gh -> ğ (or ɣ or ʁ or?)
    .replace(/gh/g, 'ğ')
    // Medial: wi -> ü
    ////    Note: currently not doing y -> ï ḯ ï̀ because y is not otherwise used
    .replace(/wi/g, 'ü')
    // Vowel: eo -> ə
    .replace(/eo/g, 'ə')
    ;

  // Step 2: Handle tone marks
  const toneMarks = {
    q: { 'a': 'á', 'e': 'é', 'o': 'ó', 'ə': 'ǝ́', 'u': 'ú', 'i': 'í', 'y': 'ý', 'ü': 'ǘ' },
    h: { 'a': 'à', 'e': 'è', 'o': 'ò', 'ə': 'ǝ̀', 'u': 'ù', 'i': 'ì', 'y': 'ỳ', 'ü': 'ǜ' }
  };

  // Unicode combining diacritical marks
  const combiningMarks = {
    q: '\u0301', // Combining acute accent
    h: '\u0300'  // Combining grave accent
  };

  // Helper function to add tone mark
  function addToneMark(str: string, toneMap: { [key: string]: string }, combiningMark: string): string {
    const priority = ['a', 'e', 'o', 'ə', 'u', 'i', 'y', 'ü'];
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
