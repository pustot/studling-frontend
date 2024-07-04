import * as React from "react";
import * as OpenCC from "opencc-js";
// import Yitizi from 'yitizi'; // 模块定义中没有默认导出，故需命名导入的方式
import * as Yitizi from 'yitizi';
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
    let variants = [ch_hk, converterHT(ch_hk), converterHC(ch_hk), converterHJ(ch_hk), ...Yitizi.get(ch_hk)];
    return variants;
}
