
export const isChinese = (s: string) => {
    // CJK Unified Ideographs (4E00–9FFF)
    // CJK Unified Ideographs Extension A (3400–4DBF)
    return /[\u4e00-\u9fa5]/.test(s) || /[\u3400-\u4dbf]/.test(s);
}
