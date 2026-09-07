---

title: "The Registry Pattern: Configuration Over Conditionals"
excerpt: "When adding a new type means editing the renderer, your extensibility lives in the wrong place. Use a registry to separate discovery from execution."
date: "2026-09-04"
author: "Junior Oliveira"
tags: ["TypeScript", "Frontend", "Design Patterns", "Architecture"]
readTime: "5 min read"
---

Extensible systems tend to start with a `switch`, or an `object dictionary`.

And that's usually fine.

You have three widget types, for example, with switch:

```typescript
function renderWidget(widget: Widget) {
  switch (widget.type) {
    case 'stat-tile':
      return <StatTile {...widget.props} />;

    case 'bar-chart':
      return <BarChart {...widget.props} />;

    case 'table':
      return <Table {...widget.props} />;
  }
}
```

There's nothing inherently wrong with this code.

The problem starts when the set of implementations is expected to grow independently from the thing consuming them.

Add a map.

Edit the renderer.

Add a heatmap.

Edit the renderer.

Add a gauge.

Edit the renderer.

Eventually, the renderer becomes a catalogue of every implementation in the system.

```text
Renderer
   │
   ├── knows StatTile
   ├── knows BarChart
   ├── knows Table
   ├── knows Map
   ├── knows Heatmap
   ├── knows Gauge
   └── knows everything added next
```

At that point, the renderer isn't really rendering widgets anymore.

It's also responsible for discovering which widgets exist.

Those are two different responsibilities and the **Registry Pattern** exists to separates them.

## The idea

Instead of teaching the consumer about every implementation, implementations are registered somewhere else.

The consumer asks only:

> Give me the implementation registered under this identifier.

Conceptually:

```text
              ┌── StatTile
              │
Renderer → Registry ── BarChart
              │
              ├── Table
              │
              └── ...
```

The renderer depends on the registry.

It doesn't depend on the implementations behind it.

This gives us a useful architectural property:

**adding another implementation doesn't require changing the consumer.**

## Registration becomes the extension point

A registration can be very small:

```typescript
type Registration<
  TId extends string,
  TProps
> = {
  readonly id: TId;

  readonly load: () => Promise<{
    component: React.ComponentType<TProps>;
  }>;
};
```

Each implementation owns its registration:

```typescript
const statTileRegistration = {
  id: 'stat-tile',

  load: async () => ({
    component: (await import('./StatTile')).StatTile
  })
} satisfies Registration<'stat-tile', StatTileProps>;
```

And another implementation can do exactly the same:

```typescript
const barChartRegistration = {
  id: 'bar-chart',

  load: async () => ({
    component: (await import('./BarChart')).BarChart
  })
} satisfies Registration<'bar-chart', BarChartProps>;
```

Neither registration needs to know who will eventually consume it.

That's important.

The extension point belongs to the implementation, not to the renderer.

## Building the registry

The registrations can then be composed into a registry:

```typescript
const registrations = [
  statTileRegistration,
  barChartRegistration
] as const;
```

Because that list is known to TypeScript, we can derive the valid identifiers from the registrations themselves:

```typescript
type WidgetRegistration = typeof registrations[number];

type WidgetId = WidgetRegistration['id'];
```

`WidgetId` is now:

```typescript
type WidgetId =
  | 'stat-tile'
  | 'bar-chart';
```

There is no second manually maintained union of widget identifiers.

The registrations are defining the vocabulary.

Now the registry can expose that vocabulary:

```typescript
class Registry<TId extends string> {
  private entries = new Map<
    TId,
    Registration<TId, unknown>
  >();

  register(entry: Registration<TId, unknown>) {
    if (this.entries.has(entry.id)) {
      throw new Error(`Duplicate id: ${entry.id}`);
    }

    this.entries.set(entry.id, entry);
  }

  resolve(id: TId) {
    const entry = this.entries.get(id);

    if (!entry) {
      throw new Error(`Unknown id: ${id}`);
    }

    return entry;
  }
}
```

And our consumer can now operate on the identifiers the registry actually supports:

```typescript
function resolveWidget(id: WidgetId) {
  return registry.resolve(id);
}
```

This:

```typescript
resolveWidget('stat-tile');
```

is valid.

This:

```typescript
resolveWidget('banana');
```

isn't.

That's a much stronger property than simply putting a `Map` around a collection of components.

The registry is also defining the set of implementations available to the system.

## The consumer becomes boring

This is where the pattern starts paying for itself.

The rendering layer shouldn't contain knowledge like:

```text
if stat-tile → StatTile
if bar-chart → BarChart
if map       → Map
if table     → Table
```

It should contain something closer to:

```typescript
async function resolveWidgetComponent(id: WidgetId) {
  const registration = registry.resolve(id);
  const { component } = await registration.load();

  return component;
}
```

This function doesn't know what a `StatTile` is.

It doesn't know what a `BarChart` is.

More importantly, it doesn't need to change when another implementation appears.

Add widget #3.

The consumer doesn't change.

Add widget #20.

The consumer doesn't change.

Add widget #100.

The consumer still doesn't change.

That's the property I'm actually interested in.

## A registry is not just a fancy switch

It's easy to look at this and say:

> You moved the switch statement into a `Map`.

And if all we did was replace this:

```typescript
switch (id) {
  // ...
}
```

with this:

```typescript
registry.get(id);
```

that criticism would be fair.

The architectural difference is **where knowledge about implementations lives**.

With the switch:

```text
new implementation
      ↓
consumer must change
```

With a registry:

```text
new implementation
      ↓
registration is added
      ↓
consumer remains unchanged
```

The registry becomes an explicit extension boundary.

That's useful when different parts of the system own different implementations, when implementations are lazy-loaded, when plugins exist, or when the available implementations are assembled differently depending on the application.

## When not to use it

Not every `switch` needs a registry.

If you have three variants, they rarely change, and they're all conceptually owned by the same module, this:

```typescript
switch (type) {
  // three cases
}
```

may be clearer than introducing registrations, factories, generic types, and runtime resolution.

Patterns have a cost.

A registry becomes useful when **extensibility is itself a requirement**.

A good signal is that adding another type repeatedly requires modifying code that shouldn't conceptually care about that type.

If every new widget requires changing your generic widget renderer, your extension boundary is probably in the wrong place.

## Configuration becomes possible

There's another useful consequence.

Once runtime implementations have stable identifiers, configuration can refer to them without knowing anything about React components.

For example:

```yaml
id: revenue
type: stat-tile
title: Revenue
```

The configuration doesn't import `StatTile`.

It doesn't know where `StatTile` lives.

It declares:

```text
type = stat-tile
```

The runtime resolves that identifier through the registry.

```text
Configuration
      │
      │ "stat-tile"
      ↓
   Registry
      │
      ↓
Registration
      │
      ↓
   StatTile
```

That boundary becomes particularly useful in systems where definitions are data-driven.

A dashboard definition can describe *which* widget should exist while the registry remains responsible for knowing *how* that widget is implemented.

Those concerns no longer need to live in the same place.

## The test I use

There's a simple question I like for deciding whether the pattern is doing its job:

> **What existing code must change when implementation #101 is added?**

Ideally:

The implementation is created.

Its registration is created.

It's added to the registry composition.

And the generic consumer remains untouched.

If adding type #101 means adding another conditional to the renderer, the renderer still owns knowledge it probably shouldn't.

We're using this pattern in a production dashboard system where dozens of widget types — charts, tables, KPI tiles, maps, and others — are resolved through registrations while the rendering runtime remains independent of their concrete implementations.

Combined with declarative configuration, it creates a useful separation:

```text
Configuration
      ↓
describes what should exist

Registry
      ↓
knows what implementations exist

Runtime
      ↓
resolves and executes them
```

The goal isn't to eliminate `switch` statements.

It's to put extensibility in the right place.

**When adding a new implementation requires changing the generic consumer, the consumer probably knows too much.**
