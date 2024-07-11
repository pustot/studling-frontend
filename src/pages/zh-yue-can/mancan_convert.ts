
const simple_mapper_initial = new Map([
    ["b", "b"], ["p", "p"], ["m", "m"], ["f", "f"],
    ["d", "d"], ["t", "t"], ["n", "n"], ["l", "l"],
    ["g", "g"], // ["k", "k"], ["h", "h"],
    // ["j", ""], ["q", ""], ["x", ""],
    ["zh", "z"], ["ch", "c"], ["sh", "s"], ["r", "j"],
    ["z", "z"], ["c", "c"], ["s", "s"],
]);

const simple_mapper_final = new Map([
    ["a", "aa"], ["ia", "aa"], ["ua", "aa"],
    ["o", "o"], ["uo", "o"], ["ie", "e"],
    ["uai", "aai"],
    ["ueng", "ung"], ["ong", "ung"], ["iong", "ung"],
    ["an", "aan"], ["ian", "in"], ["in", "an"], // 此行先忽略m者
    ["er", "i"], ["ui", "eoi"], ["uei", "eoi"], ["iao", "iu"], // ui iu un 兼容完整写法 uei iou uen
    ["ou", "au"], ["iu", "au"], ["iou", "au"],
    ["en", "an"], ["un", "eon"], ["uen", "eon"], ["yun", "an"],
    ["iang", "oeng"], ["uang", "ong"],
]);

const jt_mapper = new Map([
    ["j", "z/g"], ["q", "c/k"], ["x", "s/h"],
]);

// 定义转换选项
export const mancan_options = [
    { label: '尖团音', value: 'jt' },
    { label: '闭口韵（咸深）', value: 'bk' },
    { label: '阴阳上阴阳去', value: 'yy' },
    // 可以根据需要添加更多选项
    { label: '入声字', value: 'rs' },

    // 声母一对多
    { label: 'k➡️f/h', value: 'k-fh' },
    { label: 'h➡️h/w/f', value: 'h-hwf' },
    { label: 'q➡️c/k/h', value: 'q-ckh' },
    { label: 'w➡️m/w（明微）', value: 'w-mw' },
    { label: '零声母➡️零/ng（疑母）', value: '0-0ng' },

    // 韵母一对多
    { label: 'e➡️o/e', value: 'e-oe' },
    { label: 'i（非舌尖ɿʅ）➡️ei/ai/ik', value: 'i-eiaiik' },
    { label: 'u➡️u/ou/yu/uk', value: 'u-uouyuuk' },
    { label: 'yu➡️yu/eoi/uk', value: 'yu-n' },
    { label: 'ai➡️aai/oi（泰咍）', value: 'ai-n' },
    { label: 'ei➡️ei/ui', value: 'ei-n' },
    { label: 'ao➡️aau/ou（豪肴）', value: 'ao-n' },
    { label: 'uan➡️yun/un', value: 'uan-n' },
    { label: 'uan➡️yun/un/aan（关官）', value: 'uan-n-aan' },
    { label: 'yuan➡️yun/un', value: 'yuan-n' },
    { label: 'ang➡️ong/oeng', value: 'ang-n' },
    { label: 'eng➡️ang/ing', value: 'eng-n' },
    { label: 'ing➡️ing/eng（文ing白eng）', value: 'ing-n' },
];

export const mancan_convert = (
    py: string,
    py_initial: string,
    py_final: string,
    py_tone: string,
    selectedOptions: string[],
    jp_final: string
): [string, string, string] => {
    // simple mapping
    let my_initial = simple_mapper_initial.get(py_initial) || "";
    let my_final = simple_mapper_final.get(py_final) || "";
    // 简单附加规则：舌尖i为i
    if (["z", "c", "s", "zh", "ch", "sh"].includes(py_initial) && py_final === "i") {
        my_final = "i";
    }
    // 简单附加规则：r变为j之后，拼音韵母当视为i开头所以ran➡️im/in
    if (my_initial === "j" && py_final !== "i") {
        my_final = simple_mapper_final.get("i" + py_final) || my_final;
    }
    let my_tone = "0";
    if (py_tone == "1") my_tone = "1";
    else if (py_tone == "2") my_tone = "4";
    // simple mapping: for beginning y and w and gu ku
    if (my_initial == "" && py[0] == "y") my_initial = "j";
    if (my_initial == "" && py[0] == "w" && py.substring(0, 4) !== "weng") my_initial = "w";
    if (my_initial === "g" && py.substring(0, 2) === "gu") my_initial = "gw";
    if (my_initial === "k" && py.substring(0, 2) === "ku") my_initial = "kw";
    // simple mapping: for er
    if (py_final === "er" && py_initial == "") my_initial = "j";

    // Options
    // 声母一对多
    if (selectedOptions.includes('k-fh') && !my_initial && py_initial === "k") {
        my_initial = "f/h";
    }
    if (selectedOptions.includes('h-hwf') && !my_initial && py_initial === "h") {
        my_initial = "h/w/f";
    }
    if (selectedOptions.includes('q-ckh') && !my_initial && py_initial === "q") {
        my_initial = "c/k/h";
    }
    if (selectedOptions.includes('w-mw') && py[0] == "w") {
        my_initial = "m/w";
    }
    if (selectedOptions.includes('0-0ng') && ["", "w", "y"].includes(py_initial)) {
        my_initial += "//ng";
    }
    // 韵母一对多
    if (selectedOptions.includes('e-oe') && py_final === "e") {
        my_final = "o/e";
    }
    if (selectedOptions.includes('i-eiaiik') && py_final === "i" && !["z", "c", "s", "zh", "ch", "sh"].includes(py_initial)) {
        my_final = "ei/ai/ik";
    }
    if (selectedOptions.includes('u-uouyuuk') && py_final === "u") {
        my_final = "u/ou/yu/uk";
    }
    if (selectedOptions.includes('yu-n') && py_final === "yu") {
        my_final = "yu/eoi/uk";
    }
    if (selectedOptions.includes('ai-n') && py_final === "ai") {
        my_final = "aai/oi";
    }
    if (selectedOptions.includes('ei-n') && py_final === "ei") {
        my_final = "ei/ui";
    }
    if (selectedOptions.includes('ao-n') && !my_final && py_final === "ao") {
        my_final = "aau/ou";
    }
    if (selectedOptions.includes('uan-n') && py_final === "uan") {
        my_final = "yun/un";
    }
    if (selectedOptions.includes('uan-n-aan') && py_final === "uan") {
        my_final = "yun/un/aan";
    }
    if (selectedOptions.includes('yuan-n') && py_final === "yuan") {
        my_final = "yun/un";
    }
    if (selectedOptions.includes('ang-n') && !my_final && py_final === "ang") {
        my_final = "ong/oeng";
    }
    if (selectedOptions.includes('eng-n') && py_final === "eng") {
        my_final = "ang/ing";
    }
    if (selectedOptions.includes('ing-n') && py_final === "ing") {
        my_final = "ing/eng";
    }

    // 最基本的逻辑，放最下面
    // 尖团音
    if (selectedOptions.includes('jt') && !my_initial) {
        my_initial = jt_mapper.get(py_initial) || my_initial;
    }
    // 闭口韵（咸深）
    if (selectedOptions.includes('bk') && (my_final.endsWith("m") || my_final.endsWith("n"))) {
        my_final = my_final.slice(0, -1) + "m/" + my_final.slice(0, -1) + "n";
    }
    // 入声字
    if (selectedOptions.includes('rs') && /[ptk]$/.test(jp_final)) {
        my_final = "/" + jp_final;
    }
    // 阴阳上阴阳去
    if (selectedOptions.includes('yy') && (py_tone == "3" || py_tone == "4")) {
        if (py_tone == "3") my_tone = "2/5";
        if (py_tone == "4") my_tone = "3/6";
    }

    // gwu -> gu, kwu -> ku
    if (my_initial === "gw" && (my_final[0] === "u" || my_final[0] === "y")) my_initial = "g";
    if (my_initial === "kw" && (my_final[0] === "u" || my_final[0] === "y")) my_initial = "k";
    return [my_initial, my_final, my_tone];
}