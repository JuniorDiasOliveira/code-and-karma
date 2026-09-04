---
title: "The Registry Pattern: Configuration Over Conditionals"
excerpt: "Stop growing a switch statement every time you add a new type. Learn the Registry Pattern for extensible, decoupled systems"
date: "2026-09-04"
author: "Junior Oliveira"
tags: ["TypeScript", "Frontend", "Design Patterns", "Architecture"]
readTime: "3 min read"
---

The **Registry Pattern** solves a problem every extensible system eventually hits: you have one renderer (or handler, or processor) that needs to support many *kinds* of a thing, and you don't want it to grow a new `if`/`switch` branch every single time someone adds one.

🚀 Going straightforward to the advantages:

**Encapsulation of Registration** – each type registers itself, in its own file. Nothing central has to be edited to add a new one.

**Type-safe resolution** – ids and props get inferred from the registration itself, so a typo in an id is a compile error, not a runtime surprise.

**Decoupling** – the renderer depends only on the registry's `resolve()` method, never on any concrete implementation.

Here's the shape of it:

```typescript
type Registration<TId extends string, TProps> = {
  readonly id: TId;
  readonly load: () => Promise<{ component: React.ComponentType<TProps> }>;
};

class Registry {
  private entries = new Map<string, Registration<string, unknown>>();

  register(entry: Registration<string, unknown>) {
    if (this.entries.has(entry.id)) {
      throw new Error(`Duplicate id: ${entry.id}`);
    }
    this.entries.set(entry.id, entry);
  }

  resolve(id: string) {
    const entry = this.entries.get(id);
    if (!entry) throw new Error(`Unknown id: ${id}`);
    return entry;
  }

  static from(entries: Registration<string, unknown>[]) {
    const registry = new Registry();
    entries.forEach((entry) => registry.register(entry));
    return registry;
  }
}

// One registration per type, colocated with its own component:
const statTileRegistration: Registration<'stat-tile', StatTileProps> = {
  id: 'stat-tile',
  load: async () => ({ component: (await import('./StatTile')).StatTile })
};

const barChartRegistration: Registration<'bar-chart', BarChartProps> = {
  id: 'bar-chart',
  load: async () => ({ component: (await import('./BarChart')).BarChart })
};

const registry = Registry.from([statTileRegistration, barChartRegistration]);
```

And the payoff — the one piece of code that renders *any* registered type:

```typescript
async function renderItem(id: string) {
  const { component: Component } = await registry.resolve(id).load();
  return Component;
}
```

`renderItem` has never heard of `StatTile` or `BarChart`. It doesn't need to. Add a hundred more types and this function doesn't change — that's the actual test of whether the pattern is holding up: if adding type #101 ever means editing the renderer itself, the registry has already broken down somewhere.

**Note:** we use exactly this — one registration per type, a factory that builds the registry once from all of them, and a runtime that only ever calls `resolve()` — in a real dashboard system to manage dozens of widget types (charts, tables, KPI tiles, maps) without the render layer knowing any of them exist. It also plays nicely with a config file (YAML/JSON) describing each type's metadata instead of hardcoding it, which is what actually lets non-engineers add new widget *definitions* without touching code.
