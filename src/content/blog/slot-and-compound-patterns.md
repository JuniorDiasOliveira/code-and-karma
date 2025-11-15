---
title: "Slot Pattern & Compound Components"
excerpt: "Two of the most interesting patterns for React developers"
date: "2025-11-15"
author: "Junior Oliveira"
tags: ["JavaScript", "Frontend", "NodeJS", "Design Patterns", "React"]
readTime: "5 min read"
---

## What I Learned While Building Scalable Front end Systems

Front-end applications of today require components which offer flexibility and composability yet their expansion leads to excessive prop usage and restricted structural control. The solution to this problem involves using two essential React patterns which include **Compound Components** and the **Slot Pattern.**

The two patterns enable developers to construct complex user interfaces through scalable methods which suit specific development needs. The article presents essential knowledge about creating flexible system architectures for <U>layouts</U> and <U>dashboards</U> and <U>complex component systems</U>.

---

# Understanding Compound Components

<U>Compound Components split a parent into smaller, well defined parts</U>. The parent manages state and logic, while the child components form the structure.

```tsx
<Modal>
  <Modal.Header />
  <Modal.Body />
  <Modal.Footer />
</Modal>
```

This model works when the structure is predictable and when the parent needs tight control, such as in:

- Modals

- Accordions

- Dropdowns

- Tabs

-  Navigation elements

### Advantages

- The API stays clean and minimal

- Each subcomponent has a clear purpose

- Logic and behavior stay centralized

- Readable composition that feels natural

### Challenges

- TypeScript can get verbose when validating children

- Subcomponents often rely on React Context

- Context in React Server Components forces "use client"

This last point becomes a major obstacle when building systems in environments where server components are preferred. To avoid turning everything into a client component, I replaced **React Context** with a lightweight [Observer pattern](/post/observer-javascript). It allows communication between components without forcing a client boundary.

* * * * *

A Compound Component using the Observer Pattern
===============================================

No Context and no "use client" required
---------------------------------------

Based on the example from above, here is how we should implement our own Subject/Observer and then use it in a Compound Component context:

```tsx
export class Subject<T = any> {

  private observers = new Set<(data: T) => void>();

  subscribe(fn: (data: T) => void) {
    this.observers.add(fn);
    return () => this.observers.delete(fn);
  }

  unsubscribe(fn: (data: T) => void) {
    this.observers.delete(fn);
  }

  notify(data: T) {
    this.observers.forEach(fn => fn(data));
  }

}
```

```tsx
// Modal.tsx (server component)

import { Subject } from "./observer";

export type ModalEvents =
  | { type: "header-mounted" }
  | { type: "body-mounted" };

//main component
export function Modal({ children }: { children: React.ReactNode }) {
  const subject = new Subject<ModalEvents>();
  return (
    <div data-modal>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { subject });
      })}
    </div>
  );

}

//modal header
Modal.Header = function Header({ subject }: { subject: Subject<ModalEvents> }) {
  React.useEffect(() => {
    subject.notify({ type: "header-mounted" });
  }, [subject]);
  return <header>Header</header>;
};

//modal body
Modal.Body = function Body({ subject }: { subject: Subject<ModalEvents> }) {
  React.useEffect(() => {
    const unsub = subject.subscribe(event => {
      if (event.type === "header-mounted") {
        // do something
      }
    });
    subject.notify({ type: "body-mounted" });
    return unsub;
  }, [subject]);

  return <main>Body</main>;

};

//modal footer
Modal.Footer = function Footer() {
  return <footer>Footer</footer>;
};
```

By using the `Subject`/`Observer` mechanism you decouple internal state and communication without forcing the component into a client-only environment. This preserves compatibility with server components while enabling sub-components to communicate and react.

* * * * *

When Compound Components Start to Break
=======================================

Compound Components are great for behavior-driven UI, but they become messy when dealing with:

- Many optional regions

- Large, layout-driven components

- Scenarios where developers need full control over structure

- Complex admin panels or dashboards

Trying to support too many subcomponents results in an API that becomes hard to document and hard to use.

This is where the Slot Pattern shines.

* * * * *

The Slot Pattern
================

A More Flexible Approach for Layout-driven Components
-----------------------------------------------------

The **Slot Pattern** is inspired by [Web Components](https://open-wc.org/codelabs/basics/web-components#0). The idea is simple: a parent component defines named regions and consumers fill those regions with their own content.

```tsx
<AppFrame>
  <AppFrame.Slot name="sidebar">
    <Sidebar />
  </AppFrame.Slot>

  <AppFrame.Slot name="header">
    <Header user={user} />
  </AppFrame.Slot>

  <AppFrame.Slot name="content">
    <Dashboard />
  </AppFrame.Slot>

  <AppFrame.Slot name="footer">
    <Footer />
  </AppFrame.Slot>
</AppFrame>
```

This works beautifully for:

- App shells

- Workspaces

- Admin panels

- PDF viewers

- Dashboard widgets

- Any component where layout is the main purpose

### Why the Slot Pattern Works

- Named regions are explicit and predictable

- No need for child type validation

- Not tied to React Context

- Much more flexible than props

- Perfect for highly configurable design systems

* * * * *

Building a Slot Pattern From Scratch
====================================

Here is a minimal and effective implementation:

```tsx
export function AppFrame({ children }: { children: React.ReactNode }) {

  const slots = new Map<string, React.ReactNode>();

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return;
    if (child.type === Slot && child.props.name) {
      slots.set(child.props.name, child.props.children);
    }
  });

  return (
    <div className="app-frame">
      <aside>{slots.get("sidebar")}</aside>
      <header>{slots.get("header")}</header>
      <main>{slots.get("content")}</main>
      <footer>{slots.get("footer")}</footer>
    </div>
  );

}

type SlotProps = { name: string; children: React.ReactNode }
export function Slot({ name, children }: SlotProps) {
  return null;
}

AppFrame.Slot = Slot;
```

* * * * *

When to Use Each Pattern
========================

### Use Compound Components When

- A component has a predictable structure

- Behavior is central and controlled by the parent

- Subcomponents must share state or events

- A guided API is desirable

### Use Slot Pattern When

- You are building layout driven components

- You want consumers to fully customize internal placement

- The number of regions is large or optional

- You want Web Component style flexibility

* * * * *

Final Insight
=============

Compound Components solve behavior

- Slot Pattern solves structure

- Both patterns are essential in a modern design system.

- Compound Components unify logic and interactions

_while_

- Slots empower developers to structure UI freely and intuitively.

The <u>combination</u> of both results in highly scalable components that can support complex applications without compromising flexibility or readability.