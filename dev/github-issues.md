# GitHub Issues 任务清单

**项目**: SimRyoko Web v2.0  
**里程碑**: 4周上线  
**生成日期**: 2026-03-14

---

## Issue #1: [P0] 产品数据清理

**标题**: [Backend] 清理亏损和重复产品数据

**描述**:
基于产品分析报告，需要清理以下产品：
- 54款亏损产品（零售价<成本价）
- 65款高成本重复产品

**任务清单**:
- [ ] 读取 `reports/loss-products-report.json`
- [ ] 读取 `reports/duplicate-products-report.json`
- [ ] 生成清理后的 `cleaned-products.json`
- [ ] 备份原始数据
- [ ] 更新产品缓存

**数据文件**:
```
输入:
- data/products-full.json (2,720款)
- reports/loss-products-report.json (54亏损)
- reports/duplicate-products-report.json (65重复)

输出:
- data/cleaned-products.json (2,601款)
- data/removed-products-backup.json (119款)
```

**验收标准**:
- [ ] 清理后产品数 = 2,601款
- [ ] 所有亏损产品已移除
- [ ] 高成本重复产品已移除
- [ ] 保留低成本版本

**标签**: `backend`, `data`, `P0`  
**负责人**: @backend-dev  
**工时**: 4h  
**截止日期**: Day 2

---

## Issue #2: [P0] 项目初始化与配置

**标题**: [Frontend] 初始化Next.js项目并配置Tailwind

**描述**:
创建SimRyoko Web项目，配置设计系统

**任务清单**:
- [ ] 创建Next.js项目 (TypeScript + Tailwind)
- [ ] 安装依赖 (framer-motion, lucide-react, etc.)
- [ ] 配置Tailwind (颜色/字体/间距)
- [ ] 创建目录结构
- [ ] 配置路径别名

**配置文件**:
```
- tailwind.config.ts (品牌色/字体)
- next.config.js (i18n/rewrites)
- tsconfig.json
```

**验收标准**:
- [ ] `npm run dev` 正常启动
- [ ] 首页显示正常
- [ ] Tailwind样式生效

**标签**: `frontend`, `setup`, `P0`  
**负责人**: @frontend-dev  
**工时**: 4h  
**截止日期**: Day 1

---

## Issue #3: [P0] Button组件开发

**标题**: [Frontend] 开发Button组件

**描述**:
开发可复用的Button组件，支持多种变体

**变体**:
- Primary (品牌橙)
- Secondary (品牌蓝)
- Outline (边框)
- Ghost (透明)

**状态**:
- Default
- Hover
- Active
- Loading
- Disabled

**尺寸**:
- sm (小)
- md (中)
- lg (大)

**代码示例**:
```tsx
<Button variant="primary" size="md">
  立即购买
</Button>

<Button variant="primary" isLoading>
  加载中...
</Button>
```

**验收标准**:
- [ ] 所有变体正常显示
- [ ] 悬停效果正常
- [ ] 加载状态正常
- [ ] 禁用状态正常

**标签**: `frontend`, `component`, `P0`  
**负责人**: @frontend-dev  
**工时**: 4h  
**截止日期**: Day 2

---

## Issue #4: [P0] ProductCard组件开发

**标题**: [Frontend] 开发ProductCard组件

**描述**:
开发产品卡片组件，融入库存/销量数据

**功能**:
- [ ] 显示国旗+国家名
- [ ] 显示价格+原价对比
- [ ] 显示节省百分比
- [ ] 显示流量/有效期
- [ ] 显示库存状态
- [ ] 显示销量
- [ ] 立即购买按钮
- [ ] 悬停效果

**变体**:
- Default (标准)
- Hot (热销标签)
- Voice (语音标签)
- Recommend (推荐标签)

**代码示例**:
```tsx
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
/>
```

**验收标准**:
- [ ] 所有字段正确显示
- [ ] 价格对比正确计算
- [ ] 库存状态正确显示
- [ ] 悬停效果正常

**标签**: `frontend`, `component`, `P0`  
**负责人**: @frontend-dev  
**工时**: 8h  
**截止日期**: Day 3

---

## Issue #5: [P0] 首页Hero区块开发

**标题**: [Frontend] 开发首页Hero区块

**描述**:
开发首页Hero区域，包含搜索功能

**内容**:
- [ ] 主标题 "全球eSIM，一站购齐"
- [ ] 副标题 "2,720款产品，214国覆盖，$1.53起"
- [ ] 搜索框（大）
- [ ] 热门搜索快捷入口
- [ ] CTA按钮
- [ ] 背景渐变

**交互**:
- [ ] 搜索框聚焦效果
- [ ] 热门搜索点击跳转
- [ ] 响应式适配

**验收标准**:
- [ ] 视觉效果符合设计稿
- [ ] 搜索功能正常
- [ ] 响应式正常

**标签**: `frontend`, `page`, `P0`  
**负责人**: @frontend-dev  
**工时**: 6h  
**截止日期**: Day 4

---

## Issue #6: [P0] 首页产品展示区块

**标题**: [Frontend] 开发首页产品展示区块

**描述**:
开发首页热门产品展示区域

**内容**:
- [ ] 区块标题 "热门产品"
- [ ] 6款产品卡片网格
- [ ] 产品数据来源API

**精选产品** (6款):
1. 日本 1GB/7天 - $4.00
2. 亚洲 500MB/3天 - $1.53
3. 韩国 1GB/7天 - $4.00
4. 欧洲 10GB/30天 - $28.00
5. 全球 3GB/30天+语音 - $36.00
6. 美国 3GB/30天 - $8.00

**验收标准**:
- [ ] 6款产品正确显示
- [ ] 卡片布局整齐
- [ ] 点击跳转产品页

**标签**: `frontend`, `page`, `P0`  
**负责人**: @frontend-dev  
**工时**: 6h  
**截止日期**: Day 5

---

## Issue #7: [P0] 国家页路由与基础结构

**标题**: [Frontend] 创建国家页路由和基础结构

**描述**:
创建 `/country/[code]` 动态路由

**任务**:
- [ ] 创建路由文件
- [ ] 获取国家代码参数
- [ ] 根据code获取产品数据
- [ ] 404处理（无效国家）
- [ ] 基础页面结构

**路由**:
```
/country/jp -> 日本
/country/kr -> 韩国
/country/us -> 美国
... (214个国家)
```

**验收标准**:
- [ ] 所有有效国家可访问
- [ ] 无效国家返回404
- [ ] 产品数据正确加载

**标签**: `frontend`, `page`, `P0`  
**负责人**: @frontend-dev  
**工时**: 8h  
**截止日期**: Day 6

---

## Issue #8: [P0] 国家页产品列表

**标题**: [Frontend] 开发国家页产品列表

**描述**:
在国家页展示该国家的所有产品

**功能**:
- [ ] 国家Header（国旗+名称+产品数）
- [ ] 产品网格（3列）
- [ ] 分页或无限滚动
- [ ] 空状态处理

**数据**:
- 日本: 38款产品
- 美国: 38款产品
- 韩国: 24款产品
- ...

**验收标准**:
- [ ] 产品正确显示
- [ ] 网格布局整齐
- [ ] 分页正常

**标签**: `frontend`, `page`, `P0`  
**负责人**: @frontend-dev  
**工时**: 8h  
**截止日期**: Day 7

---

## Issue #9: [P1] 区域页开发

**标题**: [Frontend] 开发区域页 (/regional/[slug])

**描述**:
创建7大区域页面

**区域**:
- /regional/asia (亚洲28款)
- /regional/europe (欧洲34款)
- /regional/north-america (北美20款)
- /regional/oceania (大洋洲16款)
- /regional/africa (非洲16款)
- /regional/middle-east (中东11款)
- /regional/south-america (南美9款)

**内容**:
- [ ] 区域Header
- [ ] 覆盖国家列表
- [ ] 产品网格
- [ ] 特色产品推荐

**验收标准**:
- [ ] 7个区域页可访问
- [ ] 产品正确筛选
- [ ] 响应式正常

**标签**: `frontend`, `page`, `P1`  
**负责人**: @frontend-dev  
**工时**: 12h  
**截止日期**: Day 10

---

## Issue #10: [P1] 全球语音专区开发

**标题**: [Frontend] 开发全球语音专区 (/global)

**描述**:
创建全球Discover+语音专区页面

**内容**:
- [ ] 页面Header（强调唯一性）
- [ ] 功能对比表（vs Airalo）
- [ ] 34款产品展示
- [ ] 语音功能说明
- [ ] 适用场景介绍

**特色**:
- 唯一支持语音短信的eSIM
- 34款产品
- $15起

**验收标准**:
- [ ] 页面可访问
- [ ] 对比表正确显示
- [ ] 产品正确展示

**标签**: `frontend`, `page`, `P1`  
**负责人**: @frontend-dev  
**工时**: 8h  
**截止日期**: Day 11

---

## Issue #11: [P1] 产品筛选功能

**标题**: [Frontend] 开发产品筛选组件

**描述**:
开发多维度产品筛选器

**筛选维度**:
- 流量: 500MB/1GB/3GB/5GB/10GB/无限
- 有效期: 3天/7天/15天/30天
- 价格: $0-5/$5-10/$10-20/$20-50/$50+
- 特色: 热销/推荐/语音

**交互**:
- [ ] 多选支持
- [ ] 即时过滤
- [ ] 清除筛选
- [ ] 筛选结果计数

**验收标准**:
- [ ] 筛选功能正常
- [ ] 结果正确过滤
- [ ] URL参数同步

**标签**: `frontend`, `feature`, `P1`  
**负责人**: @frontend-dev  
**工时**: 8h  
**截止日期**: Day 12

---

## Issue #12: [P1] 搜索页开发

**标题**: [Frontend] 开发搜索页 (/search)

**描述**:
创建搜索结果页面

**功能**:
- [ ] 搜索框（大）
- [ ] 搜索结果列表
- [ ] 筛选器
- [ ] 排序选项
- [ ] 无结果状态
- [ ] 热门搜索

**排序**:
- 推荐
- 价格从低到高
- 价格从高到低
- 流量
- 有效期

**验收标准**:
- [ ] 搜索功能正常
- [ ] 结果正确显示
- [ ] 筛选排序正常

**标签**: `frontend`, `page`, `P1`  
**负责人**: @frontend-dev  
**工时**: 10h  
**截止日期**: Day 14

---

## Issue #13: [Backend] API - 产品列表接口

**标题**: [Backend] 开发产品列表API

**描述**:
提供产品查询接口

**接口**:
```
GET /api/products
GET /api/products?country={code}
GET /api/products?type={type}
GET /api/products?min_price={n}&max_price={n}
GET /api/products?data_size={size}
GET /api/products?valid_days={days}
GET /api/products?sort={field}_{order}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

**验收标准**:
- [ ] 所有筛选参数支持
- [ ] 分页正常
- [ ] 排序正常
- [ ] 性能 < 200ms

**标签**: `backend`, `api`, `P0`  
**负责人**: @backend-dev  
**工时**: 8h  
**截止日期**: Day 7

---

## Issue #14: [P2] 多语言实现

**标题**: [Frontend] 实现多语言支持

**描述**:
添加i18n多语言支持

**语言**:
- 中文 (zh-CN) - 默认
- 英文 (en)
- 日文 (ja)
- 韩文 (ko)

**范围**:
- [ ] 首页
- [ ] 产品页
- [ ] 结账页
- [ ] 语言切换组件

**验收标准**:
- [ ] 4种语言可切换
- [ ] 翻译完整
- [ ] URL正确

**标签**: `frontend`, `feature`, `P2`  
**负责人**: @frontend-dev  
**工时**: 16h  
**截止日期**: Day 18

---

## Issue #15: [P2] SEO优化

**标题**: [Frontend] SEO优化

**描述**:
添加SEO相关配置

**任务**:
- [ ] next-seo配置
- [ ] 动态Meta标签
- [ ] 结构化数据 (Schema.org)
- [ ] Sitemap生成
- [ ] robots.txt

**验收标准**:
- [ ] Lighthouse SEO > 90
- [ ] 结构化数据验证通过
- [ ] Sitemap正确生成

**标签**: `frontend`, `seo`, `P2`  
**负责人**: @frontend-dev  
**工时**: 8h  
**截止日期**: Day 20

---

## 里程碑

| 里程碑 | 日期 | 包含Issues |
|--------|------|-----------|
| Week 1 | Day 7 | #1-#8, #13 |
| Week 2 | Day 14 | #9-#12 |
| Week 3 | Day 21 | #14 |
| Week 4 | Day 28 | #15, 测试上线 |

---

**Issues生成完成**  
**总数**: 15个  
**P0**: 8个  
**P1**: 4个  
**P2**: 3个
