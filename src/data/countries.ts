// SimRyoko eSIM - Complete Country Database (214 countries)
// Auto-generated content for landing pages, SEO, and product descriptions

export interface CountryData {
  slug: string;
  zh: string;
  en: string;
  ja: string;
  region: string;
  continent: string;
  /** ISO 3166-1 alpha-2 */
  code: string;
  /** Popular tourist destination flag */
  popular?: boolean;
  /** SEO meta description (Chinese) */
  metaDesc: string;
  /** Landing page intro paragraph (Chinese) */
  intro: string;
  /** Key travel tips for eSIM users */
  tips: string[];
}

// ─── Regions ───
const EAST_ASIA = '东亚';
const SE_ASIA = '东南亚';
const SOUTH_ASIA = '南亚';
const CENTRAL_ASIA = '中亚';
const WEST_ASIA = '西亚/中东';
const EUROPE_WEST = '西欧';
const EUROPE_EAST = '东欧';
const EUROPE_NORTH = '北欧';
const EUROPE_SOUTH = '南欧';
const NORTH_AMERICA = '北美';
const CENTRAL_AMERICA = '中美洲';
const SOUTH_AMERICA = '南美';
const CARIBBEAN = '加勒比';
const NORTH_AFRICA = '北非';
const WEST_AFRICA = '西非';
const EAST_AFRICA = '东非';
const SOUTH_AFRICA_R = '南部非洲';
const CENTRAL_AFRICA = '中非';
const OCEANIA = '大洋洲';
const PACIFIC = '太平洋岛国';

function makeMetaDesc(zh: string): string {
  return `SimRyoko ${zh} eSIM卡 - 即买即用，高速4G/5G网络，${zh}旅游上网首选。无需换卡，扫码激活，覆盖全境。`;
}

function makeIntro(zh: string, en: string): string {
  return `前往${zh}旅行？SimRyoko为您提供${zh}（${en}）专属eSIM数据套餐。无需购买当地SIM卡，出发前在线购买，落地即可扫码激活使用。享受当地运营商优质4G/5G网络，畅游${zh}不断网。`;
}

function makeTips(zh: string): string[] {
  return [
    `确保您的手机支持eSIM功能（iPhone XS及以上、大部分安卓旗舰机）`,
    `建议在出发前购买并下载eSIM配置文件，到达${zh}后开启数据漫游即可使用`,
    `如需拨打当地电话，建议搭配VoIP应用使用`,
    `套餐流量用完可随时在SimRyoko购买续费包`,
  ];
}

// ─── Top 30 Popular Destinations (detailed) ───
const popularCountries: CountryData[] = [
  {
    slug: 'japan', zh: '日本', en: 'Japan', ja: '日本', region: EAST_ASIA, continent: 'Asia', code: 'JP', popular: true,
    metaDesc: 'SimRyoko日本eSIM卡 - 高速4G/5G网络，覆盖东京、大阪、京都等全境。即买即用，日本旅游上网首选，docomo/au/SoftBank优质网络。',
    intro: '去日本旅行？SimRyoko日本eSIM让您畅享docomo、au、SoftBank三大运营商优质网络。覆盖东京、大阪、京都、北海道、冲绳等全日本热门景点，从繁华都市到偏远温泉乡，信号稳定，网速飞快。无需在机场排队购卡，出发前购买，落地扫码即用。',
    tips: ['日本5G网络覆盖东京、大阪等主要城市，建议选择含5G的套餐', '地铁内信号良好，可正常使用Google Maps导航', '北海道、冲绳等偏远地区建议选择覆盖docomo网络的套餐', '套餐含日本当地IP，可正常访问日本限定内容'],
  },
  {
    slug: 'south-korea', zh: '韩国', en: 'South Korea', ja: '韓国', region: EAST_ASIA, continent: 'Asia', code: 'KR', popular: true,
    metaDesc: 'SimRyoko韩国eSIM卡 - SK/KT/LG U+三网覆盖，首尔、釜山、济州岛高速上网。韩国旅游eSIM首选。',
    intro: '韩国旅行必备！SimRyoko韩国eSIM接入SK Telecom、KT、LG U+三大运营商，覆盖首尔、釜山、济州岛、仁川等全境。韩国5G网络全球领先，让您刷视频、发朋友圈畅通无阻。',
    tips: ['韩国5G覆盖率全球最高，强烈推荐5G套餐', '地铁/KTX高铁内信号优秀', '济州岛全岛覆盖，无需担心信号问题', '可正常使用Naver Map和KakaoMap导航'],
  },
  {
    slug: 'thailand', zh: '泰国', en: 'Thailand', ja: 'タイ', region: SE_ASIA, continent: 'Asia', code: 'TH', popular: true,
    metaDesc: 'SimRyoko泰国eSIM卡 - AIS/TrueMove网络，曼谷、清迈、普吉岛高速上网。泰国旅游eSIM即买即用。',
    intro: '泰国是中国游客最爱的度假天堂。SimRyoko泰国eSIM接入AIS、TrueMove等优质网络，从曼谷街头到清迈古城，从普吉海滩到芭提雅夜市，随时随地高速上网，分享您的精彩旅途。',
    tips: ['曼谷、清迈、普吉岛等热门区域4G覆盖优秀', '岛屿地区（甲米、苏梅岛）建议选择AIS网络套餐', '泰国网络可正常使用微信、支付宝等中国App', '如需访问部分限制网站，建议自备VPN'],
  },
  {
    slug: 'united-states', zh: '美国', en: 'United States', ja: 'アメリカ', region: NORTH_AMERICA, continent: 'North America', code: 'US', popular: true,
    metaDesc: 'SimRyoko美国eSIM卡 - T-Mobile/AT&T网络，覆盖全美50州。纽约、洛杉矶、旧金山高速上网，美国旅游eSIM首选。',
    intro: '游览美国？SimRyoko美国eSIM接入T-Mobile、AT&T等主流运营商网络，覆盖全美50州及主要城市。无论是纽约时代广场、洛杉矶好莱坞，还是旧金山金门大桥、拉斯维加斯大道，都能畅享高速网络。',
    tips: ['美国国土辽阔，国家公园等偏远地区可能信号较弱', '建议选择T-Mobile网络套餐，城市覆盖最佳', '夏威夷和阿拉斯加同样覆盖', '可搭配Google Fi或WiFi使用，确保偏远地区连接'],
  },
  {
    slug: 'united-kingdom', zh: '英国', en: 'United Kingdom', ja: 'イギリス', region: EUROPE_WEST, continent: 'Europe', code: 'GB', popular: true,
    metaDesc: 'SimRyoko英国eSIM卡 - EE/Vodafone/Three网络，伦敦、曼城全境覆盖。英国旅游eSIM即买即用。',
    intro: '探索英伦三岛？SimRyoko英国eSIM覆盖英格兰、苏格兰、威尔士及北爱尔兰全境，接入EE、Vodafone、Three等优质运营商。伦敦、爱丁堡、曼彻斯特、牛津、剑桥，处处畅连。',
    tips: ['伦敦地铁部分线路已覆盖4G信号', '苏格兰高地部分区域信号较弱，建议提前下载离线地图', '英国套餐通常可在欧洲多国漫游使用', '可正常访问BBC等英国本地内容'],
  },
  {
    slug: 'france', zh: '法国', en: 'France', ja: 'フランス', region: EUROPE_WEST, continent: 'Europe', code: 'FR', popular: true,
    metaDesc: 'SimRyoko法国eSIM卡 - Orange/SFR网络，巴黎、尼斯、里昂全境覆盖。法国旅游eSIM即买即用。',
    intro: '浪漫法兰西之旅，网络不可少。SimRyoko法国eSIM让您在巴黎埃菲尔铁塔下直播、在普罗旺斯薰衣草田发照片、在尼斯海岸视频通话，全法高速4G/5G网络随身相伴。',
    tips: ['巴黎地铁内4G覆盖良好', '南法沿海地区信号优秀', '法国套餐通常含EU漫游，可在欧盟国家使用', '推荐Orange网络，覆盖最全面'],
  },
  {
    slug: 'germany', zh: '德国', en: 'Germany', ja: 'ドイツ', region: EUROPE_WEST, continent: 'Europe', code: 'DE', popular: true,
    metaDesc: 'SimRyoko德国eSIM卡 - Telekom/Vodafone网络，柏林、慕尼黑全境覆盖。德国旅游eSIM首选。',
    intro: '德国旅行商务两不误。SimRyoko德国eSIM覆盖柏林、慕尼黑、法兰克福、汉堡等全德主要城市，接入Deutsche Telekom、Vodafone优质网络，出差参展、自驾旅游均可畅快上网。',
    tips: ['德国高速公路(Autobahn)沿线覆盖良好', 'ICE高铁上建议使用车载WiFi配合eSIM', '可在整个欧盟区域漫游使用', '慕尼黑啤酒节期间网络拥挤，建议选择大流量套餐'],
  },
  {
    slug: 'italy', zh: '意大利', en: 'Italy', ja: 'イタリア', region: EUROPE_SOUTH, continent: 'Europe', code: 'IT', popular: true,
    metaDesc: 'SimRyoko意大利eSIM卡 - TIM/Vodafone网络，罗马、米兰、威尼斯全覆盖。意大利旅游eSIM即买即用。',
    intro: '意大利之旅，从罗马斗兽场到威尼斯水城，从米兰大教堂到佛罗伦萨乌菲兹美术馆，SimRyoko意大利eSIM让您随时导航、翻译、分享，尽享la dolce vita。',
    tips: ['意大利TIM网络覆盖最广', '威尼斯水上巴士区域信号良好', '阿玛尔菲海岸等山路段偶有信号盲区', '含EU漫游，跨境到瑞士需注意不含'],
  },
  {
    slug: 'spain', zh: '西班牙', en: 'Spain', ja: 'スペイン', region: EUROPE_SOUTH, continent: 'Europe', code: 'ES', popular: true,
    metaDesc: makeMetaDesc('西班牙'), intro: makeIntro('西班牙', 'Spain'), tips: makeTips('西班牙'),
  },
  {
    slug: 'australia', zh: '澳大利亚', en: 'Australia', ja: 'オーストラリア', region: OCEANIA, continent: 'Oceania', code: 'AU', popular: true,
    metaDesc: 'SimRyoko澳大利亚eSIM卡 - Telstra/Optus网络，悉尼、墨尔本、大堡礁区域覆盖。澳洲旅游eSIM首选。',
    intro: '南半球的精彩等您发现。SimRyoko澳大利亚eSIM接入Telstra、Optus等运营商，覆盖悉尼、墨尔本、布里斯班、黄金海岸等主要城市及旅游景点，让您在袋鼠岛和大堡礁也能保持连线。',
    tips: ['澳洲内陆(Outback)地区信号有限，建议选择Telstra网络', '大城市5G覆盖日益完善', '大堡礁部分岛屿依赖卫星信号', '自驾游建议提前下载离线地图备用'],
  },
  {
    slug: 'singapore', zh: '新加坡', en: 'Singapore', ja: 'シンガポール', region: SE_ASIA, continent: 'Asia', code: 'SG', popular: true,
    metaDesc: makeMetaDesc('新加坡'), intro: makeIntro('新加坡', 'Singapore'), tips: ['新加坡全岛5G覆盖，网速全球顶级', '樟宜机场内信号满格', '圣淘沙岛覆盖良好', '适合作为东南亚旅行的第一站测试eSIM'],
  },
  {
    slug: 'malaysia', zh: '马来西亚', en: 'Malaysia', ja: 'マレーシア', region: SE_ASIA, continent: 'Asia', code: 'MY', popular: true,
    metaDesc: makeMetaDesc('马来西亚'), intro: makeIntro('马来西亚', 'Malaysia'), tips: makeTips('马来西亚'),
  },
  {
    slug: 'indonesia', zh: '印度尼西亚', en: 'Indonesia', ja: 'インドネシア', region: SE_ASIA, continent: 'Asia', code: 'ID', popular: true,
    metaDesc: makeMetaDesc('印度尼西亚'), intro: '巴厘岛度假、雅加达商旅、科莫多探险——SimRyoko印尼eSIM助您畅游万岛之国。接入Telkomsel等主流运营商，巴厘岛、雅加达、日惹等热门区域4G覆盖优秀。', tips: ['巴厘岛主要旅游区4G覆盖良好', '偏远岛屿可能仅有3G信号', '推荐Telkomsel网络，印尼覆盖最广', '龙目岛和科莫多岛部分区域信号较弱'],
  },
  {
    slug: 'vietnam', zh: '越南', en: 'Vietnam', ja: 'ベトナム', region: SE_ASIA, continent: 'Asia', code: 'VN', popular: true,
    metaDesc: makeMetaDesc('越南'), intro: makeIntro('越南', 'Vietnam'), tips: makeTips('越南'),
  },
  {
    slug: 'philippines', zh: '菲律宾', en: 'Philippines', ja: 'フィリピン', region: SE_ASIA, continent: 'Asia', code: 'PH', popular: true,
    metaDesc: makeMetaDesc('菲律宾'), intro: makeIntro('菲律宾', 'Philippines'), tips: ['马尼拉、宿务4G覆盖良好', '长滩岛和巴拉望主要区域有信号', '偏远海岛建议备用离线地图', '推荐Globe或Smart网络'],
  },
  {
    slug: 'taiwan', zh: '台湾', en: 'Taiwan', ja: '台湾', region: EAST_ASIA, continent: 'Asia', code: 'TW', popular: true,
    metaDesc: makeMetaDesc('台湾'), intro: '宝岛台湾处处精彩。SimRyoko台湾eSIM覆盖台北、高雄、台中、花莲、垦丁等全岛，接入中华电信、台湾大哥大等优质4G/5G网络，夜市觅食、环岛骑行都不断网。', tips: ['台湾全岛4G覆盖优秀，包括太鲁阁等山区', '台北捷运内信号良好', '推荐中华电信网络，覆盖最全', '高铁沿线信号稳定'],
  },
  {
    slug: 'hong-kong', zh: '香港', en: 'Hong Kong', ja: '香港', region: EAST_ASIA, continent: 'Asia', code: 'HK', popular: true,
    metaDesc: makeMetaDesc('香港'), intro: makeIntro('香港', 'Hong Kong'), tips: ['香港5G覆盖全球领先', 'MTR地铁全线4G/5G覆盖', '可搭配澳门套餐使用', '适合中转旅客短期使用'],
  },
  {
    slug: 'macau', zh: '澳门', en: 'Macau', ja: 'マカオ', region: EAST_ASIA, continent: 'Asia', code: 'MO', popular: true,
    metaDesc: makeMetaDesc('澳门'), intro: makeIntro('澳门', 'Macau'), tips: makeTips('澳门'),
  },
  {
    slug: 'india', zh: '印度', en: 'India', ja: 'インド', region: SOUTH_ASIA, continent: 'Asia', code: 'IN', popular: true,
    metaDesc: makeMetaDesc('印度'), intro: makeIntro('印度', 'India'), tips: ['印度Jio和Airtel 4G覆盖主要城市', '泰姬陵等景点区域信号良好', '偏远农村地区可能仅有3G', '部分地区VPN使用受限需注意'],
  },
  {
    slug: 'turkey', zh: '土耳其', en: 'Turkey', ja: 'トルコ', region: WEST_ASIA, continent: 'Asia', code: 'TR', popular: true,
    metaDesc: makeMetaDesc('土耳其'), intro: '从伊斯坦布尔到卡帕多西亚，从棉花堡到安塔利亚，SimRyoko土耳其eSIM陪您穿越欧亚大陆。接入Turkcell优质网络，热气球上也能发朋友圈。', tips: ['伊斯坦布尔4G覆盖优秀', '卡帕多西亚热气球区域有信号', '爱琴海沿岸度假区覆盖良好', '推荐Turkcell网络，土耳其第一大运营商'],
  },
  {
    slug: 'egypt', zh: '埃及', en: 'Egypt', ja: 'エジプト', region: NORTH_AFRICA, continent: 'Africa', code: 'EG', popular: true,
    metaDesc: makeMetaDesc('埃及'), intro: makeIntro('埃及', 'Egypt'), tips: ['开罗、亚历山大4G覆盖良好', '金字塔景区有信号', '沙漠深处信号有限', '红海度假区覆盖良好'],
  },
  {
    slug: 'south-africa', zh: '南非', en: 'South Africa', ja: '南アフリカ', region: SOUTH_AFRICA_R, continent: 'Africa', code: 'ZA', popular: true,
    metaDesc: makeMetaDesc('南非'), intro: makeIntro('南非', 'South Africa'), tips: makeTips('南非'),
  },
  {
    slug: 'brazil', zh: '巴西', en: 'Brazil', ja: 'ブラジル', region: SOUTH_AMERICA, continent: 'South America', code: 'BR', popular: true,
    metaDesc: makeMetaDesc('巴西'), intro: makeIntro('巴西', 'Brazil'), tips: makeTips('巴西'),
  },
  {
    slug: 'mexico', zh: '墨西哥', en: 'Mexico', ja: 'メキシコ', region: NORTH_AMERICA, continent: 'North America', code: 'MX', popular: true,
    metaDesc: makeMetaDesc('墨西哥'), intro: makeIntro('墨西哥', 'Mexico'), tips: makeTips('墨西哥'),
  },
  {
    slug: 'canada', zh: '加拿大', en: 'Canada', ja: 'カナダ', region: NORTH_AMERICA, continent: 'North America', code: 'CA', popular: true,
    metaDesc: makeMetaDesc('加拿大'), intro: makeIntro('加拿大', 'Canada'), tips: ['温哥华、多伦多、蒙特利尔4G/5G覆盖优秀', '落基山脉部分区域信号有限', '推荐Bell或Rogers网络', '冬季滑雪场主要区域有信号'],
  },
  {
    slug: 'new-zealand', zh: '新西兰', en: 'New Zealand', ja: 'ニュージーランド', region: OCEANIA, continent: 'Oceania', code: 'NZ', popular: true,
    metaDesc: makeMetaDesc('新西兰'), intro: makeIntro('新西兰', 'New Zealand'), tips: ['奥克兰、惠灵顿4G覆盖优秀', '南岛自驾部分山路信号间断', '皇后镇等旅游区覆盖良好', '推荐Spark网络，覆盖最广'],
  },
  {
    slug: 'uae', zh: '阿联酋', en: 'UAE', ja: 'UAE', region: WEST_ASIA, continent: 'Asia', code: 'AE', popular: true,
    metaDesc: makeMetaDesc('阿联酋'), intro: '迪拜和阿布扎比的奢华之旅需要高速网络相伴。SimRyoko阿联酋eSIM接入Etisalat和du双网，从哈利法塔到棕榈岛，从沙漠冲沙到购物中心，5G极速体验。', tips: ['迪拜和阿布扎比5G覆盖领先全球', '注意：VoIP通话（如微信语音）可能受限', '推荐Etisalat网络', '沙漠Safari区域基本有4G覆盖'],
  },
  {
    slug: 'qatar', zh: '卡塔尔', en: 'Qatar', ja: 'カタール', region: WEST_ASIA, continent: 'Asia', code: 'QA', popular: true,
    metaDesc: makeMetaDesc('卡塔尔'), intro: makeIntro('卡塔尔', 'Qatar'), tips: makeTips('卡塔尔'),
  },
  {
    slug: 'saudi-arabia', zh: '沙特阿拉伯', en: 'Saudi Arabia', ja: 'サウジアラビア', region: WEST_ASIA, continent: 'Asia', code: 'SA', popular: true,
    metaDesc: makeMetaDesc('沙特阿拉伯'), intro: makeIntro('沙特阿拉伯', 'Saudi Arabia'), tips: makeTips('沙特阿拉伯'),
  },
  {
    slug: 'russia', zh: '俄罗斯', en: 'Russia', ja: 'ロシア', region: EUROPE_EAST, continent: 'Europe', code: 'RU', popular: true,
    metaDesc: makeMetaDesc('俄罗斯'), intro: makeIntro('俄罗斯', 'Russia'), tips: ['莫斯科和圣彼得堡4G覆盖良好', '西伯利亚铁路沿线信号间断', '注意：部分西方社交媒体可能受限', '推荐MTS或Beeline网络'],
  },
];

// ─── Extended 184 Countries (template-generated) ───
const extendedSlugs: Array<[string, string, string, string, string, string, string]> = [
  // [slug, zh, en, ja, region, continent, code]
  // Asia
  ['cambodia', '柬埔寨', 'Cambodia', 'カンボジア', SE_ASIA, 'Asia', 'KH'],
  ['myanmar', '缅甸', 'Myanmar', 'ミャンマー', SE_ASIA, 'Asia', 'MM'],
  ['laos', '老挝', 'Laos', 'ラオス', SE_ASIA, 'Asia', 'LA'],
  ['brunei', '文莱', 'Brunei', 'ブルネイ', SE_ASIA, 'Asia', 'BN'],
  ['timor-leste', '东帝汶', 'Timor-Leste', '東ティモール', SE_ASIA, 'Asia', 'TL'],
  ['mongolia', '蒙古', 'Mongolia', 'モンゴル', EAST_ASIA, 'Asia', 'MN'],
  ['bangladesh', '孟加拉国', 'Bangladesh', 'バングラデシュ', SOUTH_ASIA, 'Asia', 'BD'],
  ['sri-lanka', '斯里兰卡', 'Sri Lanka', 'スリランカ', SOUTH_ASIA, 'Asia', 'LK'],
  ['nepal', '尼泊尔', 'Nepal', 'ネパール', SOUTH_ASIA, 'Asia', 'NP'],
  ['pakistan', '巴基斯坦', 'Pakistan', 'パキスタン', SOUTH_ASIA, 'Asia', 'PK'],
  ['maldives', '马尔代夫', 'Maldives', 'モルディブ', SOUTH_ASIA, 'Asia', 'MV'],
  ['bhutan', '不丹', 'Bhutan', 'ブータン', SOUTH_ASIA, 'Asia', 'BT'],
  ['afghanistan', '阿富汗', 'Afghanistan', 'アフガニスタン', SOUTH_ASIA, 'Asia', 'AF'],
  ['kazakhstan', '哈萨克斯坦', 'Kazakhstan', 'カザフスタン', CENTRAL_ASIA, 'Asia', 'KZ'],
  ['uzbekistan', '乌兹别克斯坦', 'Uzbekistan', 'ウズベキスタン', CENTRAL_ASIA, 'Asia', 'UZ'],
  ['kyrgyzstan', '吉尔吉斯斯坦', 'Kyrgyzstan', 'キルギス', CENTRAL_ASIA, 'Asia', 'KG'],
  ['tajikistan', '塔吉克斯坦', 'Tajikistan', 'タジキスタン', CENTRAL_ASIA, 'Asia', 'TJ'],
  ['turkmenistan', '土库曼斯坦', 'Turkmenistan', 'トルクメニスタン', CENTRAL_ASIA, 'Asia', 'TM'],
  ['iran', '伊朗', 'Iran', 'イラン', WEST_ASIA, 'Asia', 'IR'],
  ['iraq', '伊拉克', 'Iraq', 'イラク', WEST_ASIA, 'Asia', 'IQ'],
  ['israel', '以色列', 'Israel', 'イスラエル', WEST_ASIA, 'Asia', 'IL'],
  ['jordan', '约旦', 'Jordan', 'ヨルダン', WEST_ASIA, 'Asia', 'JO'],
  ['lebanon', '黎巴嫩', 'Lebanon', 'レバノン', WEST_ASIA, 'Asia', 'LB'],
  ['kuwait', '科威特', 'Kuwait', 'クウェート', WEST_ASIA, 'Asia', 'KW'],
  ['bahrain', '巴林', 'Bahrain', 'バーレーン', WEST_ASIA, 'Asia', 'BH'],
  ['oman', '阿曼', 'Oman', 'オマーン', WEST_ASIA, 'Asia', 'OM'],
  ['yemen', '也门', 'Yemen', 'イエメン', WEST_ASIA, 'Asia', 'YE'],
  ['syria', '叙利亚', 'Syria', 'シリア', WEST_ASIA, 'Asia', 'SY'],
  ['palestine', '巴勒斯坦', 'Palestine', 'パレスチナ', WEST_ASIA, 'Asia', 'PS'],
  ['georgia', '格鲁吉亚', 'Georgia', 'ジョージア', WEST_ASIA, 'Asia', 'GE'],
  ['armenia', '亚美尼亚', 'Armenia', 'アルメニア', WEST_ASIA, 'Asia', 'AM'],
  ['azerbaijan', '阿塞拜疆', 'Azerbaijan', 'アゼルバイジャン', WEST_ASIA, 'Asia', 'AZ'],
  ['cyprus', '塞浦路斯', 'Cyprus', 'キプロス', WEST_ASIA, 'Asia', 'CY'],
  // Europe
  ['portugal', '葡萄牙', 'Portugal', 'ポルトガル', EUROPE_SOUTH, 'Europe', 'PT'],
  ['netherlands', '荷兰', 'Netherlands', 'オランダ', EUROPE_WEST, 'Europe', 'NL'],
  ['belgium', '比利时', 'Belgium', 'ベルギー', EUROPE_WEST, 'Europe', 'BE'],
  ['switzerland', '瑞士', 'Switzerland', 'スイス', EUROPE_WEST, 'Europe', 'CH'],
  ['austria', '奥地利', 'Austria', 'オーストリア', EUROPE_WEST, 'Europe', 'AT'],
  ['ireland', '爱尔兰', 'Ireland', 'アイルランド', EUROPE_WEST, 'Europe', 'IE'],
  ['luxembourg', '卢森堡', 'Luxembourg', 'ルクセンブルク', EUROPE_WEST, 'Europe', 'LU'],
  ['monaco', '摩纳哥', 'Monaco', 'モナコ', EUROPE_WEST, 'Europe', 'MC'],
  ['liechtenstein', '列支敦士登', 'Liechtenstein', 'リヒテンシュタイン', EUROPE_WEST, 'Europe', 'LI'],
  ['greece', '希腊', 'Greece', 'ギリシャ', EUROPE_SOUTH, 'Europe', 'GR'],
  ['croatia', '克罗地亚', 'Croatia', 'クロアチア', EUROPE_SOUTH, 'Europe', 'HR'],
  ['slovenia', '斯洛文尼亚', 'Slovenia', 'スロベニア', EUROPE_SOUTH, 'Europe', 'SI'],
  ['malta', '马耳他', 'Malta', 'マルタ', EUROPE_SOUTH, 'Europe', 'MT'],
  ['san-marino', '圣马力诺', 'San Marino', 'サンマリノ', EUROPE_SOUTH, 'Europe', 'SM'],
  ['andorra', '安道尔', 'Andorra', 'アンドラ', EUROPE_SOUTH, 'Europe', 'AD'],
  ['vatican', '梵蒂冈', 'Vatican City', 'バチカン', EUROPE_SOUTH, 'Europe', 'VA'],
  ['albania', '阿尔巴尼亚', 'Albania', 'アルバニア', EUROPE_SOUTH, 'Europe', 'AL'],
  ['north-macedonia', '北马其顿', 'North Macedonia', '北マケドニア', EUROPE_SOUTH, 'Europe', 'MK'],
  ['montenegro', '黑山', 'Montenegro', 'モンテネグロ', EUROPE_SOUTH, 'Europe', 'ME'],
  ['bosnia-herzegovina', '波黑', 'Bosnia & Herzegovina', 'ボスニア', EUROPE_SOUTH, 'Europe', 'BA'],
  ['serbia', '塞尔维亚', 'Serbia', 'セルビア', EUROPE_SOUTH, 'Europe', 'RS'],
  ['kosovo', '科索沃', 'Kosovo', 'コソボ', EUROPE_SOUTH, 'Europe', 'XK'],
  ['poland', '波兰', 'Poland', 'ポーランド', EUROPE_EAST, 'Europe', 'PL'],
  ['czech-republic', '捷克', 'Czech Republic', 'チェコ', EUROPE_EAST, 'Europe', 'CZ'],
  ['hungary', '匈牙利', 'Hungary', 'ハンガリー', EUROPE_EAST, 'Europe', 'HU'],
  ['slovakia', '斯洛伐克', 'Slovakia', 'スロバキア', EUROPE_EAST, 'Europe', 'SK'],
  ['romania', '罗马尼亚', 'Romania', 'ルーマニア', EUROPE_EAST, 'Europe', 'RO'],
  ['bulgaria', '保加利亚', 'Bulgaria', 'ブルガリア', EUROPE_EAST, 'Europe', 'BG'],
  ['ukraine', '乌克兰', 'Ukraine', 'ウクライナ', EUROPE_EAST, 'Europe', 'UA'],
  ['belarus', '白俄罗斯', 'Belarus', 'ベラルーシ', EUROPE_EAST, 'Europe', 'BY'],
  ['moldova', '摩尔多瓦', 'Moldova', 'モルドバ', EUROPE_EAST, 'Europe', 'MD'],
  ['lithuania', '立陶宛', 'Lithuania', 'リトアニア', EUROPE_EAST, 'Europe', 'LT'],
  ['latvia', '拉脱维亚', 'Latvia', 'ラトビア', EUROPE_EAST, 'Europe', 'LV'],
  ['estonia', '爱沙尼亚', 'Estonia', 'エストニア', EUROPE_EAST, 'Europe', 'EE'],
  ['sweden', '瑞典', 'Sweden', 'スウェーデン', EUROPE_NORTH, 'Europe', 'SE'],
  ['norway', '挪威', 'Norway', 'ノルウェー', EUROPE_NORTH, 'Europe', 'NO'],
  ['denmark', '丹麦', 'Denmark', 'デンマーク', EUROPE_NORTH, 'Europe', 'DK'],
  ['finland', '芬兰', 'Finland', 'フィンランド', EUROPE_NORTH, 'Europe', 'FI'],
  ['iceland', '冰岛', 'Iceland', 'アイスランド', EUROPE_NORTH, 'Europe', 'IS'],
  // Africa
  ['morocco', '摩洛哥', 'Morocco', 'モロッコ', NORTH_AFRICA, 'Africa', 'MA'],
  ['tunisia', '突尼斯', 'Tunisia', 'チュニジア', NORTH_AFRICA, 'Africa', 'TN'],
  ['algeria', '阿尔及利亚', 'Algeria', 'アルジェリア', NORTH_AFRICA, 'Africa', 'DZ'],
  ['libya', '利比亚', 'Libya', 'リビア', NORTH_AFRICA, 'Africa', 'LY'],
  ['nigeria', '尼日利亚', 'Nigeria', 'ナイジェリア', WEST_AFRICA, 'Africa', 'NG'],
  ['ghana', '加纳', 'Ghana', 'ガーナ', WEST_AFRICA, 'Africa', 'GH'],
  ['senegal', '塞内加尔', 'Senegal', 'セネガル', WEST_AFRICA, 'Africa', 'SN'],
  ['ivory-coast', '科特迪瓦', "Côte d'Ivoire", 'コートジボワール', WEST_AFRICA, 'Africa', 'CI'],
  ['mali', '马里', 'Mali', 'マリ', WEST_AFRICA, 'Africa', 'ML'],
  ['burkina-faso', '布基纳法索', 'Burkina Faso', 'ブルキナファソ', WEST_AFRICA, 'Africa', 'BF'],
  ['niger', '尼日尔', 'Niger', 'ニジェール', WEST_AFRICA, 'Africa', 'NE'],
  ['guinea', '几内亚', 'Guinea', 'ギニア', WEST_AFRICA, 'Africa', 'GN'],
  ['sierra-leone', '塞拉利昂', 'Sierra Leone', 'シエラレオネ', WEST_AFRICA, 'Africa', 'SL'],
  ['liberia', '利比里亚', 'Liberia', 'リベリア', WEST_AFRICA, 'Africa', 'LR'],
  ['togo', '多哥', 'Togo', 'トーゴ', WEST_AFRICA, 'Africa', 'TG'],
  ['benin', '贝宁', 'Benin', 'ベナン', WEST_AFRICA, 'Africa', 'BJ'],
  ['gambia', '冈比亚', 'Gambia', 'ガンビア', WEST_AFRICA, 'Africa', 'GM'],
  ['guinea-bissau', '几内亚比绍', 'Guinea-Bissau', 'ギニアビサウ', WEST_AFRICA, 'Africa', 'GW'],
  ['cabo-verde', '佛得角', 'Cabo Verde', 'カーボベルデ', WEST_AFRICA, 'Africa', 'CV'],
  ['mauritania', '毛里塔尼亚', 'Mauritania', 'モーリタニア', WEST_AFRICA, 'Africa', 'MR'],
  ['kenya', '肯尼亚', 'Kenya', 'ケニア', EAST_AFRICA, 'Africa', 'KE'],
  ['tanzania', '坦桑尼亚', 'Tanzania', 'タンザニア', EAST_AFRICA, 'Africa', 'TZ'],
  ['ethiopia', '埃塞俄比亚', 'Ethiopia', 'エチオピア', EAST_AFRICA, 'Africa', 'ET'],
  ['uganda', '乌干达', 'Uganda', 'ウガンダ', EAST_AFRICA, 'Africa', 'UG'],
  ['rwanda', '卢旺达', 'Rwanda', 'ルワンダ', EAST_AFRICA, 'Africa', 'RW'],
  ['mozambique', '莫桑比克', 'Mozambique', 'モザンビーク', EAST_AFRICA, 'Africa', 'MZ'],
  ['madagascar', '马达加斯加', 'Madagascar', 'マダガスカル', EAST_AFRICA, 'Africa', 'MG'],
  ['somalia', '索马里', 'Somalia', 'ソマリア', EAST_AFRICA, 'Africa', 'SO'],
  ['sudan', '苏丹', 'Sudan', 'スーダン', EAST_AFRICA, 'Africa', 'SD'],
  ['south-sudan', '南苏丹', 'South Sudan', '南スーダン', EAST_AFRICA, 'Africa', 'SS'],
  ['eritrea', '厄立特里亚', 'Eritrea', 'エリトリア', EAST_AFRICA, 'Africa', 'ER'],
  ['djibouti', '吉布提', 'Djibouti', 'ジブチ', EAST_AFRICA, 'Africa', 'DJ'],
  ['mauritius', '毛里求斯', 'Mauritius', 'モーリシャス', EAST_AFRICA, 'Africa', 'MU'],
  ['seychelles', '塞舌尔', 'Seychelles', 'セーシェル', EAST_AFRICA, 'Africa', 'SC'],
  ['comoros', '科摩罗', 'Comoros', 'コモロ', EAST_AFRICA, 'Africa', 'KM'],
  ['malawi', '马拉维', 'Malawi', 'マラウイ', EAST_AFRICA, 'Africa', 'MW'],
  ['zambia', '赞比亚', 'Zambia', 'ザンビア', EAST_AFRICA, 'Africa', 'ZM'],
  ['zimbabwe', '津巴布韦', 'Zimbabwe', 'ジンバブエ', EAST_AFRICA, 'Africa', 'ZW'],
  ['botswana', '博茨瓦纳', 'Botswana', 'ボツワナ', SOUTH_AFRICA_R, 'Africa', 'BW'],
  ['namibia', '纳米比亚', 'Namibia', 'ナミビア', SOUTH_AFRICA_R, 'Africa', 'NA'],
  ['angola', '安哥拉', 'Angola', 'アンゴラ', SOUTH_AFRICA_R, 'Africa', 'AO'],
  ['eswatini', '斯威士兰', 'Eswatini', 'エスワティニ', SOUTH_AFRICA_R, 'Africa', 'SZ'],
  ['lesotho', '莱索托', 'Lesotho', 'レソト', SOUTH_AFRICA_R, 'Africa', 'LS'],
  ['congo-drc', '刚果(金)', 'DR Congo', 'コンゴ民主共和国', CENTRAL_AFRICA, 'Africa', 'CD'],
  ['congo', '刚果(布)', 'Republic of Congo', 'コンゴ共和国', CENTRAL_AFRICA, 'Africa', 'CG'],
  ['cameroon', '喀麦隆', 'Cameroon', 'カメルーン', CENTRAL_AFRICA, 'Africa', 'CM'],
  ['gabon', '加蓬', 'Gabon', 'ガボン', CENTRAL_AFRICA, 'Africa', 'GA'],
  ['equatorial-guinea', '赤道几内亚', 'Equatorial Guinea', '赤道ギニア', CENTRAL_AFRICA, 'Africa', 'GQ'],
  ['central-african-republic', '中非共和国', 'Central African Republic', '中央アフリカ', CENTRAL_AFRICA, 'Africa', 'CF'],
  ['chad', '乍得', 'Chad', 'チャド', CENTRAL_AFRICA, 'Africa', 'TD'],
  ['sao-tome', '圣多美和普林西比', 'São Tomé & Príncipe', 'サントメ・プリンシペ', CENTRAL_AFRICA, 'Africa', 'ST'],
  ['burundi', '布隆迪', 'Burundi', 'ブルンジ', CENTRAL_AFRICA, 'Africa', 'BI'],
  // Americas
  ['argentina', '阿根廷', 'Argentina', 'アルゼンチン', SOUTH_AMERICA, 'South America', 'AR'],
  ['chile', '智利', 'Chile', 'チリ', SOUTH_AMERICA, 'South America', 'CL'],
  ['colombia', '哥伦比亚', 'Colombia', 'コロンビア', SOUTH_AMERICA, 'South America', 'CO'],
  ['peru', '秘鲁', 'Peru', 'ペルー', SOUTH_AMERICA, 'South America', 'PE'],
  ['venezuela', '委内瑞拉', 'Venezuela', 'ベネズエラ', SOUTH_AMERICA, 'South America', 'VE'],
  ['ecuador', '厄瓜多尔', 'Ecuador', 'エクアドル', SOUTH_AMERICA, 'South America', 'EC'],
  ['bolivia', '玻利维亚', 'Bolivia', 'ボリビア', SOUTH_AMERICA, 'South America', 'BO'],
  ['paraguay', '巴拉圭', 'Paraguay', 'パラグアイ', SOUTH_AMERICA, 'South America', 'PY'],
  ['uruguay', '乌拉圭', 'Uruguay', 'ウルグアイ', SOUTH_AMERICA, 'South America', 'UY'],
  ['guyana', '圭亚那', 'Guyana', 'ガイアナ', SOUTH_AMERICA, 'South America', 'GY'],
  ['suriname', '苏里南', 'Suriname', 'スリナム', SOUTH_AMERICA, 'South America', 'SR'],
  ['guatemala', '危地马拉', 'Guatemala', 'グアテマラ', CENTRAL_AMERICA, 'Central America', 'GT'],
  ['honduras', '洪都拉斯', 'Honduras', 'ホンジュラス', CENTRAL_AMERICA, 'Central America', 'HN'],
  ['el-salvador', '萨尔瓦多', 'El Salvador', 'エルサルバドル', CENTRAL_AMERICA, 'Central America', 'SV'],
  ['nicaragua', '尼加拉瓜', 'Nicaragua', 'ニカラグア', CENTRAL_AMERICA, 'Central America', 'NI'],
  ['costa-rica', '哥斯达黎加', 'Costa Rica', 'コスタリカ', CENTRAL_AMERICA, 'Central America', 'CR'],
  ['panama', '巴拿马', 'Panama', 'パナマ', CENTRAL_AMERICA, 'Central America', 'PA'],
  ['belize', '伯利兹', 'Belize', 'ベリーズ', CENTRAL_AMERICA, 'Central America', 'BZ'],
  ['cuba', '古巴', 'Cuba', 'キューバ', CARIBBEAN, 'Central America', 'CU'],
  ['jamaica', '牙买加', 'Jamaica', 'ジャマイカ', CARIBBEAN, 'Central America', 'JM'],
  ['dominican-republic', '多米尼加', 'Dominican Republic', 'ドミニカ共和国', CARIBBEAN, 'Central America', 'DO'],
  ['haiti', '海地', 'Haiti', 'ハイチ', CARIBBEAN, 'Central America', 'HT'],
  ['trinidad-tobago', '特立尼达和多巴哥', 'Trinidad & Tobago', 'トリニダード・トバゴ', CARIBBEAN, 'Central America', 'TT'],
  ['bahamas', '巴哈马', 'Bahamas', 'バハマ', CARIBBEAN, 'Central America', 'BS'],
  ['barbados', '巴巴多斯', 'Barbados', 'バルバドス', CARIBBEAN, 'Central America', 'BB'],
  ['puerto-rico', '波多黎各', 'Puerto Rico', 'プエルトリコ', CARIBBEAN, 'Central America', 'PR'],
  ['antigua-barbuda', '安提瓜和巴布达', 'Antigua & Barbuda', 'アンティグア・バーブーダ', CARIBBEAN, 'Central America', 'AG'],
  ['saint-lucia', '圣卢西亚', 'Saint Lucia', 'セントルシア', CARIBBEAN, 'Central America', 'LC'],
  ['grenada', '格林纳达', 'Grenada', 'グレナダ', CARIBBEAN, 'Central America', 'GD'],
  ['saint-vincent', '圣文森特', 'Saint Vincent', 'セントビンセント', CARIBBEAN, 'Central America', 'VC'],
  ['dominica', '多米尼克', 'Dominica', 'ドミニカ国', CARIBBEAN, 'Central America', 'DM'],
  ['saint-kitts', '圣基茨和尼维斯', 'Saint Kitts & Nevis', 'セントクリストファー・ネービス', CARIBBEAN, 'Central America', 'KN'],
  // Oceania
  ['fiji', '斐济', 'Fiji', 'フィジー', PACIFIC, 'Oceania', 'FJ'],
  ['papua-new-guinea', '巴布亚新几内亚', 'Papua New Guinea', 'パプアニューギニア', PACIFIC, 'Oceania', 'PG'],
  ['samoa', '萨摩亚', 'Samoa', 'サモア', PACIFIC, 'Oceania', 'WS'],
  ['tonga', '汤加', 'Tonga', 'トンガ', PACIFIC, 'Oceania', 'TO'],
  ['vanuatu', '瓦努阿图', 'Vanuatu', 'バヌアツ', PACIFIC, 'Oceania', 'VU'],
  ['solomon-islands', '所罗门群岛', 'Solomon Islands', 'ソロモン諸島', PACIFIC, 'Oceania', 'SB'],
  ['micronesia', '密克罗尼西亚', 'Micronesia', 'ミクロネシア', PACIFIC, 'Oceania', 'FM'],
  ['kiribati', '基里巴斯', 'Kiribati', 'キリバス', PACIFIC, 'Oceania', 'KI'],
  ['marshall-islands', '马绍尔群岛', 'Marshall Islands', 'マーシャル諸島', PACIFIC, 'Oceania', 'MH'],
  ['palau', '帕劳', 'Palau', 'パラオ', PACIFIC, 'Oceania', 'PW'],
  ['tuvalu', '图瓦卢', 'Tuvalu', 'ツバル', PACIFIC, 'Oceania', 'TV'],
  ['nauru', '瑙鲁', 'Nauru', 'ナウル', PACIFIC, 'Oceania', 'NR'],
  ['guam', '关岛', 'Guam', 'グアム', PACIFIC, 'Oceania', 'GU'],
  ['new-caledonia', '新喀里多尼亚', 'New Caledonia', 'ニューカレドニア', PACIFIC, 'Oceania', 'NC'],
  ['french-polynesia', '法属波利尼西亚', 'French Polynesia', 'フランス領ポリネシア', PACIFIC, 'Oceania', 'PF'],
  // Additional territories & countries to reach 214
  ['curacao', '库拉索', 'Curaçao', 'キュラソー', CARIBBEAN, 'Central America', 'CW'],
  ['aruba', '阿鲁巴', 'Aruba', 'アルバ', CARIBBEAN, 'Central America', 'AW'],
  ['bermuda', '百慕大', 'Bermuda', 'バミューダ', CARIBBEAN, 'North America', 'BM'],
  ['cayman-islands', '开曼群岛', 'Cayman Islands', 'ケイマン諸島', CARIBBEAN, 'Central America', 'KY'],
  ['us-virgin-islands', '美属维尔京群岛', 'US Virgin Islands', '米領ヴァージン諸島', CARIBBEAN, 'Central America', 'VI'],
  ['turks-caicos', '特克斯和凯科斯', 'Turks & Caicos', 'タークス・カイコス諸島', CARIBBEAN, 'Central America', 'TC'],
  ['martinique', '马提尼克', 'Martinique', 'マルティニーク', CARIBBEAN, 'Central America', 'MQ'],
  ['guadeloupe', '瓜德罗普', 'Guadeloupe', 'グアドループ', CARIBBEAN, 'Central America', 'GP'],
  ['reunion', '留尼汪', 'Réunion', 'レユニオン', EAST_AFRICA, 'Africa', 'RE'],
  ['mayotte', '马约特', 'Mayotte', 'マヨット', EAST_AFRICA, 'Africa', 'YT'],
  ['gibraltar', '直布罗陀', 'Gibraltar', 'ジブラルタル', EUROPE_SOUTH, 'Europe', 'GI'],
  ['faroe-islands', '法罗群岛', 'Faroe Islands', 'フェロー諸島', EUROPE_NORTH, 'Europe', 'FO'],
  ['greenland', '格陵兰', 'Greenland', 'グリーンランド', EUROPE_NORTH, 'North America', 'GL'],
];

const extendedCountries: CountryData[] = extendedSlugs.map(([slug, zh, en, ja, region, continent, code]) => ({
  slug, zh, en, ja, region, continent, code,
  metaDesc: makeMetaDesc(zh),
  intro: makeIntro(zh, en),
  tips: makeTips(zh),
}));

export const allCountries: CountryData[] = [...popularCountries, ...extendedCountries];

export const countryBySlug = new Map(allCountries.map(c => [c.slug, c]));

export const countriesByRegion = allCountries.reduce<Record<string, CountryData[]>>((acc, c) => {
  (acc[c.region] ??= []).push(c);
  return acc;
}, {});

export const countriesByContinent = allCountries.reduce<Record<string, CountryData[]>>((acc, c) => {
  (acc[c.continent] ??= []).push(c);
  return acc;
}, {});

export default allCountries;
