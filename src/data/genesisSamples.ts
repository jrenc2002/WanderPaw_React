import { LifeSample, SocialPlatform } from '@/store/lifeSample'

// 创世样本：高质量的生活样本数据
export const genesisSamples: Record<string, LifeSample> = {
  'sample_001': {
    id: 'sample_001',
    version: '1.0.0',
    createdAt: '2024-12-19T10:00:00Z',
    updatedAt: '2024-12-19T10:00:00Z',
    status: 'published',
    
    sharerProfile: {
      id: 'sharer_001',
      nickname: '海淀码农小王',
      avatar: 'https://via.placeholder.com/100x100',
      ageRange: '25-30',
      profession: '前端工程师',
      workMode: 'hybrid',
      familyStatus: 'single',
      petStatus: 'cat',
      socialLinks: [
        {
          platform: SocialPlatform.XIAOHONGSHU,
          id: 'coding_life_hd',
          displayName: '海淀打工人',
          verified: false,
          followerCount: 1200,
          description: '分享程序员生活'
        },
        {
          platform: SocialPlatform.BILIBILI,
          id: 'BV1234567890',
          displayName: 'Code与生活',
          verified: false,
          followerCount: 800
        }
      ],
      personalTags: ['咖啡控', '夜猫子', '撸猫达人', '开源爱好者'],
      isAnonymous: false,
      privacyLevel: 'public'
    },
    
    location: {
      country: 'CN',
      countryName: '中国',
      province: '110000',
      provinceName: '北京市',
      city: '110100',
      cityName: '北京市',
      district: '110108',
      districtName: '海淀区',
      coordinates: [116.2989, 39.9589],
      areaDescription: '中关村软件园附近',
      nearbyLandmarks: ['地铁10号线西二旗站', '中关村软件园', '永辉超市', '小米科技园'],
      reasonForChoosing: '工作在中关村，想要通勤时间短一点，这里IT氛围浓厚，生活配套也还不错',
      locationPros: ['通勤便利', 'IT氛围浓厚', '配套设施完善', '同事朋友都在附近'],
      locationCons: ['房租较贵', '人流密集', '停车困难', '周末比较吵闹'],
      transportAccess: {
        subway: ['10号线西二旗站'],
        bus: ['447路', '509路', '681路'],
        airport: '首都机场约45分钟车程',
        trainStation: '北京西站约1小时地铁'
      }
    },
    
    monthlyBudget: {
      currency: 'CNY',
      totalMonthly: 8500,
      incomeMonthly: 18000,
      coreExpenses: {
        housing: {
          amount: 4200,
          type: 'rent',
          details: '一居室，35平米，包物业费',
          breakdown: { '房租': 4000, '物业费': 200 }
        },
        food: {
          amount: 1800,
          breakdown: { '外卖': 1200, '买菜做饭': 400, '聚餐': 200 },
          details: '工作日基本外卖，周末自己做饭，偶尔和同事聚餐'
        },
        transport: {
          amount: 300,
          breakdown: { '地铁': 150, '打车': 100, '共享单车': 50 },
          details: '主要地铁通勤，偶尔打车回家'
        },
        utilities: {
          amount: 400,
          breakdown: { '手机': 100, '宽带': 100, '电费': 150, '水费': 50 },
          details: '电费夏天空调用得多'
        }
      },
      optionalExpenses: {
        entertainment: {
          amount: 800,
          breakdown: { '电影': 200, 'Steam游戏': 300, '咖啡': 300 },
          details: '爱玩游戏，周末看电影，平时喝咖啡续命'
        },
        shopping: {
          amount: 600,
          breakdown: { '衣服': 300, '数码产品': 200, '猫粮猫砂': 100 },
          details: '不太买衣服，偶尔买点数码产品'
        },
        savings: {
          amount: 400,
          breakdown: { '余额宝': 400 },
          details: '每月强制储蓄一点'
        }
      },
      customCategories: {},
      notes: '这是我真实的生活成本，已经在北京生活2年了',
      lastUpdated: '2024-12-19',
      dataSource: 'detailed_tracking'
    },
    
    aDayInLife: {
      weekdaySchedule: {
        title: '996码农的真实一天',
        timeSlots: [
          { time: '07:30', activity: '闹钟响了三次才起床', location: '卧室', mood: '😴' },
          { time: '08:00', activity: '洗漱吃早餐', location: '家里', mood: '😪', cost: 15 },
          { time: '08:30', activity: '地铁通勤，刷手机', location: '地铁', mood: '😐' },
          { time: '09:30', activity: '到公司，先来杯咖啡', location: '公司', mood: '☕', cost: 25 },
          { time: '10:00', activity: '开始写代码，处理昨天的bug', location: '工位', mood: '💻' },
          { time: '12:00', activity: '和同事一起点外卖', location: '公司', mood: '🍱', cost: 35 },
          { time: '14:00', activity: '午休，趴桌子睡觉', location: '工位', mood: '😴' },
          { time: '18:00', activity: '继续写代码，偶尔摸鱼', location: '工位', mood: '😅' },
          { time: '21:00', activity: '终于下班！地铁回家', location: '地铁', mood: '😌' },
          { time: '22:00', activity: '到家撸猫，点个夜宵', location: '家里', mood: '😸', cost: 30 },
          { time: '23:30', activity: '玩会游戏或者学习', location: '卧室', mood: '🎮' },
          { time: '01:00', activity: '睡觉（理想情况下）', location: '卧室', mood: '😴' }
        ],
        highlights: ['撸猫治愈', '代码运行成功', '和同事聊天'],
        challenges: ['早起困难', '通勤拥挤', '加班疲惫']
      },
      weekendSchedule: {
        title: '码农的惬意周末',
        timeSlots: [
          { time: '10:00', activity: '自然醒，不用闹钟', location: '卧室', mood: '😊' },
          { time: '11:00', activity: '起床撸猫，准备早午餐', location: '厨房', mood: '😸' },
          { time: '12:00', activity: '做饭吃饭，很有仪式感', location: '厨房', mood: '🍳', cost: 50 },
          { time: '14:00', activity: '看电影或者打游戏', location: '客厅', mood: '🎬' },
          { time: '17:00', activity: '出门买菜，顺便遛弯', location: '超市', mood: '🚶', cost: 80 },
          { time: '19:00', activity: '做晚饭，偶尔叫朋友来', location: '厨房', mood: '👨‍🍳', cost: 60 },
          { time: '21:00', activity: '看技术文章或者刷剧', location: '沙发', mood: '📚' },
          { time: '23:00', activity: '早点睡，准备新的一周', location: '卧室', mood: '😴' }
        ],
        highlights: ['自己做饭', '充足睡眠', '学习新技术'],
        challenges: ['容易宅在家', '缺乏运动', '时间过得太快']
      },
      seasonalNotes: '夏天空调费用高，冬天取暖费贵，春秋天最舒服',
      rhythmSummary: '典型的程序员生活，工作日比较累，周末就想宅在家里'
    },
    
    prosAndCons: {
      pros: [
        {
          title: '通勤便利',
          description: '地铁10分钟到公司，再也不用挤1小时地铁了',
          importance: 5,
          category: 'lifestyle'
        },
        {
          title: 'IT氛围浓厚',
          description: '周围都是科技公司，很容易找到同行聊天学习',
          importance: 4,
          category: 'career'
        },
        {
          title: '生活配套完善',
          description: '楼下就有超市、咖啡厅、快递站，生活很方便',
          importance: 4,
          category: 'lifestyle'
        }
      ],
      cons: [
        {
          title: '房租压力大',
          description: '房租占收入的23%，虽然能承受但压力不小',
          severity: 4,
          category: 'financial',
          workaround: '考虑找室友合租或者搬到稍微远一点的地方'
        },
        {
          title: '缺乏运动空间',
          description: '附近没有好的健身房，运动机会很少',
          severity: 3,
          category: 'health',
          workaround: '买了健身环，在家里锻炼'
        }
      ],
      surprises: [
        {
          title: '猫咪社交',
          description: '因为养猫认识了不少邻居，意外建立了社交圈',
          type: 'positive'
        }
      ],
      regrets: ['没有早点搬到这里', '没有坚持健身'],
      bestDecisions: ['选择这个地段', '养了猫', '学会了做饭']
    },
    
    coreAdvice: {
      targetAudience: '在北京工作的程序员',
      mainAdvice: '通勤时间比省钱更重要，生活质量会提升很多',
      categorizedAdvice: {
        financial: ['房租控制在收入30%以内', '记账App很重要', '预留应急资金'],
        practical: ['选择地铁附近的房子', '学会基础做饭技能', '善用各种App'],
        social: ['多参加技术聚会', '和邻居搞好关系', '养宠物是很好的社交方式'],
        mindset: ['工作生活要分开', '不要太省钱而忽略生活质量', '保持学习心态']
      },
      pitfallsToAvoid: ['为了省钱选择通勤时间很长的地方', '完全不运动', '只吃外卖不学做饭'],
      prerequisites: ['稳定的工作收入', '基本的生活自理能力'],
      bestTimeToMove: '春秋季节，避开毕业季和年底',
      budgetTips: ['用记账App跟踪支出', '批量购买生活用品', '合理利用各种优惠券']
    },
    
    visuals: {
      coverImage: 'https://via.placeholder.com/400x300',
      galleryImages: [
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '我的小窝，虽然小但很温馨',
          category: 'housing'
        },
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '楼下的地铁站，通勤很方便',
          category: 'transport'
        },
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '我家的猫主子',
          category: 'lifestyle'
        },
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '周末自己做的早餐',
          category: 'food'
        }
      ],
      imageRights: 'original',
      watermarkPreference: 'subtle'
    },
    
    customTags: ['北京生活', '程序员', '独居', '养猫', '中关村'],
    qualityScore: 85,
    verificationStatus: 'verified',
    viewCount: 1520,
    likeCount: 89,
    shareCount: 23,
    commentCount: 45,
    visibility: 'public',
    allowComments: true,
    allowDataUsage: true
  },

  'sample_002': {
    id: 'sample_002',
    version: '1.0.0',
    createdAt: '2024-12-19T11:00:00Z',
    updatedAt: '2024-12-19T11:00:00Z',
    status: 'published',
    
    sharerProfile: {
      id: 'sharer_002',
      nickname: '杭州设计师小美',
      avatar: 'https://via.placeholder.com/100x100',
      ageRange: '25-30',
      profession: 'UI/UX设计师',
      workMode: 'remote',
      familyStatus: 'couple',
      petStatus: 'none',
      socialLinks: [
        {
          platform: SocialPlatform.XIAOHONGSHU,
          id: 'design_life_hz',
          displayName: '杭州设计小美',
          verified: true,
          followerCount: 5200,
          description: '分享设计师的美好生活'
        },
        {
          platform: SocialPlatform.INSTAGRAM,
          id: 'designlife_hangzhou',
          displayName: 'Design Life HZ',
          verified: false,
          followerCount: 1100
        }
      ],
      personalTags: ['美食达人', '旅行爱好者', '植物系女子', '极简主义'],
      isAnonymous: false,
      privacyLevel: 'public'
    },
    
    location: {
      country: 'CN',
      countryName: '中国',
      province: '330000',
      provinceName: '浙江省',
      city: '330100',
      cityName: '杭州市',
      district: '330106',
      districtName: '西湖区',
      coordinates: [120.1536, 30.2650],
      areaDescription: '西湖景区附近的老小区',
      nearbyLandmarks: ['西湖', '雷峰塔', '河坊街', '地铁1号线龙翔桥站'],
      reasonForChoosing: '从小就梦想住在西湖边，远程工作让这个梦想成真了',
      locationPros: ['风景优美', '文化氛围浓厚', '交通便利', '生活成本适中'],
      locationCons: ['旅游旺季人太多', '老小区设施有些陈旧', '湿气重'],
      transportAccess: {
        subway: ['1号线龙翔桥站', '2号线凤起路站'],
        bus: ['Y2路', '7路', '527路'],
        airport: '萧山机场约1小时车程',
        trainStation: '杭州东站约30分钟地铁'
      }
    },
    
    monthlyBudget: {
      currency: 'CNY',
      totalMonthly: 6800,
      incomeMonthly: 12000,
      coreExpenses: {
        housing: {
          amount: 2800,
          type: 'rent',
          details: '两室一厅，70平米，和男朋友合租',
          breakdown: { '房租': 2600, '物业费': 200 }
        },
        food: {
          amount: 1500,
          breakdown: { '买菜做饭': 800, '外卖': 400, '下午茶': 300 },
          details: '喜欢自己做饭，偶尔点外卖，经常和朋友喝下午茶'
        },
        transport: {
          amount: 200,
          breakdown: { '地铁': 100, '共享单车': 50, '打车': 50 },
          details: '基本不开车，主要靠地铁和单车'
        },
        utilities: {
          amount: 300,
          breakdown: { '手机': 80, '宽带': 100, '水电': 120 },
          details: '两个人分摊，费用不高'
        }
      },
      optionalExpenses: {
        entertainment: {
          amount: 800,
          breakdown: { '看展': 200, '电影': 150, '旅行': 450 },
          details: '喜欢看各种展览，每月会安排一次小旅行'
        },
        shopping: {
          amount: 600,
          breakdown: { '护肤品': 300, '衣服': 200, '家居用品': 100 },
          details: '比较注重护肤，衣服买得不多但质量要好'
        },
        education: {
          amount: 400,
          breakdown: { '在线课程': 200, '书籍': 100, '设计软件': 100 },
          details: '持续学习新的设计技能'
        },
        savings: {
          amount: 200,
          breakdown: { '定期存款': 200 },
          details: '每月存一点，为以后做准备'
        }
      },
      customCategories: {},
      notes: '远程工作让我可以更好地平衡生活和工作',
      lastUpdated: '2024-12-19',
      dataSource: 'mixed'
    },
    
    aDayInLife: {
      weekdaySchedule: {
        title: '远程设计师的自由一天',
        timeSlots: [
          { time: '08:00', activity: '自然醒，做瑜伽', location: '家里', mood: '☀️' },
          { time: '09:00', activity: '准备健康早餐', location: '厨房', mood: '🥗', cost: 20 },
          { time: '10:00', activity: '开始工作，处理邮件', location: '书房', mood: '💻' },
          { time: '12:00', activity: '做午饭，和男朋友一起吃', location: '厨房', mood: '🍱', cost: 30 },
          { time: '13:00', activity: '午休，看看书', location: '阳台', mood: '📚' },
          { time: '14:00', activity: '下午工作时间，设计新项目', location: '书房', mood: '🎨' },
          { time: '16:00', activity: '下午茶时间', location: '咖啡厅', mood: '☕', cost: 35 },
          { time: '18:00', activity: '工作结束，到西湖边散步', location: '西湖', mood: '🚶‍♀️' },
          { time: '19:30', activity: '回家做晚饭', location: '厨房', mood: '👩‍🍳', cost: 40 },
          { time: '21:00', activity: '看剧或者学习', location: '客厅', mood: '📺' },
          { time: '22:30', activity: '护肤，准备睡觉', location: '卧室', mood: '✨' }
        ],
        highlights: ['西湖散步', '和男朋友一起做饭', '工作时间自由'],
        challenges: ['需要很强的自律性', '有时会孤独', '工作生活边界模糊']
      },
      weekendSchedule: {
        title: '杭州周末小旅行',
        timeSlots: [
          { time: '09:00', activity: '睡到自然醒', location: '卧室', mood: '😴' },
          { time: '10:00', activity: '准备出门，计划周边游', location: '家里', mood: '🎒' },
          { time: '11:00', activity: '出发去周边景点', location: '高铁/汽车', mood: '🚄', cost: 100 },
          { time: '14:00', activity: '到达目的地，拍照打卡', location: '景点', mood: '📸', cost: 50 },
          { time: '18:00', activity: '品尝当地美食', location: '餐厅', mood: '🍜', cost: 120 },
          { time: '20:00', activity: '回杭州，整理照片', location: '回程路上', mood: '🌅' },
          { time: '22:00', activity: '到家休息，分享朋友圈', location: '家里', mood: '📱' }
        ],
        highlights: ['探索新地方', '美食体验', '拍照记录'],
        challenges: ['旅行费用', '行程规划', '人多拥挤']
      },
      seasonalNotes: '春天最美，夏天太热太潮湿，秋天很舒服，冬天有点阴冷',
      rhythmSummary: '远程工作给了我很大的自由度，可以更好地享受杭州的美好'
    },
    
    prosAndCons: {
      pros: [
        {
          title: '风景如画',
          description: '每天都能看到西湖美景，心情特别好',
          importance: 5,
          category: 'lifestyle'
        },
        {
          title: '生活成本适中',
          description: '比北上广便宜很多，生活压力小',
          importance: 4,
          category: 'financial'
        },
        {
          title: '文化氛围好',
          description: '经常有各种展览和文化活动',
          importance: 4,
          category: 'lifestyle'
        }
      ],
      cons: [
        {
          title: '湿气重',
          description: '春夏季节湿气很重，衣服不容易干',
          severity: 3,
          category: 'health',
          workaround: '买了除湿机和烘干机'
        },
        {
          title: '游客太多',
          description: '节假日和旅游旺季人山人海',
          severity: 2,
          category: 'lifestyle',
          workaround: '避开高峰期出门，选择小众景点'
        }
      ],
      surprises: [
        {
          title: '设计灵感丰富',
          description: '江南的美景给了我很多设计灵感',
          type: 'positive'
        }
      ],
      regrets: ['没有早点来杭州'],
      bestDecisions: ['选择远程工作', '搬到西湖边', '学会了做菜']
    },
    
    coreAdvice: {
      targetAudience: '想要来杭州生活的年轻人',
      mainAdvice: '杭州真的很适合年轻人生活，生活节奏适中，风景美丽',
      categorizedAdvice: {
        financial: ['房租预算控制好', '多利用公共交通', '学会做饭能省不少钱'],
        practical: ['选择地铁附近的房子', '备好除湿设备', '下载各种生活App'],
        social: ['多参加文化活动', '加入各种兴趣小组', '和邻居搞好关系'],
        mindset: ['慢生活的心态', '享受当下', '保持对美的敏感']
      },
      pitfallsToAvoid: ['旅游旺季找房子', '完全不运动', '忽视湿气对健康的影响'],
      prerequisites: ['远程工作能力或本地工作机会', '适应南方气候'],
      bestTimeToMove: '秋季最佳，春季次之',
      budgetTips: ['合理安排旅行预算', '多去免费的公园和博物馆', '团购优惠要利用']
    },
    
    visuals: {
      coverImage: 'https://via.placeholder.com/400x300',
      galleryImages: [
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '从家里看出去的西湖景色',
          category: 'housing'
        },
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '我的工作角落，很有设计感',
          category: 'work'
        },
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '和男朋友一起做的晚餐',
          category: 'food'
        },
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '周末去的小众咖啡厅',
          category: 'lifestyle'
        }
      ],
      imageRights: 'original',
      watermarkPreference: 'none'
    },
    
    customTags: ['杭州生活', '设计师', '远程工作', '西湖', '情侣'],
    qualityScore: 92,
    verificationStatus: 'verified',
    viewCount: 2840,
    likeCount: 156,
    shareCount: 67,
    commentCount: 89,
    visibility: 'public',
    allowComments: true,
    allowDataUsage: true
  },

  'sample_003': {
    id: 'sample_003',
    version: '1.0.0',
    createdAt: '2024-12-19T12:00:00Z',
    updatedAt: '2024-12-19T12:00:00Z',
    status: 'published',
    
    sharerProfile: {
      id: 'sharer_003',
      nickname: '成都奶茶店主小李',
      avatar: 'https://via.placeholder.com/100x100',
      ageRange: '30-35',
      profession: '奶茶店店主',
      workMode: 'onsite',
      familyStatus: 'married',
      petStatus: 'dog',
      socialLinks: [
        {
          platform: SocialPlatform.DOUYIN,
          id: 'chengdu_milktea_life',
          displayName: '成都奶茶小李',
          verified: false,
          followerCount: 3800,
          description: '记录成都奶茶店的日常'
        },
        {
          platform: SocialPlatform.XIAOHONGSHU,
          id: 'cdmilktea2024',
          displayName: '成都奶茶日记',
          verified: false,
          followerCount: 2100
        }
      ],
      personalTags: ['创业者', '美食探索', '成都生活', '夫妻档', '狗狗控'],
      isAnonymous: false,
      privacyLevel: 'public'
    },
    
    location: {
      country: 'CN',
      countryName: '中国',
      province: '510000',
      provinceName: '四川省',
      city: '510100',
      cityName: '成都市',
      district: '510107',
      districtName: '武侯区',
      coordinates: [104.0465, 30.6415],
      areaDescription: '华西坝附近，大学生聚集区',
      nearbyLandmarks: ['四川大学华西校区', '华西医院', '地铁7号线内环路站', '华西坝地铁站'],
      reasonForChoosing: '这里大学生多，奶茶需求大，而且房租相对便宜，适合创业',
      locationPros: ['年轻人聚集', '消费需求旺盛', '房租相对便宜', '交通便利'],
      locationCons: ['竞争激烈', '学生消费力有限', '暑假寒假客流下降', '停车困难'],
      transportAccess: {
        subway: ['7号线内环路站', '7号线华西坝站'],
        bus: ['12路', '27路', '72路', '92路'],
        airport: '双流机场约40分钟车程',
        trainStation: '成都站约30分钟车程'
      }
    },
    
    monthlyBudget: {
      currency: 'CNY',
      totalMonthly: 12000,
      incomeMonthly: 18000,
      coreExpenses: {
        housing: {
          amount: 3500,
          type: 'rent',
          details: '店铺租金，50平米临街商铺',
          breakdown: { '店铺租金': 3200, '水电费': 300 }
        },
        food: {
          amount: 2000,
          breakdown: { '原材料采购': 1200, '夫妻俩吃饭': 600, '员工餐费': 200 },
          details: '主要是奶茶原材料成本，偶尔请员工吃饭'
        },
        transport: {
          amount: 500,
          breakdown: { '电动车': 100, '汽车油费': 300, '偶尔打车': 100 },
          details: '主要开车采购原材料和配送'
        },
        utilities: {
          amount: 800,
          breakdown: { '手机': 200, '店内网络': 200, '设备维护': 400 },
          details: '两个人手机费，店内wifi，制茶设备保养'
        }
      },
      optionalExpenses: {
        entertainment: {
          amount: 1500,
          breakdown: { '电影': 300, '周末出游': 800, '朋友聚餐': 400 },
          details: '工作比较累，周末会安排娱乐放松'
        },
        shopping: {
          amount: 1200,
          breakdown: { '衣服': 500, '家居用品': 300, '狗粮狗用品': 400 },
          details: '基本的生活用品和宠物开销'
        },
        healthcare: {
          amount: 600,
          breakdown: { '体检': 200, '看病': 200, '保险': 200 },
          details: '创业压力大，比较注重健康'
        },
        savings: {
          amount: 1000,
          breakdown: { '定期存款': 800, '应急资金': 200 },
          details: '为了以后开分店攒钱'
        }
      },
      customCategories: {
        '店铺运营': {
          amount: 900,
          breakdown: { '营销推广': 400, '员工工资': 300, '包装材料': 200 },
          details: '店铺日常运营开支',
          icon: '🏪'
        }
      },
      notes: '创业第二年，收入逐渐稳定，计划明年开第二家店',
      lastUpdated: '2024-12-19',
      dataSource: 'detailed_tracking'
    },
    
    aDayInLife: {
      weekdaySchedule: {
        title: '奶茶店主的忙碌一天',
        timeSlots: [
          { time: '06:30', activity: '起床遛狗，准备开店', location: '家里', mood: '🐕', cost: 0 },
          { time: '07:30', activity: '到店里准备原材料', location: '奶茶店', mood: '☕', cost: 0 },
          { time: '08:30', activity: '开店营业，迎接第一批客人', location: '奶茶店', mood: '😊', cost: 0 },
          { time: '10:00', activity: '上午高峰期，学生陆续来买', location: '奶茶店', mood: '😅', cost: 0 },
          { time: '12:00', activity: '午餐高峰，和老婆一起忙碌', location: '奶茶店', mood: '💪', cost: 25 },
          { time: '14:00', activity: '下午相对轻松，整理库存', location: '奶茶店', mood: '📋', cost: 0 },
          { time: '16:00', activity: '下午茶时间，又开始忙起来', location: '奶茶店', mood: '🧋', cost: 0 },
          { time: '18:00', activity: '晚餐时段，准备新鲜水果', location: '奶茶店', mood: '🍓', cost: 0 },
          { time: '20:00', activity: '清理设备，准备关店', location: '奶茶店', mood: '🧹', cost: 0 },
          { time: '21:30', activity: '回家吃晚饭，和老婆聊天', location: '家里', mood: '🍚', cost: 40 },
          { time: '22:30', activity: '遛狗，规划明天的营销活动', location: '小区', mood: '🌙', cost: 0 },
          { time: '23:30', activity: '洗澡睡觉，准备明天', location: '家里', mood: '😴', cost: 0 }
        ],
        highlights: ['和老婆一起奋斗', '看到客人满意的笑容', '收入稳步增长'],
        challenges: ['站一整天很累', '原材料价格上涨', '竞争越来越激烈']
      },
      weekendSchedule: {
        title: '周末的小确幸',
        timeSlots: [
          { time: '08:00', activity: '睡个懒觉，难得的放松', location: '家里', mood: '😌', cost: 0 },
          { time: '09:30', activity: '和老婆一起遛狗吃早餐', location: '公园', mood: '🐕', cost: 30 },
          { time: '11:00', activity: '到店里处理库存和账务', location: '奶茶店', mood: '📊', cost: 0 },
          { time: '13:00', activity: '正常营业，周末客人更多', location: '奶茶店', mood: '😊', cost: 0 },
          { time: '16:00', activity: '下午茶高峰，忙个不停', location: '奶茶店', mood: '💨', cost: 0 },
          { time: '19:00', activity: '关店后去逛街，放松心情', location: '商场', mood: '🛍️', cost: 200 },
          { time: '21:00', activity: '找个不错的餐厅吃晚饭', location: '餐厅', mood: '🍽️', cost: 150 },
          { time: '22:30', activity: '回家看电视，和狗狗玩耍', location: '家里', mood: '📺', cost: 0 }
        ],
        highlights: ['有时间陪老婆逛街', '周末收入更好', '可以尝试新的奶茶配方'],
        challenges: ['周末更累', '没有完全的休息时间', '要平衡工作和生活']
      },
      seasonalNotes: '夏天是旺季，冬天相对淡一些，但成都人一年四季都爱喝奶茶',
      rhythmSummary: '虽然辛苦，但和老婆一起奋斗的感觉很好，看着事业慢慢成长很有成就感'
    },
    
    prosAndCons: {
      pros: [
        {
          title: '夫妻一起创业',
          description: '和最爱的人一起奋斗，每天都很充实',
          importance: 5,
          category: 'lifestyle'
        },
        {
          title: '收入可观且稳定',
          description: '月收入18000，在成都算不错了',
          importance: 5,
          category: 'financial'
        },
        {
          title: '成都生活成本低',
          description: '房租便宜，美食很多，生活质量高',
          importance: 4,
          category: 'financial'
        },
        {
          title: '客户群体年轻',
          description: '大学生很有活力，每天都很开心',
          importance: 3,
          category: 'social'
        }
      ],
      cons: [
        {
          title: '工作强度大',
          description: '一天站12小时，身体比较累',
          severity: 4,
          category: 'health',
          workaround: '买了舒适的鞋垫，定期按摩'
        },
        {
          title: '竞争激烈',
          description: '附近奶茶店越开越多',
          severity: 3,
          category: 'career',
          workaround: '注重产品质量和服务，培养老客户'
        },
        {
          title: '没有完整假期',
          description: '基本没有完整的休息日',
          severity: 3,
          category: 'lifestyle',
          workaround: '计划雇佣更多员工，给自己放假'
        }
      ],
      surprises: [
        {
          title: '意外的社交圈',
          description: '认识了很多有趣的大学生和老师',
          type: 'positive'
        },
        {
          title: '营销技能提升',
          description: '学会了短视频营销，粉丝越来越多',
          type: 'positive'
        }
      ],
      regrets: ['没有早点学会财务管理', '创业初期选址考虑不够周全'],
      bestDecisions: ['选择和老婆一起创业', '重视产品质量', '积极拥抱社交媒体营销']
    },
    
    coreAdvice: {
      targetAudience: '想要在成都创业的年轻夫妻',
      mainAdvice: '成都是个很适合小本创业的城市，成本不高，人们也很包容',
      categorizedAdvice: {
        financial: ['前期准备充足资金', '学会记账和财务管理', '多渠道收入很重要'],
        practical: ['选址要考虑人流和竞争', '重视产品质量和创新', '善用社交媒体营销'],
        social: ['和客户建立情感连接', '同行也可以是朋友', '重视员工关系'],
        mindset: ['创业要有耐心', '夫妻创业要分工明确', '保持学习和创新的心态']
      },
      pitfallsToAvoid: ['盲目扩张', '忽视财务管理', '不重视产品质量', '夫妻在工作中争吵'],
      prerequisites: ['一定的启动资金', '餐饮相关经验', '夫妻双方都要全力投入'],
      bestTimeToMove: '3-5月开店最佳，避开寒暑假',
      budgetTips: ['批量采购原材料', '合理控制人工成本', '利用外卖平台扩大销售']
    },
    
    visuals: {
      coverImage: 'https://via.placeholder.com/400x300',
      galleryImages: [
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '我们的小店，虽然不大但很温馨',
          category: 'work'
        },
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '和老婆一起调制新品',
          category: 'work'
        },
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '我们家的小狗，店里的吉祥物',
          category: 'lifestyle'
        },
        {
          url: 'https://via.placeholder.com/300x200',
          caption: '成都的美食太多了',
          category: 'food'
        }
      ],
      imageRights: 'original',
      watermarkPreference: 'subtle'
    },
    
    customTags: ['成都生活', '夫妻创业', '奶茶店', '小本创业', '川大'],
    qualityScore: 88,
    verificationStatus: 'verified',
    viewCount: 1980,
    likeCount: 134,
    shareCount: 45,
    commentCount: 67,
    visibility: 'public',
    allowComments: true,
    allowDataUsage: true
  }
}

// 导出一个获取所有样本的函数
export const getAllGenesisSamples = (): LifeSample[] => {
  return Object.values(genesisSamples)
}

// 根据城市获取样本
export const getSamplesByCity = (cityCode: string): LifeSample[] => {
  return getAllGenesisSamples().filter(sample => sample.location.city === cityCode)
}

// 根据标签获取样本
export const getSamplesByTag = (tag: string): LifeSample[] => {
  return getAllGenesisSamples().filter(sample => 
    sample.customTags.includes(tag) || 
    sample.sharerProfile.personalTags.includes(tag)
  )
} 