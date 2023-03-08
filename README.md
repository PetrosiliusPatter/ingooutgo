# IngoOutgo

[![IngoOutgo CI](https://github.com/petrosiliuspatter/ingooutgo/actions/workflows/main.yaml/badge.svg)](https://github.com/petrosiliuspatter/ingooutgo/actions/workflows/main.yaml)

A framework for node-based applications. Fork of Emil Widlund's amazing [Nodl](https://github.com/emilwidlund/nodl).

Improvements on the original Nodl:

- UI improvements
  - UI is themable, using classnames and css variables
  - Connections between nodes can be customized
  - Connections snap to compatible sockets when connecting them
  - Nodes can be defined with accent color and a neat icon
  - Fields for nodes can be defined with custom UI components
  - Selecting nodes feels a bit nicer (opinionated)
- Node actions (coming soon)
- Wrapping nodes into one bigger node (coming soon™)
- Moooore to come

## Packages

Just like Nodl, IngoOutgo is divided up into a core package, and a UI package, which implements components for Nodl's visual vision.

### @ingooutgo/core

The core implementation of the IngoOutgo framework. Exposes utilities and functions to define computational graph.

[See package](packages/core)

### @ingooutgo/react

A React based UI for IngoOutgo. Exposes components & utilities for rendering an IngoOutgo canvas.

[See package](packages/react)

---

## General information

### Before the fork

I was working on a node editor last year, the original IngoOutgo. Much like Nodl, I split it into a core and a UI package.
The UI turned out pretty good! And I had even more plans for the project. Sadly, I became discontent with my code for the core, as I made some uninformed decisions early in the project. Thus it was never published, and the project just lay dormant.

### Why the fork

The logic beind the nodes works much better than my implementation did, I especially like the use of RxJS. So I decided to leverage it
Since the project structure was so similar, it actually only took me a week to make my UI work with the nodl core.

However, I did have to change one or two things in the core as well.. Minor things, but none that made sense to make a PR for, since they really were done with my UI in mind.
I got even more ideas that I want to implement into my node editor, and don't wish to have to compromise with Emil's vision for his.
_Plus, I prefer my code formatting lol_
Thus the fork!

### Which should you use

There are a few reasons why you might want to choose the original Nodl over this fork.
I built my node editor as a tool for other projects of mine, so this is really just a small side project for me. I might decide to radically change things without regard for other people using it.
This is also my first open source project, so I'm still green behind my ears when it comes to maintenance and support in general.

That being said, I think my UI has some nice things going for it! If you really prefer the look and feel over the one of the original, then this might be for you!

### Contributing

Uhhhh, if you wish to add something, feel free to shoot me a message!
