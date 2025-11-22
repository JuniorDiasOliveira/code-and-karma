---
title: "Migration from @react-pdf-viewer to react-pdf"
excerpt: "An overview about the issues and successes faced while migrating a PDF library from a very big one to another very shallow"
date: "2025-11-22"
author: "Junior Oliveira"
tags: ["JavaScript", "Frontend", "Migration"]
readTime: "5 min read"
---

## Context

You know when sometimes, to deliver something faster, you go with the best library in the market just because it "has everything"? Yeah, not always is the best idea.

This post describes the decision to migrate from the [`@react-pdf-viewer`](https://react-pdf-viewer.dev/) library to [`react-pdf`](https://github.com/wojtekmaj/react-pdf) (wojtekmaj) and the challenges faced during the custom implementation of zoom and interaction features.

## Why Abandon @react-pdf-viewer?

### Identified Problems

1. **Catastrophic Zoom Performance**
- `@react-pdf-viewer` implements zoom through **complete canvas destruction and reconstruction**
- Each zoom operation (in/out) recreated all PDF pages from scratch, this caused:
    - Noticeable 200-500ms delay on each zoom
    - Loss of scroll position
    - Extremely degraded user experience
    - Excessive CPU/memory usage

2. **Excessive Abstractions**
  - The library has multiple abstraction layers that make customization difficult
  - Plugins with complex and inflexible APIs
  - Hard to debug performance issues
  - Impossible to optimize zoom behavior without rewriting the library

3. **Lack of Fine-Grained Control**
  - Impossible to intercept and optimize rendering operations
  - Hardcoded behaviors that don't meet our requirements
  - Limited plugin system

## The Solution: **react-pdf**

### Why react-pdf?

- **Minimalist library**: Only renders PDFs, no UI opinions
- **Total control**: We can implement exactly the behavior we need
- **Native performance**: Uses PDF.js directly, no unnecessary layers
- **Flexibility**: We implement only what we need

### Custom Implementation vs "Complete" Library

Although it seems more laborious to implement from scratch, the custom approach proved to be **much superior**:

## Our Implementation

### 1. Zoom with CSS Transform

```typescript
// Instead of destroying/recreating canvas:
transform: scale(${effectiveScale})
```

**Advantages:**

- **Instant**: Zero perceptible delay
- **Hardware accelerated**: GPU does the heavy lifting
- **Low memory usage**: Canvas is not recreated
- **Smooth**: Fluid transitions without flicker

**Comparison:**

- `@react-pdf-viewer`: 20-50ms delay + reconstruction in some PCs
- Our implementation: <10ms (1 frame)

### 2. Custom Drag to Scroll

```typescript
// Implementation of the touch support
export function handleTouchMove<T extends HTMLElement>(
  e: TouchEvent,
  elementRef: MutableRefObject<T | null>,
  dragStateRef: MutableRefObject<DragState>,
  direction: ScrollDirection,
  friction: number,
) {
  const el = elementRef.current
  const state = dragStateRef.current

  if (!el || !state.isDown || e.touches.length === 0) return

  const touch = e.touches[0]

  const x = touch.pageX - el.offsetLeft
  const y = touch.pageY - el.offsetTop

  const deltaX = (x - state.startX) * friction
  const deltaY = (y - state.startY) * friction

  if (direction === 'horizontal' || direction === 'both') {
    el.scrollLeft = state.startScrollLeft - deltaX
  }

  if (direction === 'vertical' || direction === 'both') {
    el.scrollTop = state.startScrollTop - deltaY
  }
}
```

**Benefits:**

- Functional mouse drag (not available in @react-pdf-viewer)
- Touch drag for mobile
- Optimized events with `useCallback`
- Clean and testable code

### 3. SessionStorage Persistence

```typescript
// Caches PDF in base64 to avoid refetching
sessionStorage.setItem("pdf-blob-key", bytesToBase64(bytes));
```

**Solves:**

- Avoiding repeated downloads when navigating
- Better experience on slow connections
- Reduced backend load

### 4. Clean Architecture

```
pdf-display/
├── hooks/              # Reusable logic
│   ├── useZoom.ts
│   ├── useDragScroll.ts
│   ├── useDocumentSource.ts
│   ├── useContainerWidth.ts
│   └── useBaseContentSize.ts
├── helpers/            # Utility functions
│   ├── pdf-helpers.ts
│   ├── zoom-helpers.ts
│   └── drag-scroll-helpers.ts
├── zoom/               # Zoom components
│   ├── zoom-controls.tsx
│   ├── zoom-in-button.tsx
│   ├── zoom-out-button.tsx
│   └── zoom-reset-button.tsx
├── pdf-container/      # Main container
└── pdf-viewer/         # Renderer
```

**Architecture advantages:**

- ✅ Clear separation of concerns
- ✅ Small and testable components
- ✅ Reusable hooks
- ✅ Isolated helpers for complex logic
- ✅ Easy maintenance and extension

## Challenges Faced and Solutions

### 1. Stack Overflow in bytesToBase64

**Problem:**

```typescript
// Spread operator fails with large arrays: in short, it does fromCharCode(param1, param2, param3...paramN), and it has limit of params that you can use
btoa(String.fromCharCode(...bytes)); // bad
```

**Solution:**

```typescript
// Manual loop for large files
export const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
```

### 2. Preserve Scroll Position on Zoom

**Solution:**

```typescript
const adjustScrollForZoom = () => {
  // Calculate ratios before zoom
  const ratioY = scrollTop / maxScrollY;
  const ratioX = scrollLeft / maxScrollX;

  // Apply after zoom using requestAnimationFrame
  requestAnimationFrame(() => {
    container.scrollTop = ratioY * newMaxScrollY;
    container.scrollLeft = ratioX * newMaxScrollX;
  });
};
```

### 3. Type Safety with Event Listeners

**Problem:**

```typescript
// MouseEvent vs Event incompatible
el.addEventListener("mousedown", (e: MouseEvent) => {});
```

**Solution:**

```typescript
// Wrapper with Event and internal cast
const onMouseDown = (e: Event) =>
  handleMouseDown(e as MouseEvent, elementRef, dragStateRef); // just to keep it pretty
```

## Results

### Performance Metrics

| Metric              | @react-pdf-viewer  | Our Implementation |
| ------------------- | -----------------  | ------------------ |
| Zoom In/Out         | 20-50ms            | <10ms              |
| Memory Usage (zoom) | +150MB             | +5MB               |
| Scroll Preservation | ❌                 | ✅                  |
| Touch Support       | Limited            | ✅ Complete         |
| Drag to Scroll      | ❌                 | ✅                  |

### User Experience

**Before (@react-pdf-viewer):**

- ❌ Slow and sluggish zoom
- ❌ Loss of position on zoom
- ❌ No drag to scroll
- ❌ Hard to customize

**After (react-pdf custom):**

- ✅ Instant zoom
- ✅ Position preserved
- ✅ Mouse and touch drag to scroll
- ✅ Fully customizable
- ✅ Clean and maintainable code

## Conclusion

Implementing from scratch was **significantly better** than using a "complete" library because:

- **Real Performance**: Instant zoom vs 200-500ms delay
- **Total Control**: We can optimize every detail
- **Clean Code**: Clear architecture vs confusing abstractions
- **Maintainability**: We understand 100% of the code
- **Extensibility**: Easy to add new features
- **Bundle Size**: ~50% smaller than @react-pdf-viewer

### Lesson Learned

> **"The 'complete' library is not always the best choice."**
>
> Sometimes, a minimalist library (react-pdf) + custom implementation easily surpasses an "all-in-one" solution (react-pdf-viewer) that makes poor architectural decisions.

The key is understanding your requirements and choosing tools that give you control, not ones that try to do everything and do it poorly.

---

**Migration completed**: November 2025  
**Result**: ✅ Complete success
