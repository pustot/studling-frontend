import * as OpenCC from "opencc-js";
import { yitiziData, get as yitiziGet } from 'yitizi';

const converterCH = OpenCC.Converter({ from: "cn", to: "hk" });
const converterHC = OpenCC.Converter({ from: "hk", to: "cn" });
const converterHT = OpenCC.Converter({ from: "hk", to: "tw" });
const converterHJ = OpenCC.Converter({ from: "hk", to: "jp" });

export const isChinese = (s: string): boolean => {
    // CJK Unified Ideographs (4E00–9FFF)
    // CJK Unified Ideographs Extension A (3400–4DBF)
    return /[\u4e00-\u9fa5]/.test(s) || /[\u3400-\u4dbf]/.test(s);
}

export const getHanziVariants = (character: string): string[] => {
    let ch_hk = converterCH(character);
    let variants = [ch_hk, converterHT(ch_hk), converterHC(ch_hk), converterHJ(ch_hk)];

    // 当前 Yitizi 使用有错误，先只使用繁简
    // try {
    //     const yitiziVariants = yitiziGet(character);
    //     if (yitiziVariants) {
    //         variants = variants.concat(yitiziVariants);
    //     }
    // } catch (error) {
    //     console.error(`Failed to get variants for character ${character}:`, error);
    // }
    return variants;
}
