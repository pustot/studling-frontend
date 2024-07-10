
# 简介

甪端Studling，一站式多语言学习平台，包含多种语言与方言的多种训练与查询功能。

项目后端： https://github.com/pustot/studling-backend

项目前端： https://github.com/pustot/studling-frontend

外服网址（部署在 GitHub Pages，需在境外环境查看） https://studling.pustot.com/

# 当前包含的语言/方言与模块

- Beta（公开测试）阶段：
    - 粤语（广州话）（ISO 693-3: `zh-yue`，细分 `zh-yue-can`）
        - 汉字读音自测 HanziTraining
        - 汉字读音抽认卡 Flashcards
        - 普转粤难点标注 DifficultiesCmnToYue
    - 中古汉语与方言（ISO 693-3: `zh-ltc`，兼收多方言/域外方音比较）
        - 汉字古今中外读音查询 SinoDict
- Alpha（内部测试）阶段：
    - 汉罗文（人造语言）（自拟代码 `hanrom`）
        - 汉罗双文互转 HanVsRom
- 即将到来：
    - 众多语言... 

# 部署指南

后端

Spring Boot (Java) + MyBatis Plus + MySQL + Redis

```shell
mvn spring-boot:run
```

前端

React (TypeScript) + MaterialUI

```shell
npm install
npm run start
```

# 详细功能描述

## 语言选择页面（主页）

可以选择语言。后续添加收藏夹功能与训练统计功能。

## 用户账号注册与登陆

用户注册与登陆功能目前用 Amazon Cognito，以减少个人项目安全系统维护难度。

- [x] 后端发现 email 为新，则将此新用户加入库（PUT /api/users {email, cognitoSub}）

## 数据存储

### 用户信息表通用结构 Users

```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    cognito_sub VARCHAR(255), -- 存储用户在Cognito中的唯一标识符
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (email)
);
```

### 字词信息表通用结构 XXWords

```sql
CREATE TABLE zh_yue_can_words (
    word_id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    pronunciation VARCHAR(255),
    meaning VARCHAR(255),
    example_combination VARCHAR(255),
    example_sentence TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (word)
);
```

对于汉字，pronunciation是在对应变体中的发音的罗马化，会用于单字读音拼写训练。

### 训练信息表通用结构 XXMasteries

```sql
CREATE TABLE zh_yue_can_masteries (
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    recent_results VARCHAR(10) DEFAULT '0000000000', -- 最近10次训练结果，0表示错误，1表示正确
    accuracy FLOAT DEFAULT 0, -- 正确率字段，其信息包含于recent_results但单拎以便索引
    last_attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, word_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (word_id) REFERENCES zh_yue_can_words(word_id),
    INDEX (user_id, accuracy, last_attempt_date) -- 优先训练正确率最低、训练间隔最长者（ORDER BY accuracy ASC, last_attempt_date ASC）
);
```

常用训练模式：每次10词，其中5个来自温习（优先训练正确率最低、训练间隔最长者），5个来自总词库随机选取。后续会引入更科学的记忆算法。

### 每日训练统计 `daily_training_stats`

```sql
CREATE TABLE daily_training_stats (
    user_id INT NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    training_date DATE NOT NULL,
    total_attempts INT DEFAULT 0,
    correct_attempts INT DEFAULT 0,
    incorrect_attempts INT DEFAULT 0,
    PRIMARY KEY (user_id, language_code, training_date),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX (user_id, training_date) -- 用于跨语言总数
);
```

## 多语言通用训练模块

### （方言/古代汉语/域外方音）汉字读音训练 HanziPhonoTraining

- （首先完成广州话版，跟住切韵TUPA）
- [x] 纯前端版：每次10字，输入后按键或回车显示正误，显示进度条
- [x] 显示切韵音韵地位作为参考
- [x] DB 建立 users words trainings 表，并加入 words 表数据（仅word,pronunciation）
- [x] 集成 MyBatis Plus
- [x] 后端可以随机取词给前端
- [x] 前端移植纯前端版界面
- [x] 训练结果保存到 masteries 表
- [x] 训练结果保存到 `daily_training_stats` 表
- [ ] 统计并显示总训练量、今日训练量（&每日、趋势）
- [ ] 后端可以根据以往训练情况取优先训练之词（与随机取词结合）

为了严格性，不使用选择题，而使用罗马字拼写的形式。适合拥有比较标准化、公认且易于输入的拼音系统者，例如普通话之汉语拼音，广州话之粤拼，中古汉语切韵音系之切韵拼音。后续考虑引入拼式自选功能，或在新引入方言中采用选择题的形式。

对于多音字，单字练习允许输入任何一种发音，而后续设计的词语练习模块可以限定多音字具体发音。这一选择符合通常学习与测验形式。

### （所有语言）单词释义训练 WordMeaningTraining

- （首先完成英、广州话特有、日德韩法西越世）

释义无法固定，故使用选择题形式。

适用于所有语言。其中，对于汉语方言，主要用于方言特色词汇。

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
    - [x] 繁简、异体字转换。
    - [x] 可选择只展示《广韵》中有的字。
    - [x] 以卡片形式展示结果
    - [ ] 对于重点观察的方言，展示例词读音。
    - [ ] 支持通过部分方言之罗马字/发音查询汉字。
- 方言选择
    - [x] 包含「音韵地位.描述」信息。
    - [ ] 筛选不需要显示的方言。
    - [ ] 高亮显示重点观察的方言。
- 训练
    - [x] 随机查询一个汉字。
    - [x] 随机展示汉字功能与其他方言、其他模块共用常用字库（与每方言之特色字库并存）。
    - [ ] 按用户设定的间隔自动抽认汉字。
- 语音细节
    - [ ] 支持显示 Qieyun.js 所含之音韵细节、广韵词条。
    - [ ] 支持显示声调之调值或/和调类。
    - [ ] 支持将域外方音之罗马字表示转为当地文字表示。（包含对切韵拼音的视觉优化，如声调与二等韵核转附标）
    - [ ] 支持显示 IPA。
    - [ ] 提示连读音变信息。
    - [ ] 支持显示文白异读、日语吴音汉音之分（可借 MCPDict 信息）。

## 粤语（广州话）（ISO 693-3: `zh-yue`）

### 汉字读音自测 DifficultiesCmnToYue

### 汉字读音抽认卡 Flashcards

### 普转粤难点标注 HanziTraining

## 汉罗文（人造语言）（自拟代码 `hanrom`）

### 汉罗双文互转 HanVsRom
