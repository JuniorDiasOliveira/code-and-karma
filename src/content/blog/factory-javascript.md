---
title: "The Factory Pattern in JavaScript"
excerpt: "Stop hardcoding object creation. Learn the Factory Pattern for cleaner, more maintainable JavaScript code"
date: "2025-11-05"
author: "Junior Oliveira"
tags: ["JavaScript", "Frontend", "NodeJS", "Design Patterns"]
readTime: "1 min read"
---

The **Factory Method** pattern helps you create objects in a cleaner way — you don't need to worry about _how_ they're built, just about _which_ type of object you need.

🚀 Going straightforward to the advantages:

**Encapsulation of Creation** – All logic for creating objects stays in one single place (avoiding duplicated code everywhere)

**Flexibility** – Oh well, easy to see in the example.

**Decoupling** – Clients depend only on abstractions, not concrete implementations (check the example below, line 17 onwards)

A simple piece of code for creating one manually:

```javascript
class Employee {
  work() {}
}

class Developer extends Employee {
  work() {
    console.log("Writing code 💻");
  }
}

class Designer extends Employee {
  work() {
    console.log("Creating mockups 🎨");
  }
}

class EmployeeFactory {
  static create(role) {
    if (role === "developer") return new Developer();
    if (role === "designer") return new Designer();
    throw new Error("Unknown role");
  }
}

// Usage
const dev = EmployeeFactory.create("developer");
const des = EmployeeFactory.create("designer");

dev.work(); // Writing code 💻
des.work(); // Creating mockups 🎨
```

**Note:** You can improve the code by replacing the if statements with a dictionary if that's the case., also, a factory method is much easier (and fun) to implement if you use TypeScript in your project. ;)

