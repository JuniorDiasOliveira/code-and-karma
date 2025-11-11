# ⚡ Code & Karma

A modern, high-performance blog built with cutting-edge web technologies and featuring a stunning neon-themed design. Exploring the edge of front-end development: React, TypeScript, design systems, and more.

## ✨ Features

- 🚀 **Ultra-fast** - Built with Astro for optimal performance
- 🎨 **Neon Design** - Eye-catching cyberpunk-inspired UI
- 📱 **Fully Responsive** - Perfect on desktop, tablet, and mobile
- ⚡ **Interactive Effects** - Lightning animations and dynamic loading
- � **Markdown Support** - Write content in Markdown with frontmatter
- 🎯 **TypeScript** - Full type safety throughout the codebase
- 🎭 **React Islands** - Interactive components where needed
- 🌙 **Modern CSS** - Tailwind CSS 4 with custom neon utilities

## �️ Tech Stack

### Core Technologies
- **[Astro](https://astro.build)** - Static Site Generator with islands architecture
- **[React](https://react.dev)** - Interactive UI components
- **[TypeScript](https://typescriptlang.org)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first styling

### Content & Data
- **Markdown** - Content authoring with frontmatter
- **Astro Content Collections** - Type-safe content management

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **Vite** - Lightning-fast development server
- **ESLint** - Code linting and formatting

## 🏗️ Project Structure

```text
astro-neon-blog/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── content/           # Content-related components
│   │   │   └── BlogCard.astro
│   │   ├── islands/           # Interactive React components
│   │   │   ├── Light-FX.tsx
│   │   │   ├── SimpleLoader.tsx
│   │   │   └── HeroSilhouettes.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   └── sections/          # Page sections
│   │       ├── HeroSection.astro
│   │       ├── LatestArticlesSection.astro
│   │       └── TechStackSection.astro
│   ├── content/
│   │   ├── config.ts          # Content collections config
│   │   └── blog/              # Blog posts (Markdown)
│   ├── layouts/
│   │   └── Layout.astro       # Base layout
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # About page
│   │   └── post/
│   │       └── [...slug].astro # Dynamic blog post pages
│   └── styles/
│       └── global.css         # Global styles and neon effects
├── astro.config.mjs           # Astro configuration
├── package.json
├── tailwind.config.mjs        # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🎨 Design System

The blog features a custom neon-themed design system with:

- **Neon gradients** - Cyan and magenta color schemes
- **Lightning effects** - Dynamic animated backgrounds
- **Glitch animations** - Cyberpunk-inspired text effects
- **Responsive layouts** - Mobile-first design approach
- **Loading animations** - Custom progress indicators

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

## 📜 Available Scripts

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Install project dependencies                     |
| `pnpm dev`                | Start development server at `localhost:4321`    |
| `pnpm build`              | Build production site to `./dist/`              |
| `pnpm preview`            | Preview production build locally                 |
| `pnpm astro check`        | Run Astro diagnostics                           |
| `pnpm astro sync`         | Generate TypeScript types for content           |

## 📝 Content Management

### Adding Blog Posts

1. Create a new `.md` file in `src/content/blog/`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: "Your Post Title"
   excerpt: "Brief description of your post"
   date: 2025-11-11
   tags: ["react", "typescript", "web-dev"]
   readTime: "5 min read"
   ---
   ```
3. Write your content in Markdown below the frontmatter

### Content Structure
- **Blog posts** live in `src/content/blog/`
- **Static pages** are in `src/pages/`
- **Components** are organized by type in `src/components/`

## 🌐 Deployment

The site is optimized for static deployment on platforms like:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

Build command: `pnpm build`  
Output directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Site**: [karma-and-code.vercel.app](https://karma-and-code.vercel.app)
- **Author**: [Junior Dias de Oliveira](https://github.com/JuniorDiasOliveira)
- **Astro Documentation**: [docs.astro.build](https://docs.astro.build)
