# 躺平网 (TangPing.com) - 项目工程计划书

> 基于我们2024年8月2日的深度对话生成，本文档是我们产品开发的“宪法”和唯一真实来源 (Single Source of Truth)。

---

### **第一部分：核心理念与战略 (Core Philosophy & Strategy)**

1.  **产品使命 (Mission):** 赋予每个人通过看到真实可能性来重新设计自己生活的能力。
2.  **核心价值 (Core Value):** 我们提供“选择的自由”与“掌控生活的信心”。
3.  **产品哲学 (Philosophy):**
    *   先成为“人类生活图书馆”，再成为“人生设计工具”。
    *   从“数据驱动”转向“故事驱动”。
4.  **发展战略 (Strategy):**
    *   **UGC优先:** 以用户生成的“生活样本”为内容基石。
    *   **自下而上:** 先有真实、分散的个体故事，再聚合提炼出宏观、结构化的城市数据。
    *   **冷启动:** 手动邀请50位“创世分享者”来奠定社区基调和内容质量。

---

### **第二部分：三阶段发展路线图 (Three-Phase Roadmap)**

#### **阶段一: 创世计划 - 最小可行产品 (Genesis Plan - MVP)**

*   **目标:** 创建一个高质量的、静态的“人类生活图书馆”，展示50个被邀请的“生活样本”，验证产品的核心吸引力。

*   **Milestone 1: 定义“生活样本”数据结构 (The Data Foundation)**
    *   `[ ]` **任务1.1:** 在 `src/store/` 目录下创建新文件 `lifeSample.ts`。
    *   `[ ]` **任务1.2:** 在 `lifeSample.ts` 中，使用 TypeScript `interface` 定义 `LifeSample` 核心数据结构，此结构需深度平衡“观看者需求”与“分享者动机”，包含但不限于：
        *   `sharerProfile`: `{ id, nickname, ageRange, profession, familyStatus, socialLink? }` (分享者背景)
        *   `location`: `{ city, country, reasonForChoosing }` (地点与动机)
        *   `monthlyBudget`: `{ total, currency, breakdown: { housing, food, transport, utilities, entertainment, misc }, notes }` (可信的账本)
        *   `aDayInLife`: `{ weekdayDescription, weekendDescription }` (生动的一天)
        *   `prosAndCons`: `{ pros: string[], cons: string[] }` (不加滤镜的利弊)
        *   `coreAdvice`: string (给后来者的核心建议)
        *   `visuals`: `{ coverImage, galleryImages: string[] }` (眼见为实的证据)
        *   `customTags`: string[] (自我表达的标签)

*   **Milestone 2: 内容采集与存储 (Content Acquisition & Storage)**
    *   `[ ]` **任务2.1:** 设计一个在线表单 (Google Form/Typeform)，用于高效、结构化地邀请和收集“创世样本”。
    *   `[ ]` **任务2.2:** 在 `src/data/` 目录下创建 `genesisSamples.ts` 文件。
    *   `[ ]` **任务2.3:** 将收集到的前5-10个样本，按照 `LifeSample` 接口，手动转换并存储在 `genesisSamples.ts` 中作为MVP的静态数据源。

*   **Milestone 3: 前端开发 - 样本展示 (Frontend - Sample Display)**
    *   `[ ]` **任务3.1:** 创建新视图组件 `src/view/LibraryView.tsx`，作为展示所有生活样本的首页。UI以卡片网格布局，突出封面图和核心信息。
    *   `[ ]` **任务3.2:** 创建新视图组件 `src/view/SampleDetailView.tsx`，用于展示单个生活样本的完整内容。
    *   `[ ]` **任务3.3 (核心):** 在 `SampleDetailView.tsx` 中，精心设计UI，用优雅的可视化方式（如使用ECharts的甜甜圈图展示预算构成）和故事化叙述，呈现样本的每个模块。
    *   `[ ]` **任务3.4:** 设置React Router，将 `/` 指向 `LibraryView`，并设置动态路由 `/sample/:id` 指向 `SampleDetailView`。
    *   `[ ]` **任务3.5:** **战略性调整:** 暂时隐藏或移除现有的地图视图 (`HomeView.tsx`)，将产品100%的焦点集中在“生活图书馆”上，避免用户分心。

*   **Milestone 4: 部署与冷启动 (Deployment & Cold Start)**
    *   `[ ]` **任务4.1:** 将MVP版本通过Vercel或Netlify持续集成部署。
    *   `[ ]` **任务4.2:** (非工程任务) 创始人/市场团队开始一对一邀请目标创世分享者，目标完成50个高质量样本的填充。

---

#### **阶段二: 社区化与开放UGC (Community & Open UGC)**

*   **目标:** 允许用户自主上传“生活样本”，并引入基础社区互动，形成内容自增长飞轮。

*   **Milestone 5: 后端与数据库 (Backend & Database)**
    *   `[ ]` **任务5.1:** 技术选型：评估并选择后端框架 (如 Next.js API Routes) 和数据库服务 (如 Supabase/Firebase)。
    *   `[ ]` **任务5.2:** 设计数据库Schema，精确映射 `LifeSample` 数据结构，并建立用户表。
    *   `[ ]` **任务5.3:** 开发核心API Endpoints: `POST /samples`, `GET /samples`, `GET /samples/:id` 等。

*   **Milestone 6: 用户系统与UGC表单 (User System & UGC Form)**
    *   `[ ]` **任务6.1:** 实现用户认证系统（推荐使用社交登录以降低门槛）。
    *   `[ ]` **任务6.2:** 在前端创建 `src/view/SubmitView.tsx`，将在线表单的功能转化为产品内的交互式UGC提交流程。
    *   `[ ]` **任务6.3:** 实现图片上传功能，并对接云存储服务 (如AWS S3, Cloudinary)。

*   **Milestone 7: 社区互动 (Community Interaction)**
    *   `[ ]` **任务7.1:** 在样本详情页下方添加评论区功能。
    *   `[ ]` **任务7.2:** 添加点赞/收藏样本的功能。
    *   `[ ]` **任务7.3:** 创建用户个人主页，展示其发布过的所有样本和收藏。

---

#### **阶段三: 数据沉淀与工具化 (Data Aggregation & Tooling)**

*   **目标:** 基于积累的真实UGC数据，自下而上地构建强大的城市数据分析和对比工具，兑现“人生设计工具”的最终承诺。

*   **Milestone 8: 数据聚合与分析 (Data Aggregation & Analysis)**
    *   `[ ]` **任务8.1:** 编写后端服务或定时脚本，定期聚合所有通过审核的“生活样本”数据。
    *   `[ ]` **任务8.2:** 计算并生成每个城市的聚合数据，如：平均/中位数生活成本、不同职业的薪资范围、出现频率最高的优缺点标签等。
    *   `[ ]` **任务8.3:** 将聚合后的数据存储到新的数据表 `CityProfile` 中。

*   **Milestone 9: “城市名片”与智能工具回归 (City Profile & Smart Tools Revival)**
    *   `[ ]` **任务9.1:** 创建 `CityProfileView.tsx`，用丰富的可视化方式展示聚合后的城市数据。
    *   `[ ]` **任务9.2:** **战略性回归:** 重新引入地图视图，但这次地图上的点将由真实的聚合数据驱动，并链接到 `CityProfileView`。
    *   `[ ]` **任务9.3:** 基于 `CityProfile` 数据，开发强大的城市对比功能和个性化推荐引擎。