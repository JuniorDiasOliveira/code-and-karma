# Estrutura de Componentes - Arquitetura Astro

Esta estrutura segue as melhores práticas do Astro para separar componentes por responsabilidade e otimizar o carregamento.

## 📁 Estrutura Organizada

```
src/components/
├── islands/           # React Components (Islands)
│   ├── Light-FX.tsx      # Efeito de lightning (interativo)
│   ├── Logo.tsx          # Logo com animação
│   ├── HeroSilhouettes.tsx # Silhuetas para lightning
│   └── CodeBlock.tsx     # Syntax highlighting
├── layout/            # Componentes de Layout (Astro)
│   ├── Header.astro      # Cabeçalho do site
│   └── Footer.astro      # Rodapé do site
├── content/           # Componentes de Conteúdo (Astro)
│   └── BlogCard.astro    # Card de artigo
├── ui/                # Componentes de Interface (Astro)
│   └── LightningWrapper.astro # Wrapper para lightning
└── index.ts           # Barrel exports
```

## 🏝️ Islands (React Components)

**Quando usar:** Componentes que precisam de interatividade no cliente

- **Light-FX.tsx** - Efeitos visuais de lightning com animações
- **Logo.tsx** - Logo com animação de rotação
- **HeroSilhouettes.tsx** - Silhuetas que aparecem durante lightning
- **CodeBlock.tsx** - Syntax highlighting com funcionalidade de cópia

**Carregamento:** `client:only="react"`, `client:load`, `client:idle`

## 🏗️ Layout Components (Astro)

**Quando usar:** Estrutura e layout que não precisam de JS no cliente

- **Header.astro** - Navegação principal
- **Footer.astro** - Rodapé com links

**Carregamento:** Server-side rendering (SSR)

## 📄 Content Components (Astro)

**Quando usar:** Componentes focados em apresentação de conteúdo

- **BlogCard.astro** - Apresentação de artigos

**Carregamento:** Server-side rendering (SSR)

## 🎨 UI Components (Astro)

**Quando usar:** Wrappers e componentes de interface

- **LightningWrapper.astro** - Facilita uso do Lightning effect

**Carregamento:** Server-side rendering (SSR)

## 📦 Importação

### Opção 1: Imports Diretos
```astro
---
import Header from '../components/layout/Header.astro';
import { LightningFX } from '../components/islands/Light-FX.tsx';
---
```

### Opção 2: Barrel Imports (index.ts)
```astro
---
import { Header, LightningFX } from '../components';
---
```

## 🚀 Benefícios da Arquitetura

1. **Performance Otimizada**
   - Islands carregam apenas quando necessário
   - Componentes Astro são 100% server-side

2. **Manutenibilidade**
   - Separação clara de responsabilidades
   - Fácil localização de componentes

3. **Developer Experience**
   - Imports organizados
   - Typescript suport completo
   - Hot reload otimizado

4. **Bundle Size**
   - JavaScript mínimo no cliente
   - Tree-shaking eficiente

## 💡 Dicas de Uso

- Use **Islands** apenas quando precisar de interatividade
- Prefira **componentes Astro** para conteúdo estático
- Use `client:idle` para componentes não críticos
- Use `client:load` apenas para componentes essenciais
- Considere `client:visible` para componentes below-the-fold