# WanderPaw AI旅行规划集成指南

## 功能概述

WanderPaw现在集成了基于小红书数据和AI的智能旅行规划功能，能够为用户和他们的宠物生成个性化的旅行计划。

## 技术架构

### 1. 数据流程
```
用户选择城市和主题 
    ↓
调用小红书API搜索相关内容
    ↓
整合宠物信息、旅行主题、小红书数据
    ↓
发送到Dify AI工作流
    ↓
生成个性化旅行计划
    ↓
在界面中展示
```

### 2. 核心服务

#### XhsService (小红书服务)
- **文件位置**: `src/services/xhsService.ts`
- **功能**: 搜索小红书旅行相关内容
- **主要方法**:
  - `searchTravelContent()`: 搜索旅行内容
  - `processTravelData()`: 处理搜索结果
  - `checkHealth()`: 检查服务状态

#### TripPlanningService (旅行规划服务)
- **文件位置**: `src/services/tripPlanningService.ts`
- **功能**: 整合数据并调用Dify AI生成计划
- **主要方法**:
  - `generateTripPlan()`: 生成完整旅行计划
  - `parseTripPlanFromDify()`: 解析AI响应
  - `checkHealth()`: 检查服务状态

## 使用流程

### 1. 用户操作流程
1. **登录**: 用户必须先登录获得访问令牌
2. **设置宠物信息**: 填写宠物的基本信息（姓名、类型、性格等）
3. **选择城市**: 从城市列表中选择目的地
4. **选择主题**: 选择旅行主题（拍照打卡、自然疗愈、人文体验、随机探索）
5. **生成计划**: 点击"生成计划"按钮，系统会：
   - 搜索小红书相关内容
   - 调用AI生成个性化计划
   - 展示结果

### 2. 技术实现细节

#### 小红书数据搜索
```typescript
// 构建搜索关键词
const keywords = [cityName, '旅行', '攻略', ...themeNames]
const query = keywords.join(' ')

// 调用小红书API
const response = await XhsService.searchTravelContent(cityName, themeNames)
```

#### Dify工作流调用
```typescript
const difyInputs = {
  // 基础信息
  destination: cityName,
  travel_themes: themes.join(', '),
  language: language,
  
  // 宠物信息
  pet_name: petInfo.name,
  pet_type: petInfo.type,
  pet_character: petInfo.character,
  
  // 小红书数据
  xhs_travel_tips: xhsData.travelTips.join('\n'),
  xhs_popular_spots: xhsData.popularSpots.join(', '),
  xhs_recommendations: xhsData.recommendations.join('\n'),
  
  // 生成要求
  generate_coordinates: true,
  include_timeline: true,
  include_pet_activities: true,
  output_format: 'structured_json'
}
```

## 环境配置

### 1. 小红书API后端
- **地址**: `https://xhsxhs.zeabur.app`
- **端点**: `/spider/search`
- **状态**: 已部署到Zeabur云服务
- **文档**: [Swagger文档](https://xhsxhs.zeabur.app/docs) | [ReDoc文档](https://xhsxhs.zeabur.app/redoc)
- **健康检查**: [https://xhsxhs.zeabur.app/health](https://xhsxhs.zeabur.app/health)

### 2. WanderPaw Fastify后端
- **地址**: `https://backeenee.zeabur.app`
- **代理地址**: `/api` (通过Vite代理)
- **端点**: `/chat/message`
- **配置**: 需要在环境变量中设置Dify API密钥

### 3. 环境变量配置 (.env.development)
```bash
# Dify配置
DIFY_API_KEY=app-ypeXRNry3AVEJyhyoCIk6J5A
DIFY_BASE_URL=https://api.dify.ai/v1

# Dify工作流配置
DIFY_TASK_PLANNING_API_KEY=app-ypeXRNry3AVEJyhyoCIk6J5A
```

## 错误处理

### 1. CORS跨域问题
- **解决方案**: 使用Vite代理配置
- **小红书API**: 通过 `/xhs-api` 代理访问
- **WanderPaw后端**: 通过 `/api` 代理访问

### 2. 网络连接问题
- 如果无法连接到小红书服务，系统会使用默认数据
- 如果无法连接到Dify服务，系统会切换到离线模式

### 3. 认证问题
- 检查用户登录状态
- 验证访问令牌有效性

### 4. 数据解析问题
- Dify响应解析失败时，使用降级文本解析
- 提供友好的错误提示

### 5. API端点问题
- **修复**: 使用正确的端点 `/chat/message` 而不是 `/chat/process-message`
- **健康检查**: 使用 `/auth/status` 端点检查后端状态

## UI组件修改

### 1. TripThemesView
- **修改**: 添加了AI生成逻辑到"生成计划"按钮
- **新增状态**: `isGenerating` 用于显示加载状态
- **增强功能**: 
  - 加载状态显示
  - 错误处理和用户提示
  - 备用方案（离线模式）

### 2. TripPlanView
- **修改**: 支持显示AI生成的计划数据
- **新增状态**: 
  - `planTitle`: 计划标题
  - `planSummary`: 计划摘要
  - `isAiGenerated`: AI生成标识
- **增强功能**:
  - AI定制标识显示
  - 计划摘要展示
  - 个性化成功提示

## 数据接口

### 1. TripPlanningRequest
```typescript
interface TripPlanningRequest {
  cityName: string
  cityNameEn: string
  themes: string[]
  themeNames: string[]
  duration?: number
  petInfo: PetInfo
  xhsData?: XhsProcessedData
  language: 'zh' | 'en'
}
```

### 2. TripPlanningResponse
```typescript
interface TripPlanningResponse {
  success: boolean
  message: string
  data?: {
    planTitle: string
    planTitleEn: string
    activities: GeneratedTripActivity[]
    summary: string
    summaryEn: string
    totalDuration: number
    estimatedBudget?: number
    notes: string[]
    xhsSourceCount: number
  }
  error?: string
}
```

## 测试建议

### 1. 单元测试
- 测试小红书API调用
- 测试Dify工作流响应解析
- 测试错误处理逻辑

### 2. 集成测试
- 测试完整的生成流程
- 测试网络故障场景
- 测试不同城市和主题组合

### 3. 用户测试
- 测试加载状态显示
- 测试错误提示友好性
- 测试生成结果的合理性

## 开发注意事项

1. **API密钥安全**: 确保Dify API密钥仅在服务端使用
2. **超时处理**: 设置合理的请求超时时间（小红书30秒，Dify 60秒）
3. **降级策略**: 提供多层降级方案确保用户体验
4. **日志记录**: 记录关键步骤用于调试和监控
5. **性能优化**: 考虑缓存机制减少重复API调用

## 未来优化方向

1. **缓存机制**: 缓存小红书搜索结果
2. **推荐算法**: 基于用户历史偏好优化推荐
3. **实时数据**: 集成更多实时旅行数据源
4. **多语言支持**: 扩展更多语言支持
5. **离线功能**: 增强离线模式的功能完整性 