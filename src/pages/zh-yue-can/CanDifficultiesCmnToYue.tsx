import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from "@mui/icons-material/Send";
import {
    Box,
    Button,
    Checkbox,
    ClickAwayListener,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Link as MuiLink,
    Select,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { styled } from "@mui/material/styles";
import { pinyin } from 'pinyin-pro';
import "purecss/build/pure.css";
import * as React from "react";
import ToJyutping from "to-jyutping";
import BackButton from "../../components/BackButton";
import "../../styles.scss";
import { getLocaleText, I18nText } from "../../utils/I18n";
import { mancan_convert, mancan_options } from "./mancan_convert";

interface Pronunciation {
    isHanzi: boolean;
    text: string;
    py_initial: string;
    py_final: string;
    py_tone: string;
    jp_initial: string;
    jp_final: string;
    jp_tone: string;
    my_initial: string;
    my_final: string;
    my_tone: string;
}

const Highlight = styled("span")(({ theme }) => ({
    color: theme.palette.error.main,
}));

const GreenHighlight = styled("span")(({ theme }) => ({
    color: theme.palette.success.main,
}));

function mergeArrays(array1: [string, string | null][], array2: string[]): string[][] {
    const mergedArray: string[][] = [];

    for (let i = 0; i < array1.length; i++) {
        const [, secondMember] = array1[i];
        let temp = [];
        if (secondMember !== null) {
            temp.push(array1[i][0]);
            temp.push(secondMember);
            if (i < array2.length) {
                temp.push(array2[i]);
                mergedArray.push(temp);
            }
        } else {
            // 表明不是汉字，返回空串以供后续
            temp.push(array1[i][0]);
            temp.push("");
            if (i < array2.length) {
                temp.push("");
                mergedArray.push(temp);
            }
        }
    }
    return mergedArray;
}

// 2500 Primary Common Characters (Changyongzi)
// and 1000 Secondary Common Characters (Cichangyongzi)
const hansPrim2500 =
    "一乙二十丁厂七卜人入八九几儿了力乃刀又三于干亏士工土才寸下大丈与万上小口巾山千乞川亿个勺久凡及夕丸么广亡门义之尸弓己已子卫也女飞刃习叉马乡丰王井开夫天无元专云扎艺木五支厅不太犬区历尤友匹车巨牙屯比互切瓦止少日中冈贝内水见午牛手毛气升长仁什片仆化仇币仍仅斤爪反介父从今凶分乏公仓月氏勿欠风丹匀乌凤勾文六方火为斗忆订计户认心尺引丑巴孔队办以允予劝双书幻玉刊示末未击打巧正扑扒功扔去甘世古节本术可丙左厉右石布龙平灭轧东卡北占业旧帅归且旦目叶甲申叮电号田由史只央兄叼叫另叨叹四生失禾丘付仗代仙们仪白仔他斥瓜乎丛令用甩印乐句匆册犯外处冬鸟务包饥主市立闪兰半汁汇头汉宁穴它讨写让礼训必议讯记永司尼民出辽奶奴加召皮边发孕圣对台矛纠母幼丝式刑动扛寺吉扣考托老执巩圾扩扫地扬场耳共芒亚芝朽朴机权过臣再协西压厌在有百存而页匠夸夺灰达列死成夹轨邪划迈毕至此贞师尘尖劣光当早吐吓虫曲团同吊吃因吸吗屿帆岁回岂刚则肉网年朱先丢舌竹迁乔伟传乒乓休伍伏优伐延件任伤价份华仰仿伙伪自血向似后行舟全会杀合兆企众爷伞创肌朵杂危旬旨负各名多争色壮冲冰庄庆亦刘齐交次衣产决充妄闭问闯羊并关米灯州汗污江池汤忙兴宇守宅字安讲军许论农讽设访寻那迅尽导异孙阵阳收阶阴防奸如妇好她妈戏羽观欢买红纤级约纪驰巡寿弄麦形进戒吞远违运扶抚坛技坏扰拒找批扯址走抄坝贡攻赤折抓扮抢孝均抛投坟抗坑坊抖护壳志扭块声把报却劫芽花芹芬苍芳严芦劳克苏杆杠杜材村杏极李杨求更束豆两丽医辰励否还歼来连步坚旱盯呈时吴助县里呆园旷围呀吨足邮男困吵串员听吩吹呜吧吼别岗帐财针钉告我乱利秃秀私每兵估体何但伸作伯伶佣低你住位伴身皂佛近彻役返余希坐谷妥含邻岔肝肚肠龟免狂犹角删条卵岛迎饭饮系言冻状亩况床库疗应冷这序辛弃冶忘闲间闷判灶灿弟汪沙汽沃泛沟没沈沉怀忧快完宋宏牢究穷灾良证启评补初社识诉诊词译君灵即层尿尾迟局改张忌际陆阿陈阻附妙妖妨努忍劲鸡驱纯纱纳纲驳纵纷纸纹纺驴纽奉玩环武青责现表规抹拢拔拣担坦押抽拐拖拍者顶拆拥抵拘势抱垃拉拦拌幸招坡披拨择抬其取苦若茂苹苗英范直茄茎茅林枝杯柜析板松枪构杰述枕丧或画卧事刺枣雨卖矿码厕奔奇奋态欧垄妻轰顷转斩轮软到非叔肯齿些虎虏肾贤尚旺具果味昆国昌畅明易昂典固忠咐呼鸣咏呢岸岩帖罗帜岭凯败贩购图钓制知垂牧物乖刮秆和季委佳侍供使例版侄侦侧凭侨佩货依的迫质欣征往爬彼径所舍金命斧爸采受乳贪念贫肤肺肢肿胀朋股肥服胁周昏鱼兔狐忽狗备饰饱饲变京享店夜庙府底剂郊废净盲放刻育闸闹郑券卷单炒炊炕炎炉沫浅法泄河沾泪油泊沿泡注泻泳泥沸波泼泽治怖性怕怜怪学宝宗定宜审宙官空帘实试郎诗肩房诚衬衫视话诞询该详建肃录隶居届刷屈弦承孟孤陕降限妹姑姐姓始驾参艰线练组细驶织终驻驼绍经贯奏春帮珍玻毒型挂封持项垮挎城挠政赴赵挡挺括拴拾挑指垫挣挤拼挖按挥挪某甚革荐巷带草茧茶荒茫荡荣故胡南药标枯柄栋相查柏柳柱柿栏树要咸威歪研砖厘厚砌砍面耐耍牵残殃轻鸦皆背战点临览竖省削尝是盼眨哄显哑冒映星昨畏趴胃贵界虹虾蚁思蚂虽品咽骂哗咱响哈咬咳哪炭峡罚贱贴骨钞钟钢钥钩卸缸拜看矩怎牲选适秒香种秋科重复竿段便俩贷顺修保促侮俭俗俘信皇泉鬼侵追俊盾待律很须叙剑逃食盆胆胜胞胖脉勉狭狮独狡狱狠贸怨急饶蚀饺饼弯将奖哀亭亮度迹庭疮疯疫疤姿亲音帝施闻阀阁差养美姜叛送类迷前首逆总炼炸炮烂剃洁洪洒浇浊洞测洗活派洽染济洋洲浑浓津恒恢恰恼恨举觉宣室宫宪突穿窃客冠语扁袄祖神祝误诱说诵垦退既屋昼费陡眉孩除险院娃姥姨姻娇怒架贺盈勇怠柔垒绑绒结绕骄绘给络骆绝绞统耕耗艳泰珠班素蚕顽盏匪捞栽捕振载赶起盐捎捏埋捉捆捐损都哲逝捡换挽热恐壶挨耻耽恭莲莫荷获晋恶真框桂档桐株桥桃格校核样根索哥速逗栗配翅辱唇夏础破原套逐烈殊顾轿较顿毙致柴桌虑监紧党晒眠晓鸭晃晌晕蚊哨哭恩唤啊唉罢峰圆贼贿钱钳钻铁铃铅缺氧特牺造乘敌秤租积秧秩称秘透笔笑笋债借值倚倾倒倘俱倡候俯倍倦健臭射躬息徒徐舰舱般航途拿爹爱颂翁脆脂胸胳脏胶脑狸狼逢留皱饿恋桨浆衰高席准座脊症病疾疼疲效离唐资凉站剖竞部旁旅畜阅羞瓶拳粉料益兼烤烘烦烧烛烟递涛浙涝酒涉消浩海涂浴浮流润浪浸涨烫涌悟悄悔悦害宽家宵宴宾窄容宰案请朗诸读扇袜袖袍被祥课谁调冤谅谈谊剥恳展剧屑弱陵陶陷陪娱娘通能难预桑绢绣验继球理捧堵描域掩捷排掉堆推掀授教掏掠培接控探据掘职基著勒黄萌萝菌菜萄菊萍菠营械梦梢梅检梳梯桶救副票戚爽聋袭盛雪辅辆虚雀堂常匙晨睁眯眼悬野啦晚啄距跃略蛇累唱患唯崖崭崇圈铜铲银甜梨犁移笨笼笛符第敏做袋悠偿偶偷您售停偏假得衔盘船斜盒鸽悉欲彩领脚脖脸脱象够猜猪猎猫猛馅馆凑减毫麻痒痕廊康庸鹿盗章竟商族旋望率着盖粘粗粒断剪兽清添淋淹渠渐混渔淘液淡深婆梁渗情惜惭悼惧惕惊惨惯寇寄宿窑密谋谎祸谜逮敢屠弹随蛋隆隐婚婶颈绩绪续骑绳维绵绸绿琴斑替款堪搭塔越趁趋超提堤博揭喜插揪搜煮援裁搁搂搅握揉斯期欺联散惹葬葛董葡敬葱落朝辜葵棒棋植森椅椒棵棍棉棚棕惠惑逼厨厦硬确雁殖裂雄暂雅辈悲紫辉敞赏掌晴暑最量喷晶喇遇喊景践跌跑遗蛙蛛蜓喝喂喘喉幅帽赌赔黑铸铺链销锁锄锅锈锋锐短智毯鹅剩稍程稀税筐等筑策筛筒答筋筝傲傅牌堡集焦傍储奥街惩御循艇舒番释禽腊脾腔鲁猾猴然馋装蛮就痛童阔善羡普粪尊道曾焰港湖渣湿温渴滑湾渡游滋溉愤慌惰愧愉慨割寒富窜窝窗遍裕裤裙谢谣谦属屡强粥疏隔隙絮嫂登缎缓编骗缘瑞魂肆摄摸填搏塌鼓摆携搬摇搞塘摊蒜勤鹊蓝墓幕蓬蓄蒙蒸献禁楚想槐榆楼概赖酬感碍碑碎碰碗碌雷零雾雹输督龄鉴睛睡睬鄙愚暖盟歇暗照跨跳跪路跟遣蛾蜂嗓置罪罩错锡锣锤锦键锯矮辞稠愁筹签简毁舅鼠催傻像躲微愈遥腰腥腹腾腿触解酱痰廉新韵意粮数煎塑慈煤煌满漠源滤滥滔溪溜滚滨粱滩慎誉塞谨福群殿辟障嫌嫁叠缝缠静碧璃墙撇嘉摧截誓境摘摔聚蔽慕暮蔑模榴榜榨歌遭酷酿酸磁愿需弊裳颗嗽蜻蜡蝇蜘赚锹锻舞稳算箩管僚鼻魄貌膜膊膀鲜疑馒裹敲豪膏遮腐瘦辣竭端旗精歉熄熔漆漂漫滴演漏慢寨赛察蜜谱嫩翠熊凳骡缩慧撕撒趣趟撑播撞撤增聪鞋蕉蔬横槽樱橡飘醋醉震霉瞒题暴瞎影踢踏踩踪蝶蝴嘱墨镇靠稻黎稿稼箱箭篇僵躺僻德艘膝膛熟摩颜毅糊遵潜潮懂额慰劈操燕薯薪薄颠橘整融醒餐嘴蹄器赠默镜赞篮邀衡膨雕磨凝辨辩糖糕燃澡激懒壁避缴戴擦鞠藏霜霞瞧蹈螺穗繁辫赢糟糠燥臂翼骤鞭覆蹦镰翻鹰警攀蹲颤瓣爆疆壤耀躁嚼嚷籍魔灌蠢霸露囊罐";
const hansSecond1000 =
    "匕刁丐歹戈夭仑讥冗邓艾夯凸卢叭叽皿凹囚矢乍尔冯玄邦迂邢芋芍吏夷吁吕吆屹廷迄臼仲伦伊肋旭匈凫妆亥汛讳讶讹讼诀弛阱驮驯纫玖玛韧抠扼汞扳抡坎坞抑拟抒芙芜苇芥芯芭杖杉巫杈甫匣轩卤肖吱吠呕呐吟呛吻吭邑囤吮岖牡佑佃伺囱肛肘甸狈鸠彤灸刨庇吝庐闰兑灼沐沛汰沥沦汹沧沪忱诅诈罕屁坠妓姊妒纬玫卦坷坯拓坪坤拄拧拂拙拇拗茉昔苛苫苟苞茁苔枉枢枚枫杭郁矾奈奄殴歧卓昙哎咕呵咙呻咒咆咖帕账贬贮氛秉岳侠侥侣侈卑刽刹肴觅忿瓮肮肪狞庞疟疙疚卒氓炬沽沮泣泞泌沼怔怯宠宛衩祈诡帚屉弧弥陋陌函姆虱叁绅驹绊绎契贰玷玲珊拭拷拱挟垢垛拯荆茸茬荚茵茴荞荠荤荧荔栈柑栅柠枷勃柬砂泵砚鸥轴韭虐昧盹咧昵昭盅勋哆咪哟幽钙钝钠钦钧钮毡氢秕俏俄俐侯徊衍胚胧胎狰饵峦奕咨飒闺闽籽娄烁炫洼柒涎洛恃恍恬恤宦诫诬祠诲屏屎逊陨姚娜蚤骇耘耙秦匿埂捂捍袁捌挫挚捣捅埃耿聂荸莽莱莉莹莺梆栖桦栓桅桩贾酌砸砰砾殉逞哮唠哺剔蚌蚜畔蚣蚪蚓哩圃鸯唁哼唆峭唧峻赂赃钾铆氨秫笆俺赁倔殷耸舀豺豹颁胯胰脐脓逛卿鸵鸳馁凌凄衷郭斋疹紊瓷羔烙浦涡涣涤涧涕涩悍悯窍诺诽袒谆祟恕娩骏琐麸琉琅措捺捶赦埠捻掐掂掖掷掸掺勘聊娶菱菲萎菩萤乾萧萨菇彬梗梧梭曹酝酗厢硅硕奢盔匾颅彪眶晤曼晦冕啡畦趾啃蛆蚯蛉蛀唬啰唾啤啥啸崎逻崔崩婴赊铐铛铝铡铣铭矫秸秽笙笤偎傀躯兜衅徘徙舶舷舵敛翎脯逸凰猖祭烹庶庵痊阎阐眷焊焕鸿涯淑淌淮淆渊淫淳淤淀涮涵惦悴惋寂窒谍谐裆袱祷谒谓谚尉堕隅婉颇绰绷综绽缀巢琳琢琼揍堰揩揽揖彭揣搀搓壹搔葫募蒋蒂韩棱椰焚椎棺榔椭粟棘酣酥硝硫颊雳翘凿棠晰鼎喳遏晾畴跋跛蛔蜒蛤鹃喻啼喧嵌赋赎赐锉锌甥掰氮氯黍筏牍粤逾腌腋腕猩猬惫敦痘痢痪竣翔奠遂焙滞湘渤渺溃溅湃愕惶寓窖窘雇谤犀隘媒媚婿缅缆缔缕骚瑟鹉瑰搪聘斟靴靶蓖蒿蒲蓉楔椿楷榄楞楣酪碘硼碉辐辑频睹睦瞄嗜嗦暇畸跷跺蜈蜗蜕蛹嗅嗡嗤署蜀幌锚锥锨锭锰稚颓筷魁衙腻腮腺鹏肄猿颖煞雏馍馏禀痹廓痴靖誊漓溢溯溶滓溺寞窥窟寝褂裸谬媳嫉缚缤剿赘熬赫蔫摹蔓蔗蔼熙蔚兢榛榕酵碟碴碱碳辕辖雌墅嘁踊蝉嘀幔镀舔熏箍箕箫舆僧孵瘩瘟彰粹漱漩漾慷寡寥谭褐褪隧嫡缨撵撩撮撬擒墩撰鞍蕊蕴樊樟橄敷豌醇磕磅碾憋嘶嘲嘹蝠蝎蝌蝗蝙嘿幢镊镐稽篓膘鲤鲫褒瘪瘤瘫凛澎潭潦澳潘澈澜澄憔懊憎翩褥谴鹤憨履嬉豫缭撼擂擅蕾薛薇擎翰噩橱橙瓢蟥霍霎辙冀踱蹂蟆螃螟噪鹦黔穆篡篷篙篱儒膳鲸瘾瘸糙燎濒憾懈窿缰壕藐檬檐檩檀礁磷瞭瞬瞳瞪曙蹋蟋蟀嚎赡镣魏簇儡徽爵朦臊鳄糜癌懦豁臀藕藤瞻嚣鳍癞瀑襟璧戳攒孽蘑藻鳖蹭蹬簸簿蟹靡癣羹鬓攘蠕巍鳞糯譬霹躏髓蘸镶瓤矗";
// 来自 kaienfr/Font，这种按发音排序的适合本App之场景，帮学习者找规律
const hansPhonOrdered3500 =
    "啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱碱拣捡简俭剪减荐槛鉴践贱见键箭件健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利僳例俐痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃汀廷停亭庭艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座";

export default function CanDifficultiesCmnToYue(props: { lang: keyof I18nText }) {
    const { lang } = props;

    const [input, setInput] = React.useState<string>("廣州話");
    const [result, setResult] = React.useState<Pronunciation[]>([]);
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
    // count how many hanzis are of blank, green and red colors, and sum
    const [bgrColorCnt, setBgrColorCnt] = React.useState<[number, number, number, number]>([0, 0, 0, 0]);

    const hanjppy_add_my = (hanjppy: string[]): Pronunciation => {
        let [hanzi, jp, py] = hanjppy;
        if (jp === "" && py === "") return {
            isHanzi: false,
            text: hanzi,
            jp_initial: "",
            jp_final: "",
            jp_tone: "",
            py_initial: "",
            py_final: "",
            py_tone: "",
            my_initial: "",
            my_final: "",
            my_tone: ""
        };

        // 拆解 jyut ping
        let jp_tone = 0;
        if (!isNaN(parseInt(jp.charAt(jp.length - 1)))) {
            jp_tone = parseInt(jp.charAt(jp.length - 1));
            jp = jp.slice(0, -1);
        }
        let jp_initial = "";
        let i = 0;
        while (i < jp.length && !'aeiouy'.includes(jp.charAt(i))) {
            jp_initial += jp.charAt(i);
            i++;
        }
        let jp_final = jp.slice(i);

        // 拆解 pinyin
        let py_origin = py;
        py = py.replace(/yi/g, 'i');
        py = py.replace(/y(?!u)/g, 'i'); // 匹配y开头者如yan yong you 但不含 yu-
        py = py.replace(/wu/g, 'u');
        py = py.replace(/ü/g, 'yu');
        py = py.replace(/ju/g, 'jyu');
        py = py.replace(/qu/g, 'qyu');
        py = py.replace(/xu/g, 'xyu');
        let py_tone = "0";
        if (!isNaN(parseInt(py.charAt(py.length - 1)))) {
            py_tone = py.charAt(py.length - 1);
            py = py.slice(0, -1);
        }
        let py_initial = "";
        i = 0;
        while (i < py.length && !'aeiouy'.includes(py.charAt(i))) {
            py_initial += py.charAt(i);
            i++;
        }
        let py_final = py.slice(i);

        let [my_initial, my_final, my_tone] = mancan_convert(
            py_origin, py_initial, py_final, py_tone, selectedOptions, jp_final
        );

        return {
            isHanzi: true,
            text: hanzi,
            jp_initial: jp_initial,
            jp_final: jp_final,
            jp_tone: "" + jp_tone,
            py_initial: py_initial,
            py_final: py_final,
            py_tone: "" + py_tone,
            my_initial: my_initial,
            my_final: my_final,
            my_tone: "" + my_tone
        };
    }

    function translateMandarinToCantonese(input: string): Pronunciation[] {
        let jps = ToJyutping.getJyutpingList(input);
        let pys = pinyin(input, {
            toneType: 'num',              // 启用多音字模式
            type: 'array',                // 启用分词，以解决多音字问题。默认不开启，使用 true 开启使用 Intl.Segmenter 分词库。
        })

        // [[hanzi, jp, py]...]
        let mergedArray = mergeArrays(jps, pys);

        console.log(jps)
        console.log(pys)
        console.log(mergedArray)

        // 模拟转换逻辑，返回示例数据
        return mergedArray.map(hanjppy_add_my);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // 点击「转换」按钮
    const handleSubmit = () => {
        const characters = input;
        const translations = translateMandarinToCantonese(characters);
        setResult(translations);
        let [b, g, r, sum] = [0, 0, 0, 0];
        // The same logic as color assigning
        translations.forEach((pronunciation) => {
            if (pronunciation.isHanzi) {
                (pronunciation.jp_initial === pronunciation.my_initial && pronunciation.jp_final === pronunciation.my_final && pronunciation.jp_tone === pronunciation.my_tone) ?
                    b++ :
                    (pronunciation.my_initial.split('/').some(part => part === pronunciation.jp_initial)
                        && pronunciation.my_final.split('/').some(part => part === pronunciation.jp_final)
                        && pronunciation.my_tone.split('/').some(part => part === pronunciation.jp_tone)) ?
                        g++ :
                        r++;
                sum++;
            }
        });
        setBgrColorCnt([b, g, r, sum]);
    };

    const [openTooltipIndex, setOpenTooltipIndex] = React.useState<number | null>(null);

    const handleTooltipClose = () => {
        setOpenTooltipIndex(null);
    };

    const handleTooltipOpen = (index: number) => {
        setOpenTooltipIndex(openTooltipIndex === index ? null : index);
    };

    // 处理单个选项的点击
    const handleOptionChange = (value: string) => {
        setSelectedOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value],
        );
    };

    // 全选
    const handleSelectAll = () => {
        setSelectedOptions(mancan_options.map((option) => option.value));
    };

    // 全不选
    const handleDeselectAll = () => {
        setSelectedOptions([]);
    };

    const [dialogueOpen, setDialogueOpen] = React.useState(false);

    const handleDialogueOpen = () => {
        setDialogueOpen(true);
    };

    const handleDialogueClose = () => {
        setDialogueOpen(false);
    };

    const handleReplaceSelectChange = (event: SelectChangeEvent<string>) => {
        setSelectedReplaceOption(event.target.value as string);
    };
    const handleReplace = () => {
        switch (selectedReplaceOption) {
            case '2500':
                setInput(hansPrim2500);
                break;
            case '3500':
                setInput(hansPhonOrdered3500);
                break;
            case 'hkcommon':
                fetch('https://raw.githubusercontent.com/nk2028/commonly-used-chinese-characters-and-words/main/char.txt')
                    .then(response => response.text())
                    .then(data => {
                        setInput(data.replaceAll("\n", " "));
                    })
                    .catch(error => {
                        console.error('Error fetching text:', error);
                    });
                break;
            case 'qianziwen':
                fetch('https://pustot.github.io/public/corpus/Qianziwen.txt')
                    .then(response => response.text())
                    .then(data => {
                        setInput(data);
                    })
                    .catch(error => {
                        console.error('Error fetching text:', error);
                    });
                break;
            case 'wiki-example':
                fetch('https://pustot.github.io/public/corpus/WikiExample.txt')
                    .then(response => response.text())
                    .then(data => {
                        setInput(data);
                    })
                    .catch(error => {
                        console.error('Error fetching text:', error);
                    });
                break;
            // Add more cases as needed
            default:
                // Handle default case
                break;
        }
    };
    const handleInputClear = () => {
        setInput("");
        setResult([]);
        setBgrColorCnt([0, 0, 0, 0]);
    }

    const [selectedReplaceOption, setSelectedReplaceOption] = React.useState("");
    const [expanded, setExpanded] = React.useState(false);

    return (
        <Container maxWidth="md">
            <BackButton />

            <Typography variant="h3" m={2}>
                {getLocaleText(
                    {
                        "zh-Hans": "普通粤",
                        "zh-Hant": "普通粵",
                        en: "Mancan",
                        ja: "マンカン",
                        de: "Mancan",
                        ko: "Mancan",
                        "ko-Han": "Mancan",
                        eo: "Mancan",
                        fr: "Mancan",
                        vi: "Mancan",
                        "vi-Han": "Mancan",
                        es: "Mancan",
                        "tto-bro": "Mancan",
                        tto: "Mancan",
                    },
                    lang
                )}
            </Typography>

            <Typography variant="body1" m={1}>
                {getLocaleText(
                    {
                        "zh-Hans": "使用通用而简单的推导规则，直接用普通话读音推导广州话读音，并标出所有不合此规则之要素。",
                        "zh-Hant": "使用通用而簡單嘅推導規則，直接用普通話讀音推導廣州話讀音，並標出所有唔合此規則之要素",
                        "en": "Using a general and simple derivation rule, we derive the Cantonese pronunciation directly from the Mandarin pronunciation, and mark all elements that do not comply with this rule.",
                        "de": "Unter Verwendung einer allgemeinen und einfachen Ableitungsregel leiten wir die kantonesische Aussprache direkt von der Mandarin-Aussprache ab und markieren wir alle Elemente, die nicht mit dieser Regel übereinstimmen.",
                        "ja": "一般的で簡単な導出規則を使用して、広東語の発音を普通話の発音から直接導き出し、この規則に準拠しないすべての要素をマークします。",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1" m={1}>
                {getLocaleText(
                    {
                        "zh-Hans": "符合以下最简单一对一规则者，该部分拼音显示为普通文本颜色（亮色模式为黑色，暗色模式为白色）。",
                    },
                    lang
                )}
            </Typography>
            <Box mx={2}>
                <Button onClick={handleDialogueOpen} variant="contained" color="primary">
                    关于普转粤一对一规则
                </Button>
                <Dialog open={dialogueOpen} onClose={handleDialogueClose}>
                    <DialogTitle>普转粤一对一规则</DialogTitle>
                    <DialogContent>
                        <div>
                            此处所列规则皆是根据港中文之数据，其普通话发音所对应的各种广州话发音只有唯一一个含「较多」字数者，故称为一对一。  <br />
                            此等规则如下：<br />
                            <ul>
                                <li>声母大多数直接与广州话相同：bpmf dtnl g zcs； </li>
                                <li>以下翘舌声母也易转换：zh➡️z；ch➡️c；sh➡️s；r➡️j；</li>
                                <li>以下韵母若忽略介音则普广相同：a/ia/ua➡️aa；o/uo➡️o；ie➡️e；uai➡️aai；ueng/ong/iong➡️ung；an➡️aan/aam；</li>
                                <li>其他一对一韵母：yue➡️入声yut/ok；i（舌尖ɿʅ）➡️i；er➡️i；uei➡️eoi；iao➡️iu；ou/iou➡️au；ian➡️im/in；en➡️an；in➡️an/am；uen➡️eon；yun➡️an；iang➡️oeng；uang➡️ong；</li>
                            </ul>
                        </div>
                    </DialogContent>
                </Dialog>
            </Box>

            <Typography variant="body1" m={1}>
                <MuiLink href="https://github.com/pustot/PustoNoto/blob/master/400-Lingvo/400-zh-yue-%E7%B2%B5-Kantona.md#%E6%99%AE%E8%BD%89%E7%B2%B5%E8%BD%AC%E6%8D%A2%E8%A7%84%E5%88%99%E4%B8%8E%E4%B8%8D%E8%A7%84%E5%88%99%E6%80%BB%E7%BB%93"
                    target="_blank" rel="noopener noreferrer">
                    更多说明见此笔记
                </MuiLink>
            </Typography>

            <Typography variant="body1" m={1}>
                {getLocaleText(
                    {
                        "zh-Hans": "符合以下复选框中选中的比较通用的一对多规则者，该部分拼音显示为绿色。",
                    },
                    lang
                )}
            </Typography>

            {/* 显示选项 */}
            <Box m={2}>
                {expanded
                    ? mancan_options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            control={
                                <Checkbox
                                    checked={selectedOptions.includes(option.value)}
                                    onChange={() => handleOptionChange(option.value)}
                                />
                            }
                            label={option.label}
                        />
                    ))
                    : mancan_options.slice(0, 3).map((option) => (
                        <FormControlLabel
                            key={option.value}
                            control={
                                <Checkbox
                                    checked={selectedOptions.includes(option.value)}
                                    onChange={() => handleOptionChange(option.value)}
                                />
                            }
                            label={option.label}
                        />
                    ))}
                {mancan_options.length > 3 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1 }}>
                        {expanded ? (
                            <Button variant="text" onClick={() => setExpanded(false)}>
                                隐藏 <ExpandLessIcon fontSize="small" />
                            </Button>
                        ) : (
                            <Button variant="text" onClick={() => setExpanded(true)}>
                                ...展开 <ExpandMoreIcon fontSize="small" />
                            </Button>
                        )}
                    </Box>
                )}
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Button variant="contained" onClick={handleSelectAll} sx={{ mr: 2 }}>
                        全选
                    </Button>
                    <Button variant="contained" onClick={handleDeselectAll}>
                        全不选
                    </Button>
                </Box>
            </Box>

            <Typography variant="body1" m={1}>
                {getLocaleText(
                    {
                        "zh-Hans": "不符合上述规则者，该部分拼音显示为红色。",
                    },
                    lang
                )}
            </Typography>

            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                {/* To Replace with Default Texts */}
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel id="select-label">选择预设文本</InputLabel>
                        <Select
                            labelId="select-label"
                            value={selectedReplaceOption}
                            onChange={handleReplaceSelectChange}
                            label="选择替换内容"
                        >
                            {/* <MenuItem value="">请选择</MenuItem> */}
                            <MenuItem value="hkcommon">替换为香港《教師語文能力評核（普通話）參照使用常用字表》</MenuItem>
                            <MenuItem value="2500">替换为2500常用字（笔画序）</MenuItem>
                            <MenuItem value="3500">替换为3500常用字（拼音序）</MenuItem>
                            <MenuItem value="qianziwen">替换为千字文</MenuItem>
                            <MenuItem value="wiki-example">替换为维基示例</MenuItem>
                            {/* Add more menu items as needed */}
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleReplace} startIcon={<CloudDownloadIcon />}>
                        替换
                    </Button>
                    <Button variant="contained" onClick={handleSubmit} startIcon={<SendIcon />}>
                        转粤
                    </Button>
                    <Button variant="contained" onClick={handleInputClear} startIcon={<DeleteForeverIcon />}>
                        清除文本
                    </Button>
                </Box>

                {/* Input */}
                <TextField label="输入汉字" variant="outlined" value={input}
                    multiline placeholder="問天地好在。我而家學緊廣州話。"
                    maxRows={12}
                    onChange={handleInputChange} fullWidth />

                <Button variant="contained" onClick={handleSubmit} startIcon={<SendIcon />}>
                    转换
                </Button>
                <Button variant="contained" onClick={handleInputClear} startIcon={<DeleteForeverIcon />}>
                    清除文本
                </Button>

                {/* Statistics */}
                <Typography variant="body1" m={1}>
                    {getLocaleText(
                        {
                            "zh-Hans": "各规则字数统计：适用简单规则者（无红绿部分者）：",
                        },
                        lang
                    )}
                    {bgrColorCnt[0] + " (" + (bgrColorCnt[3] == 0 ? 0 : (bgrColorCnt[0] / bgrColorCnt[3] * 100).toFixed(1)) + "%) "}
                    {getLocaleText(
                        {
                            "zh-Hans": "，适用简单+绿色规则者（无红色部分者）：",
                        },
                        lang
                    )}
                    <GreenHighlight>
                        {bgrColorCnt[0] + bgrColorCnt[1] + " (" + (bgrColorCnt[3] == 0 ? 0 : ((bgrColorCnt[0] + bgrColorCnt[1]) / bgrColorCnt[3] * 100).toFixed(1)) + "%) "}
                    </GreenHighlight>
                    {getLocaleText(
                        {
                            "zh-Hans": "，不适用以上规则者（有红色部分者）：",
                        },
                        lang
                    )}
                    <Highlight>
                        {bgrColorCnt[2] + " (" + (bgrColorCnt[3] == 0 ? 0 : ((bgrColorCnt[2]) / bgrColorCnt[3] * 100).toFixed(1)) + "%) "}
                    </Highlight>
                </Typography>

                {/* Display the Result */}
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Box mt={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                        {result.map((pronunciation, index) => (
                            pronunciation.text === "\n" ? <div style={{ width: '100%', height: '0' }} /> :
                                pronunciation.isHanzi ?
                                    <Tooltip
                                        key={index}
                                        PopperProps={{
                                            disablePortal: true,
                                        }}
                                        onClose={handleTooltipClose}
                                        open={openTooltipIndex === index}
                                        disableFocusListener
                                        disableHoverListener
                                        disableTouchListener
                                        title={
                                            <>
                                                <Typography>普通话: {pronunciation.py_initial + pronunciation.py_final + pronunciation.py_tone}</Typography>
                                                <Typography>粤语: {pronunciation.jp_initial + pronunciation.jp_final + pronunciation.jp_tone}</Typography>
                                                <Typography>普推粤: {pronunciation.my_initial + " " + pronunciation.my_final + " " + pronunciation.my_tone}</Typography>
                                            </>
                                        }
                                    >
                                        <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}
                                            onMouseEnter={() => handleTooltipOpen(index)}
                                            onMouseLeave={handleTooltipClose}
                                            onClick={() => handleTooltipOpen(index)}
                                        >
                                            <Typography sx={{ fontSize: '1em', lineHeight: '1' }}>
                                                {pronunciation.jp_initial !== pronunciation.my_initial ?
                                                    (pronunciation.my_initial.split('/').some(part => part === pronunciation.jp_initial) ?
                                                        <GreenHighlight>{pronunciation.jp_initial}</GreenHighlight> :
                                                        <Highlight>{pronunciation.jp_initial}</Highlight>) :
                                                    pronunciation.jp_initial}
                                                {pronunciation.jp_final !== pronunciation.my_final ?
                                                    (pronunciation.my_final.split('/').some(part => part === pronunciation.jp_final) ?
                                                        <GreenHighlight>{pronunciation.jp_final}</GreenHighlight> :
                                                        <Highlight>{pronunciation.jp_final}</Highlight>) :
                                                    pronunciation.jp_final}
                                                {pronunciation.jp_tone !== pronunciation.my_tone ?
                                                    (pronunciation.my_tone.split('/').some(part => part === pronunciation.jp_tone) ?
                                                        <GreenHighlight>{pronunciation.jp_tone}</GreenHighlight> :
                                                        <Highlight>{pronunciation.jp_tone}</Highlight>) :
                                                    pronunciation.jp_tone}
                                            </Typography>
                                            <Typography sx={{ lineHeight: '1.5' }} variant="h6">{pronunciation.text}</Typography>
                                        </Box>
                                    </Tooltip>
                                    :
                                    <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography sx={{ lineHeight: '1.5', whiteSpace: 'pre-line' }} variant="h6">{pronunciation.text}</Typography>
                                    </Box>
                        ))}
                    </Box>
                </ClickAwayListener>

            </Box>


        </Container>
    );
}
