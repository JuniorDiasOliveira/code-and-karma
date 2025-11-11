---
title: "The Singleton Pattern in JavaScript"
excerpt: "From memory waste to efficient state: implement the Singleton Pattern for centralized JavaScript configuration"
date: "2025-11-05"
author: "Junior Oliveira"
tags: ["JavaScript", "Frontend", "NodeJS", "Design Patterns"]
readTime: "1 min read"
---


The Singleton pattern ensures a class has only one instance throughout your application and provides a single point of access to it.

🚀 Here are the advantages:

**Controlled Access:** centralizes how and where the instance is accessed, which avoids duplicated state (like a theme, for example).

**Global State Management:** this is ideal when you need a shared resource or configuration across your entire codebase (the theme, remember?).

**Resource Efficiency:** it avoids unnecessary memory usage by reusing the same object instead of creating multiple ones (less memory, boooy).

Here is a simple piece of code to create one manually:

```javascript
class AppConfig {
  constructor() {
    if (AppConfig.instance) {
      return AppConfig.instance;
    }
    this.settings = { theme: "dark", lang: "en" };
    AppConfig.instance = this;
  }

  get(key) {
    return this.settings[key];
  }

  set(key, value) {
    this.settings[key] = value;
  }
}

const config1 = new AppConfig();
const config2 = new AppConfig();

console.log(config1 === config2); // true
```

You can also mix both Singleton and [Observer](https://www.linkedin.com/pulse/observer-pattern-javascript-why-you-would-want-use-dias-de-oliveira-avfne) and create a mini Redux for your project 😁