# 简介

甪端Studling之前端。甪端Studling，一站式多语言学习平台，包含多种语言与方言的多种训练与查询功能。

项目后端： https://github.com/pustot/studling-backend

外服网址（部署在 GitHub Pages，需在境外环境查看） https://studling.pustot.com/

# 当前包含的语言/方言与模块

- Beta（公开测试）阶段：
    - 粤语（广州话）（ISO 693-3: `zh-yue`）
        - 汉字读音自测 DifficultiesCmnToYue
        - 汉字读音抽认卡 Flashcards
        - 普转粤难点标注 HanziTraining
    - 中古汉语与方言（ISO 693-3: `zh-ltc`，兼收多方言/域外方音比较）
        - 汉字古今中外读音查询 SinoDict
- Alpha（内部测试）阶段：
    - 汉罗文（人造语言）（自拟代码 `hanrom`）
        - 汉罗双文互转 HanVsRom
- 即将到来：
    - 众多语言... 

# 部署指南

```shell
npm install
npm run start
```

# 详细功能描述

## 语言选择页面（主页）

## 用户账号注册与登陆

## 中古汉语与方言（ISO 693-3: `zh-ltc`，兼收多方言/域外方音比较）

### 汉字古今中外读音查询 SinoDict

可查询汉字在多种语言与方言的发音，包括古汉语（如中古汉语切韵音系）、现代汉语方言（如官话普通话、粤语广州话、客家话、闽南语、潮汕话、吴语）、域外方音（如日语、韩语、越南语之汉字音系统）。

数据来源包括一众 RIME 输入法方案以及 王赟 Maigo 所作「汉字古今中外读音查询 MCPDict」App 之数据。具体使用的数据源列表仍在更新中。

功能点：

- 字典数据
    - [x] 异步拉取 GitHub 上托管的 RIME 字典文件，并将其添加到总字典中。可在部分字典加载失败时工作。
    - [x] 从 yaml 文件提取其中的 汉字 -> 读音 对应信息。
- 查询
    - [x] 分别查询用户输入的多个汉字。
    - [x] 每当新字库键入，即打即查。
    - [x] 过滤输入中的非汉字字符（适用于汉字查罗马字/发音模式）。
    - [ ] 繁简、异体字转换。
    - [ ] 可选择只展示《广韵》中有的字。
    - [ ] 对于重点观察的方言，展示例词读音。
    - [ ] 支持通过部分方言之罗马字/发音查询汉字。
- 方言选择
    - [ ] 包含「音韵地位」信息。
    - [ ] 筛选不需要显示的方言。
    - [ ] 高亮显示重点观察的方言。
- 训练
    - [ ] 随机查询一个汉字。
    - [ ] 随机展示汉字功能与其他方言、其他模块共用常用字库（与每方言之特色字库并存）。
    - [ ] 按用户设定的间隔自动抽认汉字。
- 语音细节
    - [ ] 支持显示 Qieyun.js 所含之音韵细节。
    - [ ] 支持显示声调之调值或/和调类。
    - [ ] 支持将域外方音之罗马字表示转为当地文字表示。
    - [ ] 支持显示 IPA。
    - [ ] 提示连读音变信息。
    - [ ] 支持显示文白异读、日语吴音汉音之分（可借 MCPDict 信息）。

## 粤语（广州话）（ISO 693-3: `zh-yue`）

### 汉字读音自测 DifficultiesCmnToYue

### 汉字读音抽认卡 Flashcards

### 普转粤难点标注 HanziTraining

## 汉罗文（人造语言）（自拟代码 `hanrom`）

### 汉罗双文互转 HanVsRom
