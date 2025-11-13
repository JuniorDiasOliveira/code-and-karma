# ⚡ Code & Karma

A modern, high-performance blog built with cutting-edge web technologies and featuring a stunning neon-themed design. Exploring the edge of front-end development: React, TypeScript, design patterns, and modern web technologies.

## ✨ Features

- 🚀 **Ultra-fast** - Built with Astro 5.15.5 for optimal performance
- 🎨 **Neon Design** - Eye-catching cyberpunk-inspired UI with custom theme
- 📱 **Fully Responsive** - Perfect on desktop, tablet, and mobile
- ⚡ **Interactive Effects** - Lightning animations and dynamic loading
- 📝 **Markdown Support** - Write content in Markdown with frontmatter
- 🎯 **TypeScript** - Full type safety throughout the codebase
- 🎭 **React Islands** - Interactive components with optimized hydration
- 🌙 **Modern CSS** - Tailwind CSS 4 with custom neon utilities
- 🔍 **SEO Optimized** - Complete sitemap, robots.txt, and PWA manifest
- ⚡ **Performance First** - Lazy loading, image optimization, and skeleton loading
- 🎨 **Component Library** - Reusable UI components and design system

## 🛠️ Tech Stack

### Core Technologies
- **[Astro 5.15.5](https://astro.build)** - Static Site Generator with islands architecture
- **[React 19](https://react.dev)** - Interactive UI components with latest features
- **[TypeScript](https://typescriptlang.org)** - Full type safety throughout
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first styling with custom neon theme

### Animation & Effects
- **[Framer Motion](https://framer.com/motion)** - Smooth animations and transitions
- **Custom Lightning Effects** - Interactive background animations
- **Intersection Observer** - Performance-optimized lazy loading

### Content & SEO
- **Markdown** - Content authoring with frontmatter
- **Astro Content Collections** - Type-safe content management
- **RSS Feed** - Automated content syndication
- **Sitemap Generation** - Complete XML sitemap for SEO
- **PWA Manifest** - Progressive Web App capabilities

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **Vite** - Lightning-fast development server and bundler
- **Astro Check** - Built-in diagnostics and type checking

## 🏗️ Project Structure

```text
code-and-karma/
├── public/                     # Static assets & SEO
│   ├── favicon.ico            # Multi-format favicon system
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── logo.png               # Optimized brand logo
│   ├── robots.txt             # SEO crawler configuration
│   ├── sitemap.xml            # Complete site sitemap
│   └── site.webmanifest       # PWA manifest
├── src/
│   ├── components/
│   │   ├── content/           # Content display components
│   │   │   ├── BlogCard.astro
│   │   │   ├── CodeBlock.tsx
│   │   │   └── MarkdownRenderer.astro
│   │   ├── islands/           # Interactive React components
│   │   │   ├── Light-FX.tsx           # Lightning animations
│   │   │   ├── LazyLightningWrapper.tsx # Performance optimization
│   │   │   ├── OptimizedLoader.tsx    # Skeleton loading
│   │   │   ├── Logo.tsx               # Animated logo
│   │   │   └── HeroSilhouettes.tsx    # Hero animations
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   ├── sections/          # Page sections
│   │   │   ├── HeroSection.astro
│   │   │   ├── LatestArticlesSection.astro
│   │   │   └── TechStackSection.astro
│   │   └── ui/                # Reusable UI components
│   │       ├── Icon.astro             # Centralized icon system
│   │       ├── BackButton.astro       # Navigation components
│   │       ├── CTAButton.astro        # Call-to-action buttons
│   │       └── StatsDisplay.astro     # Statistics display
│   ├── content/
│   │   ├── config.ts          # Content collections config
│   │   └── blog/              # Blog posts (5 articles)
│   │       ├── react-19-features.md
│   │       ├── tailwind-css-4.md
│   │       ├── factory-javascript.md
│   │       ├── observer-javascript.md
│   │       └── singleton-in-javascript.md
│   ├── layouts/
│   │   └── Layout.astro       # Base layout with SEO
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # About page
│   │   ├── rss.xml.js         # RSS feed generation
│   │   └── post/
│   │       └── [...slug].astro # Dynamic blog post pages
│   └── styles/
│       └── global.css         # Global styles and neon effects
├── astro.config.mjs           # Astro + React + Sitemap config
├── package.json               # Dependencies and scripts
├── tailwind.config.mjs        # Custom neon theme configuration
└── tsconfig.json              # TypeScript configuration
```

## 🎨 Design System

The blog features a comprehensive neon-themed design system with:

### Color Palette
- **Primary Neon Green**: `#00FF80` - Main accent color
- **Neon Cyan**: `#00D9F5` - Secondary highlights  
- **Neon Magenta**: `#FF00FF` - Special accents
- **Dark Background**: `#0A0C10` - Primary background
- **Custom gradients** - Dynamic color transitions

### Interactive Elements
- **Lightning effects** - Canvas-based animated backgrounds
- **Skeleton loading** - Prevents Cumulative Layout Shift (CLS)
- **Intersection observers** - Performance-optimized animations
- **Hover states** - Neon glow effects on interactive elements
- **Loading animations** - Custom progress indicators

### Component Architecture
- **Centralized icons** - Single source of truth for SVG icons
- **Reusable UI components** - Consistent design patterns
- **Mobile-first responsive** - Optimized for all screen sizes
- **Performance focused** - Lazy loading and code splitting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JuniorDiasOliveira/code-and-karma.git
   cd code-and-karma
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

### Build for Production

```bash
# Build the site
pnpm build

# Preview the production build
pnpm preview
```

## 📜 Available Scripts

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Install project dependencies                     |
| `pnpm dev`                | Start development server at `localhost:4321`    |
| `pnpm build`              | Build production site to `./dist/`              |
| `pnpm preview`            | Preview production build locally                 |
| `pnpm astro check`        | Run Astro diagnostics and type checking         |
| `pnpm astro sync`         | Generate TypeScript types for content           |

## 📝 Content Management

### Adding Blog Posts

1. Create a new `.md` file in `src/content/blog/`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: "Your Post Title"
   excerpt: "Brief description of your post"
   date: "2025-11-13"
   author: "Author Name"
   tags: ["react", "typescript", "web-dev"]
   readTime: "5 min read"
   ---
   ```
3. Write your content in Markdown below the frontmatter
4. The post will automatically appear in the latest articles section
5. RSS feed and sitemap are automatically updated

### Current Blog Topics
- **React 19** - Latest features and improvements
- **Tailwind CSS 4** - What's new and improved  
- **JavaScript Design Patterns** - Factory, Observer, Singleton patterns
- **Modern Web Development** - Best practices and performance

### Content Structure
- **Blog posts** (`src/content/blog/`) - Markdown files with frontmatter
- **Static pages** (`src/pages/`) - Astro components for routes
- **Components** (`src/components/`) - Organized by function (ui, islands, layout, etc.)
- **SEO files** (`public/`) - robots.txt, sitemap.xml, PWA manifest

## 🌐 Deployment

The site is optimized for static deployment on platforms like:
- **Cloudflare Pages** (current deployment)
- **Vercel**
- **Netlify** 
- **GitHub Pages**

### Deployment Configuration
- **Build command**: `pnpm build`
- **Output directory**: `dist`
- **Node version**: 18+
- **Package manager**: pnpm (recommended)

### SEO & Performance Features
- ✅ Complete XML sitemap with news schema
- ✅ Robots.txt with crawler optimization
- ✅ PWA manifest for mobile installation
- ✅ Multi-format favicon support
- ✅ RSS feed for content syndication
- ✅ Performance optimizations (lazy loading, skeleton UI)
- ✅ Lighthouse score improvements implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## � Performance Highlights

- **Astro Islands Architecture** - Minimal JavaScript hydration
- **Image Optimization** - WebP format with fallbacks
- **Code Splitting** - Lazy loading for heavy components (117KB Lightning FX)
- **Font Optimization** - Preloaded fonts with display:swap
- **Skeleton Loading** - Prevents Cumulative Layout Shift (CLS)
- **SEO Optimized** - Complete meta tags, structured data, sitemaps

## 🔗 Links

- **Live Site**: [code-and-karma.pages.dev](https://code-and-karma.pages.dev/)
- **Repository**: [github.com/JuniorDiasOliveira/code-and-karma](https://github.com/JuniorDiasOliveira/code-and-karma)
- **Author**: [Junior Dias de Oliveira](https://github.com/JuniorDiasOliveira)
- **Astro Documentation**: [docs.astro.build](https://docs.astro.build)

---

**Built with ⚡ by [Junior Dias de Oliveira](https://github.com/JuniorDiasOliveira) using Astro, React, and modern web technologies.**
