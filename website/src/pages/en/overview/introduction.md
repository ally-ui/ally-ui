---
title: Introduction
description: An open-source widget library for building high-quality, accessible web applications on all UI frameworks
layout: ../../../layouts/MainLayout.astro
tableOfContentsMaxDepth: 2
---

Ally UI is a low-level component library that aims to create accessible patterns for all UI component frameworks while providing an amazing developer experience.

## Vision

When building web applications, most developers implement the same design patterns like dialogs, dropdowns, checkboxes, and more. These UI patterns are [documented by WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/) and are generally understood by the developer community.

However, implementation details are often left as an exercise to the reader. While the WAI-ARIA standards are a good starting point, they often need more customization and functionality to meet today's production standards.

So, developers are responsible for the incredibly difficult task of building compliant accessible components. As a result, implementation quality varies between web applications; most are inaccessible, non-performant, or lack features.

Developers have built and open-sourced component libraries to address these issues before, but we were unsatisfied with the existing solutions:

* Many libraries are opinionated and attached to existing design systems. While these are great for early development, it usually becomes a challenge to customize and style the components to suit our needs.
* Because we love developer flexibility, we encourage the use of different UI frameworks on different projects. However, existing component libraries are often built for specific UI frameworks. This meant using different tools for different projects

Our goal is to create a open-source component library that you can use and improve on to build accessible web applications.

## Key Features

### Accessible

Widgets adhere to the [WAI-ARIA design patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) where possible. Ally UI handles all of the difficult implementation details related to accessibility -- aria and role attributes, focus management, and keyboard navigation. 

### Composable

Widgets are built by composing primitive components together. This gives you granular access to each component part so you can customize them with your own event listeners, props, and refs.

### Unstyled

Ally UI components ship with zero styles, thereby giving you complete control over styling. We follow best practices for building unstyled components in every UI framework we support. This means you can use your favorite styling solution no matter what UI framework you use.

### Uncontrolled

Widgets manage state internally by default, but also provide escape hatches for manual control. This means you can get started quickly without needing to create any local states, then opt into controlled state when you need more control.

### Enjoyable

We aim to make accessibility easy and fun for developers. This starts with an API that is fully-typed, consistent, and predictable across all widgets. We also follow the conventions used in every UI framework we support so Ally UI always feels native.

### Incremental

Each widget can be installed individually so you can adopt them incrementally.

```
npm install @ally-ui/react-dialog
```

## Community

### GitHub

Ally UI is an open source project and contributions from developers like you are how we grow! We are always looking for developers who are passionate about the web to help guide the direction of Ally UI.

[Join us on GitHub](https://github.com/ally-ui/ally-ui)

### Discord

To get involved with the Ally UI community, ask questions, share tips, or suggest new features, join our Discord!

[Join us on Discord](https://discord.gg/VUgBbmQeMv)

### Twitter

Follow us on Twitter to receive updates on new components, announcements, and general Ally UI tips.

[Follow us on Twitter](https://twitter.com/ally_ui)
