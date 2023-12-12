---
title: "Hello World!"
date: 2023-12-03
draft: false
tags:
  - libGdx
  - libKTX
  - HelloWorld
image: /images/logos.png
description: ""
---

## Hello World!

Every programming tutorial series should commence with a fundamental foundation. This initial step serves as a brief and straightforward introduction, allowing us to become more acquainted with the framework. Building upon the overview provided in the previous tutorial, this "Hello World" tutorial will delve into understanding the framework's lifecycle, adding an image, and applying movement on it. I don’t know about you, but I always liked to get immediately into the practical part of the learning process. But as I grew older, I understood that it is very lucrative to hold on for a minute and understand what am I dealing with.

## Circle of life… cycle

As like every software, our game’s states are represented in a life-cycle. In our core module, where the game’s logic resides (not related to any platform code), we have our main class.
As you can see, when we generated our project with the project generator, it had created that class which extends the ApplicationAdapter class. This allows us to use the framework’s life-cycle. Currently, it is overriding only 3 life-cycle methods: **create()**, **render()** and **dispose()**. Each method is called at a particular time throughout our game:
**create()** - Called when the game starts. 
**render()** - Called for each frame in our game.
**dispose()** - Called when the game ends.
There are 3 more which we currently don’t override:
**resize(int width, int height)** - Called when the game’s window resizes (e.g. on the desktop, the window of the game’s process itself is resized. In Android, when the game goes from portrait display to a landscape display).
**pause()** - Called when the game’s process loses focus (e.g. on Android when we switch to another app).
**resume()** - Called when the game is focused again.

Below you can see a clear graph (from the libGdx website: https://libgdx.com/wiki/app/the-life-cycle) displaying the possible transitions between the states:
