---
title: "The Observer Pattern in JavaScript"
excerpt: "Build reactive applications: how the Observer Pattern eliminates manual UI updates in JavaScript"
date: "2025-11-05"
author: "Junior Oliveira"
tags: ["JavaScript", "Frontend", "NodeJS", "Design Patterns"]
readTime: "1 min read"
---

The Observer pattern lets different parts of your code automatically react when something changes, by "subscribing" to updates.

🚀 Going straightforward to the advantages:

**Decoupling:** Details about the observer and subject are not required for each other.

**Scalability:** Behaviors can be added, changed, removed or streamlined, and interchangeably without affecting the core logic.

**Reactivity:** The main point. Change data, and update the UI without manual intervention.

A simple piece of code for example of creating manually:

```javascript
class Subject {
  constructor() {
    this.observers = [];
  }
  subscribe(fn) { this.observers.push(fn); }
  unsubscribe(fn) { this.observers = this.observers.filter(obs => obs !== fn); }
  notify(data) { this.observers.forEach(fn => fn(data)); }
}

// Example usage
const news = new Subject();
const showHeadline = headline => console.log(`Headline: ${headline}`);

news.subscribe(showHeadline);
news.notify("Observer Pattern makes your life easier!");
```

Even if you use technologies such React, understanding the Observer Pattern can also help you decide whether your project really needs a solution like Redux (which is heavy), or if a simpler approach (like a custom observer implementation) is more than enough.
