---
title: "Docs as the Source of Truth: Documentation for AI-Assisted Development"
excerpt: "Stop letting AI agents guess your architecture. Structure documentation so architectural intent is explicit, discoverable, and protected from implementation drift."
date: "2026-09-05"
author: "Junior Oliveira"
tags: ["AI", "Documentation", "Architecture", "Developer Experience"]
readTime: "5 min read"
---

Most teams write documentation to *describe* what the code does.

That's fine when documentation is primarily something humans consult occasionally. But the model starts to break down when an AI agent is making changes on your behalf.

An agent can inspect thousands of lines of code, find similar implementations, recognize patterns, and produce something that looks completely reasonable. What it cannot reliably infer is **why those patterns exist, whether they are still valid, or whether a different architectural decision has already been made somewhere else.**

If that intent isn't explicit, the agent has to guess.

The dangerous part is that the guess will often compile, **and the agents can't predict the future.**


The fix isn't simply more documentation. It's changing how the whole role documentation plays.

**When code and approved documentation disagree, that's a bug report, not a tiebreaker either way.**

## Why this works

There are three properties I want from documentation in an AI-assisted codebase.

**Single Source of Truth** — there should be exactly one canonical place that explains *why* a subsystem is shaped the way it is, separate from the code that happens to implement that decision today.

**Predictability** — an agent, or a new engineer joining the project, shouldn't need tribal knowledge to understand the intended architecture. It should know where to look and in what order.

**Drift Detection** — disagreements between implementation and documented intent should be surfaced instead of silently "resolved" by whichever source the agent happened to trust.

That last property becomes increasingly important as agents make larger changes across a codebase.

## Three layers of documentation

The structure I've been using separates documentation into three layers:

```text
docs/
├── architecture/       # adopted rules: ownership, dependency direction,
│                       # what must never change without a real decision
│
├── contracts/          # stable interfaces — types, schemas, and the
│                       # vocabulary shared between subsystems
│
└── implementation/     # how a specific subsystem is currently built,
                        # one doc per subsystem, owned by that subsystem
```

They answer different questions.

**Architecture** answers: *What are the rules?*

This is where dependency direction, ownership boundaries, architectural constraints, and decisions that shouldn't casually change live.

**Contracts** answer: *How do parts of the system communicate?*

Types, schemas, identifiers, public interfaces, and shared vocabulary belong here.

**Implementation** answers: *How does this subsystem implement those decisions today?*

This layer can evolve more frequently, but it still operates inside the boundaries established by architecture and contracts.

That separation matters because otherwise documentation tends to become one large collection of files where architectural decisions, implementation details, experiments, and historical notes all have roughly the same authority.

An AI agent shouldn't have to determine which paragraph is actually a rule.

## The reading order matters

The structure alone isn't enough. The agent also needs an explicit reading order.

Before changing a subsystem, our instructions are roughly:

```markdown
Before changing a subsystem:

1. Identify its canonical owner.
2. Read the relevant architecture docs.
3. Read the relevant contract docs.
4. Read the corresponding implementation docs.
5. Only then inspect the existing code.

Do not invent new architectural patterns when a documented one
can be extended.

If source code conflicts with approved documentation, report the
inconsistency.

Do not silently follow the code.
Do not silently modify the code to match the documentation.
Do not guess which one is correct.
```

That last part is the most important.

Without it, an agent facing a mismatch will usually have a very tempting source of evidence: the existing implementation.

It runs. Tests might pass. Other files might follow the same pattern.

So naturally, the agent treats that implementation as precedent.

That's exactly how architectural drift becomes self-reinforcing.

## A small example

Imagine asking an agent:

> Add a new KPI widget to the dashboard.

Without additional context, the agent searches the repository, finds three existing widgets, identifies the common pattern, and builds a fourth one.

Perfectly reasonable.

Except one of those widgets is old and accesses runtime state directly.

The project has since adopted a rule that widgets must be presentational and receive runtime data through their public props.

The agent doesn't know that.

It sees this:

```text
existing widget
    ↓
imports runtime state
    ↓
works in production
```

So it produces this:

```text
new widget
    ↓
imports runtime state
    ↓
works in production
```

Nothing necessarily fails.

The agent has simply duplicated architectural debt.

Now consider the same task when documentation is part of the execution context.

Before looking at the widget implementation, the agent discovers:

```text
architecture/
  widgets.md

contracts/
  widget-contracts.md

implementation/
  widgets.md
```

And those documents establish:

```text
Architecture:
Widgets are presentational and cannot access runtime state directly.

Contract:
WidgetDefinition is the canonical public representation of a widget.

Implementation:
Runtime data is provided through WidgetContentProps.
```

Now the agent reaches the existing code with something it didn't have before:

**the ability to recognize that working code can still be wrong.**

Instead of copying the legacy pattern, it can report:

```text
The existing widget accesses runtime state directly, which conflicts
with the documented widget architecture.

I will not use this implementation as precedent until the
inconsistency is resolved.
```

That's a much more useful outcome than generating another technically valid implementation that quietly moves the architecture in the wrong direction.

## But documentation gets outdated

This is the obvious objection.

And it's true.

Making documentation authoritative does **not** mean assuming documentation is always correct.

It means architectural intent cannot be silently overwritten by implementation drift.

If the code changed because the architecture legitimately evolved, then the architectural decision should be updated and the documentation should change with it.

If the code changed accidentally, the implementation should be corrected.

But an AI agent shouldn't make that decision for us.

Its job when encountering ambiguity is to **surface the inconsistency**, not decide which version of reality becomes canonical.

That's why I don't think of documentation as automatically winning against code.

Neither side wins.

A disagreement means the system has entered an ambiguous state that requires a decision.

## Documentation becomes part of the development system

This changes documentation from something that explains the repository into something that actively participates in how the repository evolves.

Code tells the agent **what exists**.

Documentation tells it **what is intended**.

Contracts tell it **what other parts of the system are allowed to depend on**.

And when those sources disagree, the correct behavior isn't inference.

It's escalation.

We're currently using this approach to brief AI agents working in a production dashboard codebase: architecture rules, contracts, and implementation documentation as separate layers, each with clear ownership and a defined reading order.

The most useful rule has also been the simplest one:

**Ambiguity gets reported, never guessed away.**
