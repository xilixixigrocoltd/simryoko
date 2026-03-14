# SimRyoko AI团队成员执行任务清单

**生成时间**: 2026-03-14 23:30  
**团队规模**: 5个AI角色  
**执行周期**: 4周  
**优先级**: P0立即执行

---

## 🤖 AI团队成员 #1: UI/UX设计师

### 角色定位
- **名称**: UI-Designer-AI
- **职责**: 视觉设计、组件设计、交互设计
- **优先级**: P0（立即执行）

### 今天任务（Day 1 - 3/14）

**上午 (9:00-12:00)**
```
□ 1. 创建Figma项目文件
   - 文件命名: "SimRyoko-Design-System-v2.0"
   - 创建5个Page: Design System / Home / Country / Search / Assets

□ 2. 设置色彩系统
   - Primary: #FF6B35 (品牌橙)
   - Secondary: #1E3A5F (品牌蓝)
   - Success: #10B981
   - Warning: #F59E0B
   - Error: #EF4444
   - Neutral: Gray scale 50-900

□ 3. 设置字体系统
   - Hero: 56px Bold
   - H1: 40px Bold
   - H2: 32px SemiBold
   - H3: 24px SemiBold
   - Body: 16px Regular
   - Caption: 12px Regular
```

**下午 (14:00-18:00)**
```
□ 4. 创建Button组件
   - Primary (品牌橙)
   - Secondary (品牌蓝)
   - Outline (边框)
   - Ghost (透明)
   - 状态: Default/Hover/Active/Loading/Disabled

□ 5. 创建Input组件
   - Text Input (标准)
   - Search Input (胶囊形)
   - 状态: Default/Focus/Error/Success

□ 6. 创建ProductCard组件
   - 标准版
   - Hot版 (热销标签)
   - Voice版 (语音标签)
```

**交付物**:
- Figma文件链接
- Design System完成
- 3个基础组件

---

## 🤖 AI团队成员 #2: 前端开发

### 角色定位
- **名称**: Frontend-Dev-AI
- **职责**: Next.js开发、组件实现、页面构建
- **优先级**: P0（立即执行）

### 今天任务（Day 1 - 3/14）

**上午 (9:00-12:00)**
```bash
# 1. 项目初始化
npx create-next-app@latest simryoko-web \
  --typescript \
  --tailwind \
  --app \
  --use-npm

cd simryoko-web

# 2. 安装依赖
npm install framer-motion lucide-react @headlessui/react

# 3. 配置Tailwind (tailwind.config.ts)
# - 品牌色: primary-500: #FF6B35
# - 字体: Inter
# - 间距: 4px基础单位
```

**下午 (14:00-18:00)**
```bash
# 4. 创建目录结构
mkdir -p components/ui components/product components/sections
mkdir -p app/country/[code] app/regional/[slug] app/global
mkdir -p lib types

# 5. 开发Button组件
# 文件: components/ui/Button.tsx
# 功能: Primary/Secondary/Outline/Ghost变体
# 状态: Default/Hover/Active/Loading/Disabled

# 6. 开发工具函数
# 文件: lib/utils.ts
# 功能: cn()合并类名, formatPrice(), formatDataSize()
```

**交付物**:
- GitHub仓库链接
- 项目初始化完成
- Button组件可用

---

## 🤖 AI团队成员 #3: 后端开发

### 角色定位
- **名称**: Backend-Dev-AI
- **职责**: API开发、数据清理、性能优化
- **优先级**: P0（立即执行）

### 今天任务（Day 1 - 3/14）

**上午 (9:00-12:00)**
```javascript
// 1. 产品数据清理脚本
// 文件: scripts/clean-products.js

const fs = require('fs');

// 读取原始数据
const products = JSON.parse(
  fs.readFileSync('data/products-full.json', 'utf8')
).products;

// 54款亏损产品ID列表
const lossProductIds = [2594, 1927, 2498, 1928, /* ... */];

// 65款重复产品ID列表（高成本版）
const duplicateProductIds = [/* ... */];

// 清理
const cleanedProducts = products.filter(p => 
  !lossProductIds.includes(p.id) && 
  !duplicateProductIds.includes(p.id)
);

// 保存
fs.writeFileSync(
  'data/cleaned-products.json',
  JSON.stringify({ products: cleanedProducts }, null, 2)
);

console.log(`清理完成: ${products.length} -> ${cleanedProducts.length}款`);
```

**下午 (14:00-18:00)**
```javascript
// 2. 搭建API框架
// 文件: api/server.js

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 加载清理后的数据
const products = require('../data/cleaned-products.json').products;

// GET /api/products
app.get('/api/products', (req, res) => {
  const { country, type, min_price, max_price, sort, page = 1, limit = 20 } = req.query;
  
  let result = products;
  
  // 按国家筛选
  if (country) {
    result = result.filter(p => 
      p.countries?.some(c => c.code.toLowerCase() === country.toLowerCase())
    );
  }
  
  // 按类型筛选
  if (type) {
    result = result.filter(p => p.type === type);
  }
  
  // 分页
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);
  
  res.json({
    success: true,
    data: {
      products: paginated,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.length,
        totalPages: Math.ceil(result.length / limit)
      }
    }
  });
});

// 启动
app.listen(3001, () => {
  console.log('API服务器运行在 http://localhost:3001');
});
```

**交付物**:
- cleaned-products.json (2,601款)
- API服务器运行
- /api/products 接口可用

---

## 🤖 AI团队成员 #4: 产品经理

### 角色定位
- **名称**: Product-Manager-AI
- **职责**: 项目管理、进度跟踪、资源协调
- **优先级**: P0（立即执行）

### 今天任务（Day 1 - 3/14）

**上午 (9:00-12:00)**
```
□ 1. 创建项目管理看板
   - 工具: GitHub Issues / Notion / 飞书项目
   - 导入15个GitHub Issues
   - 设置标签: P0/P1/P2, frontend/backend/ui

□ 2. 设置优先级
   P0 (本周必须):
   - #1 产品数据清理
   - #2 项目初始化
   - #3 Button组件
   - #4 ProductCard组件
   - #5 首页Hero
   - #6 首页产品展示
   - #7 国家页路由
   - #8 国家页产品列表
   - #13 API产品列表接口

□ 3. 安排站会
   - 时间: 每天 10:00-10:15
   - 参与: UI + 前端 + 后端 + PM
   - 形式: 线上/线下
```

**下午 (14:00-18:00)**
```
□ 4. 创建进度看板
   列: 待办 | 进行中 | 审核中 | 已完成
   
   今日放入"进行中":
   - UI: 设计系统
   - 前端: 项目初始化
   - 后端: 数据清理

□ 5. 设置里程碑
   - Week 1 (3/20): 首页上线
   - Week 2 (3/27): 国家/区域/全球页上线
   - Week 3 (4/3): 搜索/账户/多语言上线
   - Week 4 (4/11): 正式上线

□ 6. 风险预警
   - 设计进度风险: 中
   - 技术难点风险: 低
   - 人员风险: 低
```

**交付物**:
- 项目管理看板链接
- 15个Issues已导入
- 站会安排通知

---

## 🤖 AI团队成员 #5: 销售与客服

### 角色定位
- **名称**: Sales-Support-AI
- **职责**: 销售准备、客服培训、客户支持
- **优先级**: P1（本周执行）

### 今天任务（Day 1 - 3/14）

**上午 (9:00-12:00)**
```
□ 1. 熟悉产品架构
   读取: reports/simryoko-complete-design-spec-v2.md
   
   关键数据记忆:
   - 总产品: 2,720款
   - 国家套餐: 2,552款 (93.8%)
   - 区域套餐: 134款 (4.9%)
   - 全球套餐: 34款 (1.2%)
   - 覆盖国家: 214个
   - 价格范围: $0.60 - $185.00

□ 2. 掌握亏损产品清单
   读取: reports/loss-products-report.json
   
   54款亏损产品ID:
   - 2594: 津巴布韦 1GB/7天 (-55.4%)
   - 1927: 黎巴嫩 1GB/7天 (-53.6%)
   - 2498: 多哥 1GB/7天 (-48.5%)
   - 1928: 利比里亚 1GB/7天 (-32.0%)
   - ... (共54款)
   
   ⚠️ 这些产品销售会导致亏损，需避免推荐
```

**下午 (14:00-18:00)**
```
□ 3. 掌握高利润产品清单
   读取: data/products-full.json
   
   筛选条件:
   - 利润率 > 50%
   - 销量 > 100
   
   重点推荐产品:
   - 日本 1GB/7天: $4.00 (热销#1)
   - 亚洲 500MB/3天: $1.53 (最低价)
   - 韩国 1GB/7天: $4.00 (热销#2)
   - 全球+语音: $15.00 (唯一差异化)

□ 4. 准备竞品对比话术
   读取: reports/airalo-deep-analysis-for-team.md
   
   核心话术:
   - "比Airalo便宜30-70%"
   - "亚洲最低价$1.53起"
   - "全球唯一语音短信eSIM"
   - "覆盖214国，2,720款产品"
```

**交付物**:
- 产品知识库
- 54款亏损产品清单
- 销售话术文档

---

## 📋 团队协作机制

### 每日站会 (10:00-10:15)

```
参与: 5个AI成员
形式: 文字/语音汇报

发言顺序:
1. UI-Designer-AI (2分钟)
2. Frontend-Dev-AI (2分钟)
3. Backend-Dev-AI (2分钟)
4. Sales-Support-AI (2分钟)
5. Product-Manager-AI (2分钟)

内容:
- 昨天完成
- 今天计划
- 阻塞问题
```

### 协作工具

| 工具 | 用途 | 链接 |
|------|------|------|
| Figma | 设计协作 | [待创建] |
| GitHub | 代码管理 | [待创建] |
| Vercel | 前端部署 | [待创建] |
| VPS | 后端API | 45.76.156.170 |
| 飞书/钉钉 | 沟通 | [待创建] |

### 文档共享

```
esim-shop/
├── design/          # UI-Designer-AI 工作区
├── dev/             # Frontend-Dev-AI + Backend-Dev-AI 工作区
├── api/             # Backend-Dev-AI 工作区
├── management/      # Product-Manager-AI 工作区
├── reports/         # Sales-Support-AI 工作区
└── team/            # 协作文档
```

---

## 🎯 本周里程碑

| 日期 | 里程碑 | 负责AI |
|------|--------|--------|
| 3/14 | 项目启动 | 全员 |
| 3/15 | 设计系统完成 | UI-Designer-AI |
| 3/16 | 首页设计完成 | UI-Designer-AI |
| 3/17 | 首页开发完成 | Frontend-Dev-AI |
| 3/18 | 设计评审 | Product-Manager-AI |
| 3/20 | **首页上线** | 全员 |

---

## ⚡ 立即执行检查清单

### UI-Designer-AI
- [ ] Figma文件已创建
- [ ] 色彩系统已设置
- [ ] 字体系统已设置
- [ ] Button组件已创建

### Frontend-Dev-AI
- [ ] Next.js项目已初始化
- [ ] Tailwind已配置
- [ ] 依赖已安装
- [ ] Button组件已开发

### Backend-Dev-AI
- [ ] 数据清理脚本已运行
- [ ] cleaned-products.json已生成
- [ ] API服务器已启动
- [ ] /api/products 接口已测试

### Product-Manager-AI
- [ ] GitHub Issues已导入
- [ ] 优先级已设置
- [ ] 站会时间已安排
- [ ] 看板已创建

### Sales-Support-AI
- [ ] 产品架构已熟悉
- [ ] 54款亏损产品已标记
- [ ] 高利润产品已筛选
- [ ] 销售话术已准备

---

**5个AI团队成员任务分配完成！**
**每个AI可按此清单立即开始执行**
**预计今日完成项目启动和基础搭建**
