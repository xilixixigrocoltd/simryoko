# Figma 设计系统模板 v1.0

**用途**: 直接复制到Figma创建设计系统  
**版本**: v1.0  
**创建时间**: 10分钟

---

## 第一步：创建Figma文件

### 1.1 新建文件
```
1. 打开 Figma (figma.com)
2. 点击 "New Design File"
3. 命名: "SimKaze-Design-System-v2.0"
4. 创建5个Page:
   - 🎨 Design System
   - 📱 Home
   - 🌍 Country/Regional/Global
   - 🔍 Search/Account
   - 🖼️ Assets
```

---

## 第二步：Design System Page 结构

### 2.1 创建Frame结构

在 "🎨 Design System" Page 中创建以下Frame:

```
┌─────────────────────────────────────────────────────────────┐
│ SimKaze Design System v2.0                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🌈 Colors                                           │   │
│  │ Frame: 1200×800                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔤 Typography                                       │   │
│  │ Frame: 1200×600                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🧩 Components                                       │   │
│  │ Frame: 1400×1200                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📐 Spacing & Layout                                 │   │
│  │ Frame: 1200×400                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🎯 Icons                                            │   │
│  │ Frame: 1200×600                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 第三步：Colors 详细规格

### 3.1 创建Color Styles

在右侧 "Styles" 面板，点击 "+" 创建:

#### 品牌色 (Primary)
```
名称: Primary/500
色值: #FF6B35
用途: 主按钮、价格、CTA

名称: Primary/600
色值: #E55A2B
用途: 悬停状态

名称: Primary/100
色值: #FFF5F0
用途: 浅色背景
```

#### 辅助色 (Secondary)
```
名称: Secondary/500
色值: #1E3A5F
用途: 标题、专业感

名称: Secondary/100
色值: #E8F4F8
用途: 浅蓝背景
```

#### 功能色 (Functional)
```
名称: Success/500
色值: #10B981
用途: 成功、库存充足

名称: Success/100
色值: #D1FAE5
用途: 成功背景

名称: Warning/500
色值: #F59E0B
用途: 警告、库存紧张

名称: Warning/100
色值: #FEF3C7
用途: 警告背景

名称: Error/500
色值: #EF4444
用途: 错误、缺货

名称: Error/100
色值: #FEE2E2
用途: 错误背景

名称: Info/500
色值: #3B82F6
用途: 信息、链接

名称: Info/100
色值: #DBEAFE
用途: 信息背景
```

#### 中性色 (Neutral)
```
名称: Neutral/900
色值: #111827
用途: 标题文字

名称: Neutral/700
色值: #374151
用途: 正文文字

名称: Neutral/500
色值: #6B7280
用途: 次要文字

名称: Neutral/300
色值: #D1D5DB
用途: 禁用边框

名称: Neutral/200
色值: #E5E7EB
用途: 边框

名称: Neutral/100
色值: #F3F4F6
用途: 浅背景

名称: Neutral/50
色值: #F9FAFB
用途: 页面背景
```

### 3.2 Colors Frame 布局

```
Frame: Colors (1200×800)
│
├── 标题: "🌈 Colors" (24px Bold)
│
├── 品牌色区域
│   ├── 标签: "Primary Brand Colors"
│   └── 色块: 3个 (500/600/100)
│
├── 辅助色区域
│   ├── 标签: "Secondary Colors"
│   └── 色块: 2个 (500/100)
│
├── 功能色区域
│   ├── 标签: "Functional Colors"
│   └── 色块: 8个 (Success/Warning/Error/Info × 2)
│
└── 中性色区域
    ├── 标签: "Neutral Colors"
    └── 色块: 7个 (900/700/500/300/200/100/50)
```

**色块规格:**
- 尺寸: 80×80px
- 圆角: 8px
- 下方标注: 颜色名称 + 色值
- 间距: 16px

---

## 第四步：Typography 详细规格

### 4.1 创建Text Styles

在右侧 "Styles" 面板，点击 "+" 创建:

```
名称: Hero/56
字体: Inter
字号: 56px
字重: Bold (700)
行高: 62px
用途: 首页大标题

名称: H1/40
字体: Inter
字号: 40px
字重: Bold (700)
行高: 48px
用途: 页面标题

名称: H2/32
字体: Inter
字号: 32px
字重: SemiBold (600)
行高: 40px
用途: 区块标题

名称: H3/24
字体: Inter
字号: 24px
字重: SemiBold (600)
行高: 32px
用途: 卡片标题

名称: H4/20
字体: Inter
字号: 20px
字重: Medium (500)
行高: 28px
用途: 小标题

名称: Body-Large/18
字体: Inter
字号: 18px
字重: Regular (400)
行高: 28px
用途: 重要正文

名称: Body/16
字体: Inter
字号: 16px
字重: Regular (400)
行高: 24px
用途: 默认正文

名称: Body-Small/14
字体: Inter
字号: 14px
字重: Regular (400)
行高: 20px
用途: 辅助文字

名称: Caption/12
字体: Inter
字号: 12px
字重: Regular (400)
行高: 16px
用途: 标签、备注
```

### 4.2 Typography Frame 布局

```
Frame: Typography (1200×600)
│
├── 标题: "🔤 Typography" (24px Bold)
│
├── Hero/56 示例
│   └── "全球eSIM，一站购齐" (56px Bold)
│
├── H1/40 示例
│   └── "日本eSIM套餐" (40px Bold)
│
├── H2/32 示例
│   └── "热门产品" (32px SemiBold)
│
├── H3/24 示例
│   └── "Moshi Moshi" (24px SemiBold)
│
├── Body-Large/18 示例
│   └── "覆盖214国，即买即用..." (18px)
│
├── Body/16 示例
│   └── "默认正文文字..." (16px)
│
└── Body-Small/14 示例
    └── "辅助说明文字..." (14px)
```

---

## 第五步：Components 详细规格

### 5.1 Button 组件

创建3个变体:

#### Primary Button
```
Frame: Button/Primary
尺寸: Auto (高度48px, 内边距 12px 24px)
背景: #FF6B35 (Primary/500)
文字: "立即购买" (16px Medium, 白色)
圆角: 8px

变体:
├── Default (默认状态)
├── Hover (悬停: 背景#E55A2B)
├── Active (点击: Scale 0.95)
├── Loading (加载: Spinner)
└── Disabled (禁用: 背景#FED7CC)
```

#### Secondary Button
```
Frame: Button/Secondary
尺寸: Auto (高度48px, 内边距 12px 24px)
背景: 透明
边框: 2px solid #1E3A5F
文字: "了解更多" (16px Medium, #1E3A5F)
圆角: 8px

变体: Default / Hover / Active / Disabled
```

#### Icon Button
```
Frame: Button/Icon
尺寸: 40×40px
背景: #F3F4F6
图标: Search (20px, 灰色)
圆角: 8px
```

### 5.2 Product Card 组件

```
Frame: ProductCard/Default
尺寸: 360×420px
背景: 白色
圆角: 16px
阴影: 0 4px 6px rgba(0,0,0,0.1)
内边距: 24px

内容:
├── 头部
│   ├── 国旗 Emoji (🇯🇵, 24px)
│   └── 国家名 "日本" (18px Bold)
│
├── 运营商 "Moshi Moshi" (14px 灰色)
│
├── 价格区域
│   ├── "$4.00" (32px Bold, 品牌橙)
│   ├── "~~$8.00~~" (16px, 灰色, 删除线)
│   └── "省50%" (14px, 绿色)
│
├── 规格
│   ├── "📶 1GB / 7天" (14px)
│   └── "🌐 覆盖日本全国" (14px)
│
├── 状态
│   └── "🟢 库存充足" (14px, 绿色)
│
└── 按钮
    └── [立即购买] (Primary Button)

变体:
├── Default (标准)
├── Hover (悬停: 上移4px, 阴影增强)
├── Voice (语音版: 顶部紫色标签)
└── Hot (热销版: 顶部红色标签)
```

### 5.3 Input 组件

#### Text Input
```
Frame: Input/Text
尺寸: 宽度100%, 高度48px
背景: 白色
边框: 1px solid #E5E7EB
圆角: 8px
内边距: 0 16px
占位符: "请输入..." (16px, 灰色)

变体:
├── Default
├── Focus (边框: 2px solid #FF6B35)
├── Error (边框: 2px solid #EF4444)
└── Success (边框: 2px solid #10B981)
```

#### Search Input
```
Frame: Input/Search
尺寸: 宽度100%, 高度64px
背景: 白色
边框: 2px solid #E5E7EB
圆角: 32px (胶囊)
内边距: 0 24px 0 56px
图标: Search (24px, 左侧24px)
占位符: "搜索国家或地区..." (18px)
```

### 5.4 Tag 组件

```
Frame: Tag/Status
尺寸: Auto (高度28px, 内边距 6px 12px)
背景: 根据状态
文字: 14px Medium
圆角: 4px

变体:
├── Hot (背景#FF6B35, 文字白色)
├── New (背景#10B981, 文字白色)
├── Recommend (背景#3B82F6, 文字白色)
├── Voice (背景#8B5CF6, 文字白色)
└── Save (背景#10B981/10%, 文字#10B981)
```

### 5.5 Components Frame 布局

```
Frame: Components (1400×1200)
│
├── 标题: "🧩 Components" (24px Bold)
│
├── Buttons
│   ├── Primary (Default/Hover/Active/Disabled)
│   ├── Secondary (Default/Hover/Active/Disabled)
│   └── Icon (Default/Hover)
│
├── ProductCards
│   ├── Standard
│   ├── Voice Variant
│   └── Hot Variant
│
├── Inputs
│   ├── Text Input
│   ├── Search Input
│   └── Select
│
└── Tags
    ├── Hot / New / Recommend / Voice / Save
```

---

## 第六步：Spacing & Layout

### 6.1 Spacing Scale

```
Frame: Spacing (1200×400)
│
├── 标题: "📐 Spacing Scale" (24px Bold)
│
├── 间距示例:
│   ├── 4px (xs) ─────── 小标签间距
│   ├── 8px (sm) ─────── 组件内部间距
│   ├── 16px (md) ────── 卡片内边距
│   ├── 24px (lg) ────── 卡片间距
│   ├── 32px (xl) ────── 区块间距
│   ├── 48px (2xl) ───── 大区块间距
│   └── 64px (3xl) ───── 页面间距
│
└── 网格系统: 12列, 间距24px
```

### 6.2 Grid System

```
桌面端: 12列, 列宽自适应, 间距24px
平板端: 8列, 间距16px
手机端: 4列, 间距12px
```

---

## 第七步：Icons

### 7.1 必需图标清单

```
Frame: Icons (1200×600)
│
├── 标题: "🎯 Icons" (24px Bold)
│
├── 导航图标 (24px)
│   ├── Search (搜索)
│   ├── Cart (购物车)
│   ├── User (用户)
│   ├── Menu (菜单)
│   └── Close (关闭)
│
├── 功能图标 (24px)
│   ├── Check (勾选)
│   ├── ChevronDown (下拉)
│   ├── ChevronRight (箭头)
│   ├── Filter (筛选)
│   └── Sort (排序)
│
├── 产品图标 (24px)
│   ├── Signal (信号)
│   ├── Wifi (网络)
│   ├── Phone (电话)
│   ├── Message (短信)
│   └── Globe (全球)
│
└── 状态图标 (24px)
    ├── CheckCircle (成功)
    ├── AlertCircle (警告)
    ├── XCircle (错误)
    ├── Info (信息)
    └── Loader (加载)
```

### 7.2 图标来源

推荐使用:
- **Lucide Icons** (与代码一致)
- **Heroicons** (备选)
- 导入Figma插件: "Iconify" 或 "Lucide Icons"

---

## 第八步：使用说明

### 8.1 设计师使用

```
1. 按此模板创建Figma文件
2. 创建所有Color Styles
3. 创建所有Text Styles
4. 创建Component变体
5. 开始设计页面
6. 使用Styles保持一致性
```

### 8.2 与开发协作

```
1. 分享Figma链接给开发
2. 开发使用Figma Dev Mode查看标注
3. 导出图标为SVG
4. 导出图片为PNG/WebP
5. 标注特殊交互说明
```

### 8.3 维护更新

```
版本管理:
├── v1.0: 初始设计系统
├── v1.1: 新增组件
└── v2.0: 重大更新

变更记录:
- 日期 + 变更内容 + 负责人
- 通知开发团队更新
```

---

## 快速检查清单

创建完成后检查:

- [ ] 5个Page已创建
- [ ] Color Styles 20+个
- [ ] Text Styles 9个
- [ ] Button 组件 3种变体
- [ ] ProductCard 组件 3种变体
- [ ] Input 组件 2种
- [ ] Tag 组件 5种
- [ ] Icons 20+个
- [ ] Figma链接已分享

---

**模板完成**  
**预计创建时间**: 30-60分钟  
**下一步**: 开始设计首页
