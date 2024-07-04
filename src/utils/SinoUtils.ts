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
