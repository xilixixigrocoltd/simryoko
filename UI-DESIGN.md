# SimKaze eSIM UI/UX Design System

> Version 1.0 | Last Updated: March 2026

---

## 1. Design Tokens

### 1.1 Color Palette

```css
:root {
  /* Primary Brand Colors */
  --brand: #6C63FF;        /* Primary purple - CTAs, highlights */
  --brand-dark: #5A52E0;   /* Hover states */
  --brand-light: #EEF0FF;  /* Backgrounds, badges */
  
  /* Gradient */
  --gradient-brand: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-hero: linear-gradient(160deg, #0F0E17 0%, #1C1434 50%, #0F1629 100%);
  
  /* Accent Colors */
  --accent: #FF6B6B;       /* Alerts, important actions */
  --success: #10B981;      /* Success states */
  --warning: #F59E0B;       /* Warnings */
  --error: #EF4444;        /* Error states */
  
  /* Neutrals */
  --dark: #0F0E17;         /* Primary dark */
  --dark-2: #1C1B2E;      /* Secondary dark */
  --text: #1a1a2e;         /* Primary text */
  --text-2: #555555;       /* Secondary text */
  --text-3: #999999;       /* Tertiary text / hints */
  --border: #E8ECF4;       /* Borders */
  --bg: #FAFBFF;           /* Page background */
  --white: #FFFFFF;        /* Cards, surfaces */
  
  /* Platform Colors */
  --stripe-blue: #635BFF;
  --usdt-color: #26A17B;
  --ton-color: #0098EA;
  --alipay-blue: #1677FF;
  --wechat-green: #07C160;
}
```

### 1.2 Typography

```css
:root {
  /* Font Family */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 2rem;      /* 32px */
  --text-4xl: 2.5rem;   /* 40px */
  --text-5xl: 3rem;      /* 48px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-snug: 1.375;
  --leading-normal: 1.6;
  --leading-relaxed: 1.75;
}
```

### 1.3 Spacing System

```css
:root {
  /* Base: 4px */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### 1.4 Border Radius

```css
:root {
  --radius-sm: 6px;
  --radius: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;
}
```

### 1.5 Shadows

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 24px rgba(108, 99, 255, 0.10);
  --shadow-md: 0 8px 32px rgba(108, 99, 255, 0.15);
  --shadow-lg: 0 12px 40px rgba(108, 99, 255, 0.18);
  --shadow-xl: 0 20px 60px rgba(108, 99, 255, 0.22);
  
  /* Dark theme */
  --shadow-dark: 0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-phone: 0 32px 80px rgba(0, 0, 0, 0.5);
}
```

---

## 2. Component Library

### 2.1 Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--gradient-brand);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  box-shadow: 0 4px 20px rgba(108, 99, 255, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(108, 99, 255, 0.45);
}
.btn-primary:active {
  transform: translateY(0);
}

/* Secondary Button */
.btn-secondary {
  background: var(--brand-light);
  color: var(--brand);
  padding: 12px 24px;
  border-radius: var(--radius);
  font-weight: var(--font-semibold);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-2);
  padding: 12px 24px;
  border-radius: var(--radius);
  font-weight: var(--font-medium);
  transition: color 0.2s;
}
.btn-ghost:hover {
  color: var(--brand);
}

/* Outline Button */
.btn-outline {
  background: transparent;
  color: var(--brand);
  border: 2px solid var(--brand);
  padding: 10px 22px;
  border-radius: var(--radius);
  font-weight: var(--font-semibold);
  transition: background 0.2s, color 0.2s;
}
.btn-outline:hover {
  background: var(--brand);
  color: white;
}
```

### 2.2 Cards

```css
/* Product Card */
.product-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: all 0.22s ease;
  cursor: pointer;
}
.product-card:hover {
  border-color: var(--brand);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Destination Card */
.dest-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: all 0.22s ease;
  position: relative;
  overflow: hidden;
}
.dest-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-brand);
  opacity: 0;
  transition: opacity 0.22s;
}
.dest-card:hover::after {
  opacity: 1;
}
.dest-card:hover .dest-country,
.dest-card:hover .dest-from {
  position: relative;
  z-index: 1;
  color: white;
}
```

### 2.3 Input Fields

```css
/* Text Input */
.input {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  font-size: var(--text-base);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: var(--brand);
}
.input::placeholder {
  color: var(--text-3);
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: var(--radius-md);
  padding: 6px 6px 6px 18px;
  box-shadow: var(--shadow-dark);
}
.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  font-size: var(--text-base);
  padding: 12px 0;
}
.search-btn {
  background: var(--brand);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius);
  font-weight: var(--font-semibold);
}
```

---

## 3. Page Layouts

### 3.1 Homepage (index.html)

#### Hero Section
- **Background**: Dark gradient (`--gradient-hero`)
- **Layout**: 2-column (text left, phone mockup right)
- **Content**:
  - Pill badges showing key value props
  - Main headline with gradient accent text
  - Description with highlighted price
  - Search bar with autocomplete dropdown
  - Popular destination chips
  
#### Phone Mockup Design
```css
.phone-mockup {
  width: 240px;
  background: var(--dark-2);
  border-radius: 36px;
  padding: 20px 16px;
  box-shadow: var(--shadow-phone);
}
.phone-screen {
  background: var(--dark);
  border-radius: 24px;
  padding: 20px;
}
```

#### Stats Bar
- 4-column grid below hero
- Shows: Countries, Plans, Price comparison, Support response time

#### Featured Destinations
- 4-column grid on desktop, responsive
- Each card shows: Flag, Country name, Starting price

### 3.2 Shop Page (shop.html)

#### Filter Panel (Sidebar)
- Sticky position on desktop
- Filters:
  - Region (dropdown)
  - Data amount (dropdown)
  - Duration (dropdown)
  - Price range (slider)
- Mobile: Collapsible filter drawer

#### Products Grid
- Auto-fill grid: `minmax(220px, 1fr)`
- Product card content:
  - Flag (large emoji)
  - Destination name
  - Plan name
  - Price (large, bold)
  - Tags (e.g., "5GB", "30 days")
  - "Buy Now" button

### 3.3 Product Detail Page (app.html - Mobile Sheet)

#### Bottom Sheet Design
```css
.sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg);
  border-radius: 20px 20px 0 0;
  max-height: 85vh;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(.4, 0, .2, 1);
  z-index: 100;
}
.sheet.open {
  transform: translateY(0);
}
```

#### Plan Options
- Vertical list of plan variants
- Each option shows: Data amount, Duration, Price
- Selected state: Purple border + light background

### 3.4 Checkout Page (checkout.html)

#### Layout
- Single column, max-width 480px
- Progress indicator at top

#### Steps
1. Email input
2. Payment method selection
3. Order summary

#### Payment Methods Grid
```css
.pay-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.pay-method {
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.pay-method.selected {
  border-color: var(--brand);
  background: var(--brand-light);
}
```

### 3.5 Success Page (success.html)

#### QR Code Display Section
- Centered card layout
- Large checkmark animation
- Order information
- Installation steps
- QR code (rendered from email)

#### Success Animation
```css
.success-icon {
  font-size: 64px;
  animation: pop 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}
@keyframes pop {
  0% { transform: scale(0); }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
```

---

## 4. Animations

### 4.1 Page Load

```css
/* Fade in page content */
body {
  animation: fadeIn 0.25s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 4.2 Hover Effects

```css
/* Card lift on hover */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Button press */
.btn:active {
  transform: scale(0.98);
}
```

### 4.3 Micro-interactions

```css
/* Search dropdown */
.dest-dropdown {
  animation: slideDown 0.2s ease;
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading spinner */
.spinner {
  animation: spin 0.85s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### 4.4 AOS (Animate On Scroll)

```html
<!-- Include AOS -->
<link rel="stylesheet" href="https://unpkg.com/aos@2.3.4/dist/aos.css"/>
<script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>

<!-- Initialize -->
<script>
  AOS.init({
    once: true,
    offset: 60,
    easing: 'ease-out-cubic'
  });
</script>

<!-- Usage -->
<div data-aos="fade-up" data-aos-delay="100">
  <!-- Content -->
</div>
```

---

## 5. Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small phones */
@media (max-width: 375px) {
  .container {
    padding: 0 12px;
  }
  .hero h1 {
    font-size: 28px;
  }
}

/* Large phones / Small tablets */
@media (max-width: 480px) {
  .stats-bar {
    grid-template-columns: 1fr 1fr;
  }
  .dest-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablets */
@media (max-width: 768px) {
  .nav-links {
    display: none; /* Mobile nav instead */
  }
  .hero-inner {
    grid-template-columns: 1fr;
  }
  .hero-visual {
    display: none; /* Hide phone mockup */
  }
  .how-grid {
    grid-template-columns: 1fr;
  }
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

/* Desktop */
@media (max-width: 1024px) {
  .dest-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .shop-layout {
    grid-template-columns: 1fr; /* Filters collapse */
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

---

## 6. Mobile Optimizations

### 6.1 Touch Targets

```css
/* Minimum touch target size */
a, button, .tap-area {
  min-height: 44px;
  min-width: 44px;
}

/* Remove tap highlight */
a, button, .dest-card, .product-card {
  -webkit-tap-highlight-color: transparent;
}
```

### 6.2 Safe Areas

```css
/* iPhone X+ safe areas */
@supports (padding: max(0px)) {
  body {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
  .float-support {
    bottom: max(28px, calc(28px + env(safe-area-inset-bottom)));
  }
}
```

### 6.3 iOS Momentum Scrolling

```css
.shop-body, .filter-panel, .mobile-nav {
  -webkit-overflow-scrolling: touch;
}
```

---

## 7. Accessibility

### 7.1 Focus States

```css
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
```

### 7.2 Color Contrast

- Primary text: `--text` (#1a1a2e) on white - ✓ Passes WCAG AA
- Secondary text: `--text-2` (#555555) on white - ✓ Passes WCAG AA
- Brand color: `--brand` (#6C63FF) on white - ✓ Passes WCAG AA

### 7.3 Screen Reader Support

```html
<!-- Decorative icons hidden from screen readers -->
<span class="icon" aria-hidden="true">📡</span>

<!-- Form labels properly associated -->
<label for="email">Email address</label>
<input id="email" type="email">

<!-- Skip to main content link -->
<a href="#main" class="sr-only">Skip to main content</a>
```

---

## 8. Implementation Checklist

### ✅ Already Implemented
- [x] Design tokens (colors, typography, spacing)
- [x] Button components
- [x] Card components
- [x] Input fields
- [x] Homepage hero section
- [x] Search with autocomplete
- [x] Popular destinations grid
- [x] Shop page with filters
- [x] Product cards
- [x] Checkout flow
- [x] Success page
- [x] Mobile responsive design
- [x] Touch optimizations
- [x] iOS safe areas
- [x] Animations (AOS, CSS transitions)
- [x] Focus states for accessibility

### 📋 Potential Improvements
- [ ] Add skeleton loading states for product grid
- [ ] Implement animated number counter for stats
- [ ] Add skeleton shimmer for search results
- [ ] Implement drawer-style mobile filters
- [ ] Add pull-to-refresh on shop page
- [ ] Implement smooth page transitions
- [ ] Add breadcrumb navigation
- [ ] Add quantity selector for cart
- [ ] Implement save for later functionality

---

## 9. File Structure

```
esim-shop/
├── index.html          # Homepage
├── shop.html           # Product listing
├── app.html            # Mobile/Telegram app
├── checkout.html       # Checkout flow
├── success.html        # Order confirmation
├── payment.html        # Crypto payment
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── app.js          # Core app logic
│   ├── home.js         # Homepage scripts
│   └── i18n.js         # Internationalization
└── UI-DESIGN.md        # This file
```

---

*End of Design System Document*