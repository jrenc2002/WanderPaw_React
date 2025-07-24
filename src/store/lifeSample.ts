// 生活样本核心数据结构
// 设计理念：平衡观看者需求与分享者动机，追求"数据+经验+情绪+自我+活人感"

// 社交媒体平台枚举
export enum SocialPlatform {
  XIAOHONGSHU = 'xiaohongshu',  // 小红书
  BILIBILI = 'bilibili',        // 哔哩哔哩
  DOUYIN = 'douyin',            // 抖音
  WEIBO = 'weibo',              // 微博
  WECHAT = 'wechat',            // 微信
  INSTAGRAM = 'instagram',       // Instagram
  TWITTER = 'twitter',          // Twitter/X
  YOUTUBE = 'youtube',          // YouTube
  TIKTOK = 'tiktok',            // TikTok
  LINKEDIN = 'linkedin',        // LinkedIn
  PERSONAL = 'personal'         // 个人网站/博客
}

// 社交媒体链接
export interface SocialLink {
  platform: SocialPlatform
  id: string                    // 用户ID或用户名
  displayName?: string          // 显示名称（可选）
  verified?: boolean            // 是否认证账号
  followerCount?: number        // 粉丝数（可选，用于信任度）
  description?: string          // 账号描述
}

// 分享者背景信息
export interface SharerProfile {
  id: string                    // 唯一标识
  nickname: string              // 昵称
  avatar?: string               // 头像URL
  ageRange: string              // 年龄段："20-25", "25-30", "30-35", etc.
  profession: string            // 职业
  workMode: 'remote' | 'hybrid' | 'onsite' | 'freelance' | 'unemployed' | 'retired' | 'student'
  familyStatus: 'single' | 'couple' | 'married' | 'family_with_kids' | 'other'
  petStatus?: 'cat' | 'dog' | 'both' | 'other' | 'none'  // 宠物状况
  
  // 社交媒体（核心特性）
  socialLinks: SocialLink[]
  
  // 个人特质标签
  personalTags: string[]        // 如：["咖啡控", "夜猫子", "健身达人", "二次元"]
  
  // 隐私保护
  isAnonymous: boolean          // 是否匿名分享
  privacyLevel: 'public' | 'limited' | 'friends_only'
}

// 详细地理位置（具体到区级别）
export interface DetailedLocation {
  // 行政区划（使用现有的geoData结构）
  country: string               // 国家代码，如 'CN'
  countryName: string           // 国家名称
  province: string              // 省/州代码
  provinceName: string          // 省/州名称
  city: string                  // 城市代码
  cityName: string              // 城市名称
  district: string              // 区/县代码（新增）
  districtName: string          // 区/县名称（新增）
  
  // 具体坐标
  coordinates: [number, number] // [经度, 纬度]
  
  // 位置描述
  areaDescription: string       // 区域描述，如"市中心CBD"、"大学城附近"、"郊区别墅区"
  nearbyLandmarks: string[]     // 附近地标，如["地铁2号线", "万达广场", "清华大学"]
  
  // 选择原因（情绪化内容）
  reasonForChoosing: string     // 为什么选择这里生活
  locationPros: string[]        // 位置优势
  locationCons: string[]        // 位置劣势
  
  // 交通信息
  transportAccess: {
    subway?: string[]           // 附近地铁线路
    bus?: string[]              // 主要公交线路
    airport?: string            // 最近机场及距离
    trainStation?: string       // 最近火车站及距离
  }
}

// 高扩展性账本结构
export interface FlexibleBudget {
  // 基础信息
  currency: string              // 货币单位
  totalMonthly: number          // 月度总支出
  incomeMonthly?: number        // 月度收入（可选）
  
  // 核心支出类别（固定）
  coreExpenses: {
    housing: {
      amount: number
      type: 'rent' | 'mortgage' | 'family_owned' | 'shared'
      details: string           // 如"一室一厅，包水电"
      breakdown?: Record<string, number>  // 细分项目，如 {"房租": 2000, "水电": 200}
    }
    food: {
      amount: number
      breakdown?: Record<string, number>  // 如 {"外卖": 800, "买菜": 600, "聚餐": 400}
      details: string           // 如"以外卖为主，周末自己做饭"
    }
    transport: {
      amount: number
      breakdown?: Record<string, number>  // 如 {"地铁": 150, "打车": 200, "汽油": 500}
      details: string
    }
    utilities: {
      amount: number
      breakdown?: Record<string, number>  // 如 {"手机": 100, "网络": 100, "水电": 200}
      details: string
    }
  }
  
  // 可选支出类别（灵活扩展）
  optionalExpenses: {
    entertainment?: {
      amount: number
      breakdown?: Record<string, number>  // 如 {"电影": 200, "KTV": 300, "旅游": 1000}
      details: string
    }
    healthcare?: {
      amount: number
      breakdown?: Record<string, number>
      details: string
    }
    education?: {
      amount: number
      breakdown?: Record<string, number>
      details: string
    }
    shopping?: {
      amount: number
      breakdown?: Record<string, number>
      details: string
    }
    savings?: {
      amount: number
      breakdown?: Record<string, number>
      details: string
    }
    debt?: {
      amount: number
      breakdown?: Record<string, number>
      details: string
    }
  }
  
  // 自定义类别（最高扩展性）
  customCategories: Record<string, {
    amount: number
    breakdown?: Record<string, number>
    details: string
    icon?: string              // 可选图标
  }>
  
  // 账本注释
  notes: string                // 总体说明
  lastUpdated: string          // 最后更新时间
  dataSource: 'detailed_tracking' | 'estimation' | 'mixed'  // 数据来源
}

// 生动的一天（活人感核心）
export interface LifeRhythm {
  weekdaySchedule: {
    title: string               // 如"996码农的一天"
    timeSlots: Array<{
      time: string              // 如"07:00"
      activity: string          // 如"闹钟响了三次才起床"
      location?: string         // 如"卧室"
      mood?: string             // 如"😴"
      cost?: number             // 如果有花费
    }>
    highlights: string[]        // 这一天的亮点
    challenges: string[]        // 这一天的挑战
  }
  
  weekendSchedule: {
    title: string               // 如"完美的周末"
    timeSlots: Array<{
      time: string
      activity: string
      location?: string
      mood?: string
      cost?: number
    }>
    highlights: string[]
    challenges: string[]
  }
  
  // 季节性变化
  seasonalNotes?: string       // 如"夏天太热，冬天太冷"
  
  // 生活节奏总结
  rhythmSummary: string        // 总体生活节奏描述
}

// 不加滤镜的利弊分析（真实情绪）
export interface HonestReview {
  // 优势
  pros: Array<{
    title: string               // 简短标题
    description: string         // 详细描述
    importance: 1 | 2 | 3 | 4 | 5  // 重要程度
    category: 'financial' | 'lifestyle' | 'career' | 'social' | 'health' | 'other'
  }>
  
  // 劣势
  cons: Array<{
    title: string
    description: string
    severity: 1 | 2 | 3 | 4 | 5    // 严重程度
    category: 'financial' | 'lifestyle' | 'career' | 'social' | 'health' | 'other'
    workaround?: string         // 解决方案（如果有）
  }>
  
  // 意外发现
  surprises?: Array<{
    title: string
    description: string
    type: 'positive' | 'negative' | 'neutral'
  }>
  
  // 后悔的事
  regrets?: string[]
  
  // 最满意的决定
  bestDecisions?: string[]
}

// 核心建议（经验价值）
export interface CoreAdvice {
  // 给特定人群的建议
  targetAudience: string        // 如"想要远程工作的程序员"
  
  // 核心建议
  mainAdvice: string            // 最重要的一条建议
  
  // 分类建议
  categorizedAdvice: {
    financial: string[]         // 财务建议
    practical: string[]         // 实用建议
    social: string[]            // 社交建议
    mindset: string[]           // 心态建议
  }
  
  // 避免的坑
  pitfallsToAvoid: string[]
  
  // 必备条件
  prerequisites?: string[]      // 如"需要有稳定收入来源"
  
  // 时间建议
  bestTimeToMove?: string       // 如"春季搬家最佳"
  
  // 预算建议
  budgetTips: string[]
}

// 视觉证据（眼见为实）
export interface VisualEvidence {
  // 封面图
  coverImage: string            // 主要展示图片
  
  // 图片集
  galleryImages: Array<{
    url: string
    caption: string             // 图片说明
    category: 'housing' | 'neighborhood' | 'lifestyle' | 'food' | 'transport' | 'work' | 'other'
    takenAt?: string            // 拍摄时间
  }>
  
  // 可选视频
  videos?: Array<{
    url: string
    title: string
    duration?: number           // 秒
    thumbnail?: string
  }>
  
  // 图片使用权限
  imageRights: 'original' | 'permission_granted' | 'cc_license'
  watermarkPreference?: 'none' | 'subtle' | 'visible'
}

// AI优化相关（为未来功能预留）
export interface AIOptimization {
  originalInput?: string        // 用户的原始输入
  aiSuggestions?: string[]      // AI提供的建议
  aiGeneratedTags?: string[]    // AI生成的标签
  completionLevel: number       // 完成度百分比
  needsHumanReview: boolean     // 是否需要人工审核
}

// 生活样本主结构
export interface LifeSample {
  // 基础信息
  id: string                    // 唯一标识
  version: string               // 数据结构版本
  createdAt: string             // 创建时间
  updatedAt: string             // 更新时间
  status: 'draft' | 'published' | 'under_review' | 'archived'
  
  // 核心模块
  sharerProfile: SharerProfile  // 分享者背景
  location: DetailedLocation    // 详细位置
  monthlyBudget: FlexibleBudget // 月度账本
  aDayInLife: LifeRhythm       // 生活节奏
  prosAndCons: HonestReview     // 利弊分析
  coreAdvice: CoreAdvice        // 核心建议
  visuals: VisualEvidence       // 视觉证据
  
  // 扩展字段
  customTags: string[]          // 自定义标签
  aiOptimization?: AIOptimization  // AI优化信息
  
  // 质量控制
  qualityScore?: number         // 质量评分 (0-100)
  verificationStatus: 'unverified' | 'partially_verified' | 'verified'
  
  // 统计信息
  viewCount: number             // 浏览次数
  likeCount: number             // 点赞次数
  shareCount: number            // 分享次数
  commentCount: number          // 评论次数
  
  // 隐私和权限
  visibility: 'public' | 'unlisted' | 'private'
  allowComments: boolean
  allowDataUsage: boolean       // 是否允许用于城市数据聚合
}

// 生活样本集合状态
export interface LifeSampleState {
  samples: Record<string, LifeSample>  // 所有样本
  loading: boolean
  error: string
  filters: {
    location?: string
    budgetRange?: [number, number]
    profession?: string
    workMode?: string
    tags?: string[]
  }
  sortBy: 'newest' | 'oldest' | 'most_liked' | 'most_viewed' | 'quality_score'
}

// 工具函数类型
export type LifeSampleValidator = (sample: Partial<LifeSample>) => {
  isValid: boolean
  errors: string[]
  warnings: string[]
  completionRate: number
}

export type LifeSampleOptimizer = (sample: Partial<LifeSample>) => {
  optimizedSample: Partial<LifeSample>
  suggestions: string[]
} 