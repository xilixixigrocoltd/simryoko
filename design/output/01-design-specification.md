# SimKaze Design System v2.0 — 完整设计规范

> 生成时间: 2026-03-15  
> 基于 figma-design-system-template.md

---

## 1. 色彩系统 (Colors)

### 品牌色 Primary
| Token | Hex | 用途 |
|-------|-----|------|
| primary-500 | #FF6B35 | 主按钮、价格、CTA |
| primary-600 | #E55A2B | 悬停状态 |
| primary-100 | #FFF5F0 | 浅色背景 |

### 辅助色 Secondary
| Token | Hex | 用途 |
|-------|-----|------|
| secondary-500 | #1E3A5F | 标题、专业感 |
| secondary-100 | #E8F4F8 | 浅蓝背景 |

### 功能色 Functional
| Token | Hex | 用途 |
|-------|-----|------|
| success-500 | #10B981 | 成功、库存充足 |
| success-100 | #D1FAE5 | 成功背景 |
| warning-500 | #F59E0B | 警告、库存紧张 |
| warning-100 | #FEF3C7 | 警告背景 |
| error-500 | #EF4444 | 错误、缺货 |
| error-100 | #FEE2E2 | 错误背景 |
| info-500 | #3B82F6 | 信息、链接 |
| info-100 | #DBEAFE | 信息背景 |

### 中性色 Neutral
| Token | Hex | 用途 |
|-------|-----|------|
| neutral-900 | #111827 | 标题文字 |
| neutral-700 | #374151 | 正文文字 |
| neutral-500 | #6B7280 | 次要文字 |
| neutral-300 | #D1D5DB | 禁用边框 |
| neutral-200 | #E5E7EB | 边框 |
| neutral-100 | #F3F4F6 | 浅背景 |
| neutral-50 | #F9FAFB | 页面背景 |

---

## 2. 字体系统 (Typography)

**字体族:** Inter (Google Fonts)  
**备选:** system-ui, -apple-system, sans-serif

| Token | 字号 | 字重 | 行高 | 用途 |
|-------|------|------|------|------|
| hero | 56px | 700 | 62px | 首页大标题 |
| h1 | 40px | 700 | 48px | 页面标题 |
| h2 | 32px | 600 | 40px | 区块标题 |
| h3 | 24px | 600 | 32px | 卡片标题 |
| h4 | 20px | 500 | 28px | 小标题 |
| body-lg | 18px | 400 | 28px | 重要正文 |
| body | 16px | 400 | 24px | 默认正文 |
| body-sm | 14px | 400 | 20px | 辅助文字 |
| caption | 12px | 400 | 16px | 标签、备注 |

---

## 3. 间距系统 (Spacing)

| Token | 值 | 用途 |
|-------|-----|------|
| xs | 4px | 小标签间距 |
| sm | 8px | 组件内部间距 |
| md | 16px | 卡片内边距 |
| lg | 24px | 卡片间距 |
| xl | 32px | 区块间距 |
| 2xl | 48px | 大区块间距 |
| 3xl | 64px | 页面间距 |

### 网格
- 桌面: 12列, gap 24px, max-width 1280px
- 平板: 8列, gap 16px
- 手机: 4列, gap 12px

---

## 4. 圆角 (Border Radius)

| Token | 值 | 用途 |
|-------|-----|------|
| sm | 4px | Tag |
| md | 8px | Button, Input |
| lg | 16px | Card |
| full | 9999px | 胶囊搜索框、头像 |

---

## 5. 阴影 (Shadows)

| Token | 值 | 用途 |
|-------|-----|------|
| sm | 0 1px 2px rgba(0,0,0,0.05) | 微弱阴影 |
| md | 0 4px 6px rgba(0,0,0,0.1) | 卡片默认 |
| lg | 0 10px 15px rgba(0,0,0,0.1) | 卡片悬停 |
| xl | 0 20px 25px rgba(0,0,0,0.1) | 模态框 |

---

## 6. 组件规范

### Button
- 高度: 48px
- 内边距: 12px 24px
- 圆角: 8px
- 字号: 16px Medium
- 过渡: all 0.2s ease

### Product Card
- 宽度: 360px (网格自适应)
- 高度: auto (~420px)
- 圆角: 16px
- 阴影: md → hover时lg
- 内边距: 24px

### Input
- 高度: 48px (搜索框64px)
- 圆角: 8px (搜索框32px)
- 边框: 1px solid neutral-200
- Focus: 2px solid primary-500

### Tag
- 高度: 28px
- 内边距: 6px 12px
- 圆角: 4px
- 字号: 14px Medium
