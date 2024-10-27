export interface DialectConfig {
    displayName: string;
    links: string[];
    format: 'yaml' | 'csv';
}

// 在这里添加汉字古今中外读音查询的数据来源。目前支持 Rime 之 .dict.yaml
// rime list https://github.com/ayaka14732/awesome-rime
export const dialectConfigMap: { [key: string]: DialectConfig } = {
    'zh-ltc': {
        displayName: '切',
        links: [
            'https://raw.githubusercontent.com/nk2028/rime-tupa/main/tupa.dict.yaml',
            'https://raw.githubusercontent.com/pustot/middle-chinese-polyphones/refs/heads/main/words.yaml'
        ],
        format: 'yaml'
    },
    'zh-cmn': {
        displayName: '普',
        links: ['https://raw.githubusercontent.com/rime/rime-terra-pinyin/master/terra_pinyin.dict.yaml'],
        format: 'yaml'
    },
    'zh-yue': {
        displayName: '粤',
        links: ['https://raw.githubusercontent.com/rime/rime-cantonese/main/jyut6ping3.chars.dict.yaml'],
        format: 'yaml'
    },
    'zh-hak': {
        displayName: '客',
        links: ['https://raw.githubusercontent.com/DaengGWokFook/Asian-Languages/master/Kak-Hak/Yat-Toi/moi-eian.dict.yaml'],
        format: 'yaml'
    },
    'zh-nan-tst': {
        displayName: '厦',
        links: ['https://raw.githubusercontent.com/LimTo/etaiBLG/master/banlam_etai.dict.yaml'],
        format: 'yaml'
    },
    'zh-nan-die': {
        displayName: '潮',
        links: ['https://raw.githubusercontent.com/kahaani/dieghv/master/dieziu.dict.yaml'],
        format: 'yaml'
    },
    'zh-wuu-sha': { // 此rime无声调
        displayName: '沪',
        links: ['https://raw.githubusercontent.com/NGLI/rime-wugniu_zaonhe/master/wugniu_zaonhe.dict.yaml'],
        format: 'yaml'
    },
    'zh-wuu-sou': { // 现在所见上海话rime方案均不标声调，故rime来源先考虑吴语苏或杭
        displayName: '苏',
        links: ['https://raw.githubusercontent.com/NGLI/rime-wugniu_soutseu/master/wugniu_soutseu.dict.yaml'],
        format: 'yaml'
    },
    'zh-wuu-wen': { // 此rime无声调
        displayName: '温',
        links: ['https://raw.githubusercontent.com/pearapple123/rime-iuciou/main/iuciou.dict.yaml'],
        format: 'yaml'
    },
    'zh-cdo': { // txt 格式，非 rime 之 yaml 格式，但因主要部分以 tab 分割故暂按 yaml
        displayName: '福',
        links: ['https://raw.githubusercontent.com/only3km/ciklinbekin/master/DFDCharacters.txt'],
        format: 'yaml'
    },
    'zh-cmn-shu': { // 四川话通用拼音之通音方案，依照全体四川话的「最小公倍数」音系 https://zhuanlan.zhihu.com/p/34562639
        displayName: '蜀通',
        links: ['https://raw.githubusercontent.com/Papnas/shupin/master/shupin.dict.yaml'],
        format: 'yaml'
    },
    // 文件第三列即谚文写法，以后可加之。或 sgalal/rime-hanja 直接谚文
    'ko': {
        displayName: '韩',
        links: ['https://raw.githubusercontent.com/rime-aca/rime-hangyl/master/hangyl_hanja.dict.yaml'],
        format: 'yaml'
    },
    'vi': {
        displayName: '越',
        links: ['https://raw.githubusercontent.com/vietnameselanguage/hannom/main/hannom.dict.yaml'],
        format: 'yaml'
    },
    'ja': {
        displayName: '日',
        links: ['https://raw.githubusercontent.com/biopolyhedron/rime-jap-poly/master/jap_poly.dict.yaml'],
        format: 'yaml'
    },
    'ja-kun': {
        displayName: '日训',
        links: ['https://raw.githubusercontent.com/sgalal/rime-kunyomi/master/kunyomi.dict.yaml'],
        format: 'yaml'
    }
    // 可以在这里添加更多语言配置
};
