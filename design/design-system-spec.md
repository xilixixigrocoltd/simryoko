# SimRyoko Design System Specification v2.0

**Generated**: 2026-03-14  
**Status**: Production Ready

---

## 1. 色彩系统 (Color System)

### 1.1 品牌色 (Primary)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-500` | `#FF6B35` | 主按钮、CTA、价格高亮 |
| `primary-600` | `#E55A2B` | Hover状态 |
| `primary-100` | `#FFF5F0` | 浅色背景 |

### 1.2 辅助色 (Secondary)
| Token | Hex | Usage |
|-------|-----|-------|
| `secondary-500` | `#1E3A5F` | 标题、专业感 |
| `secondary-100` | `#E8F4F8` | 浅蓝背景 |

### 1.3 功能色 (Functional)
| Token | Hex | Usage |
|-------|-----|-------|
| `success-500` | `#10B981` | 成功、库存充足 |
| `success-100` | `#D1FAE5` | 成功背景 |
| `warning-500` | `#F59E0B` | 警告、库存紧张 |
| `warning-100` | `#FEF3C7` | 警告背景 |
| `error-500` | `#EF4444` | 错误、缺货 |
| `error-100` | `#FEE2E2` | 错误背景 |
| `info-500` | `#3B82F6` | 信息、链接 |
| `info-100` | `#DBEAFE` | 信息背景 |

### 1.4 中性色 (Neutral)
| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-900` | `#111827` | 标题文字 |
| `neutral-700` | `#374151` | 正文文字 |
| `neutral-500` | `#6B7280` | 次要文字 |
| `neutral-300` | `#D1D5DB` | 禁用边框 |
| `neutral-200` | `#E5E7EB` | 边框 |
| `neutral-100` | `#F3F4F6` | 浅背景 |
| `neutral-50` | `#F9FAFB` | 页面背景 |

---

## 2. 字体系统 (Typography)

**Font Family**: Inter (Google Fonts)  
**Fallback**: system-ui, -apple-system, sans-serif

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Hero | 56px | 700 | 62px | 首页大标题 |
| H1 | 40px | 700 | 48px | 页面标题 |
| H2 | 32px | 600 | 40px | 区块标题 |
| H3 | 24px | 600 | 32px | 卡片标题 |
| H4 | 20px | 500 | 28px | 小标题 |
| Body-L | 18px | 400 | 28px | 重要正文 |
| Body | 16px | 400 | 24px | 默认正文 |
| Body-S | 14px | 400 | 20px | 辅助文字 |
| Caption | 12px | 400 | 16px | 标签、备注 |

---

## 3. 间距系统 (Spacing)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | 小标签间距 |
| `sm` | 8px | 组件内部间距 |
| `md` | 16px | 卡片内边距 |
| `lg` | 24px | 卡片间距 |
| `xl` | 32px | 区块间距 |
| `2xl` | 48px | 大区块间距 |
| `3xl` | 64px | 页面间距 |

### Grid System
- **Desktop**: 12列, gap 24px, max-width 1280px
- **Tablet**: 8列, gap 16px
- **Mobile**: 4列, gap 12px

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 4. 圆角 (Border Radius)

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Tag、小元素 |
| `md` | 8px | Button、Input |
| `lg` | 16px | Card |
| `full` | 9999px | 胶囊搜索框、头像 |

---

## 5. 阴影 (Shadows)

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | 微阴影 |
| `md` | `0 4px 6px rgba(0,0,0,0.1)` | 卡片 |
| `lg` | `0 10px 15px rgba(0,0,0,0.1)` | 悬浮卡片 |
| `xl` | `0 20px 25px rgba(0,0,0,0.15)` | Modal |

---

## 6. 组件规范 (Components)

### 6.1 Button
- **高度**: 48px
- **内边距**: 12px 24px
- **圆角**: 8px
- **字体**: 16px Medium
- **变体**: Primary / Secondary / Icon
- **状态**: Default / Hover / Active / Loading / Disabled

### 6.2 Product Card
- **尺寸**: 360×420px (桌面), 自适应 (移动)
- **圆角**: 16px
- **阴影**: md
- **内边距**: 24px
- **变体**: Standard / Voice / Hot

### 6.3 Input
- **高度**: 48px (标准) / 64px (搜索)
- **圆角**: 8px (标准) / 32px (搜索胶囊)
- **边框**: 1px solid neutral-200
- **Focus**: 2px solid primary-500

### 6.4 Tag
- **高度**: 28px
- **内边距**: 6px 12px
- **圆角**: 4px
- **字体**: 14px Medium
