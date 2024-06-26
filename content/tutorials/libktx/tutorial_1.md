---
title: "libGDX #1 - Introduction"
date: 2023-12-03
draft: false
tags:
  - libGdx
  - libKTX
  - Setup
image: /images/libktx_0.png
description: ""
sourceCode: https://github.com/GadWissberg/Tutorials_libGDX_1_Introduction
comments:
  url: https://gad-wissberg.netlify.app/tutorials/libktx/tutorial_1/
  identifier: tutorial_libgdx_0
---

## Introduction and Setup

Game development has always captivated me with its blend of coding, art, and design. It encompasses various elements that often contradict each other in fascinating ways. While I ventured into a more "business-driven" world of software development, my passion for learning and creating games never waned. I found myself drawn to the familiar ecosystem of my daily job in Java and discovered the perfect solution: *libGdx*, a Java game development framework that offers control over every aspect while providing tools to streamline development in desired areas.

After several years of using libGdx in Java, I yearned to expand my programming language skills and knowledge while continuing to utilize libGdx. That's when I stumbled upon *libKTX* - libGdx in Kotlin. Considering Kotlin's growing demand and usage worldwide, I felt compelled to explore it further. Thus, this series of tutorials aims to teach game development in libGdx using Kotlin. Although I don't consider myself a Kotlin master, I am still learning myself. Nonetheless, the focus remains on libGdx, as I have acquired sufficient knowledge of the framework to write tutorials and share them with anyone interested. Kotlin serves as the bridge to unlock the world of game development in this context, reminding us that teaching is a valuable learning experience in itself.

These tutorials do not require prior knowledge of Kotlin, but familiarity with an object-oriented language is recommended. Java is particularly beneficial as Kotlin is a JVM language and draws significant inspiration from it. The tutorials will cover game development elements including graphics programming, logic, and UI, so it is perfectly fine if you have no prior experience in any of these areas.


## Overall Glance
In this first tutorial we’ll only set up the working environment and have an overall glance on how libGdx is structured. Straight from libGdx [homepage](https://libgdx.com/): “libGDX is a cross-platform Java game development framework based on OpenGL (ES) that works on Windows, Linux, macOS, Android, your browser and iOS”. Simple as that. I will be using Android Studio (which is based on intelliJ) and aim for mobile game development - you may find [here](https://developer.android.com/studio/install) steps to install Android Studio including the Android SDK. But if you aim for Desktop/iOS/HTML, it’s fine since you write your game logic once and make the adjustments per platform. But it is strongly recommended to use intelliJ/Android Studio.

We’re gonna start off by creating the actual project itself. For this you can use the project generator mentioned in libGdx homepage, but unfortunately, (as of now) it doesn’t generate your project with the correct adjustments to use Kotlin, but only Java. For this I recommend to use *tommyettinger*’s [gfx-liftoff](https://github.com/tommyettinger/gdx-liftoff) which supplies what we want:

![title](1.png)

The first text box is the name of your project. The second is the name of the root package of the project (Convention is com.\<nameofyourcompany\>.\<projectname\>). The third is the name of the main class. The fourth is the location to create the project files and last one is the path to your already installed Android SDK. You may find this path in the SDK Manager inside Android Studio. For that we’ll suffice checking the Desktop and Android checkboxes. This will ensure to create 2 additional modules (in addition to the Core module which is mandatory), each one for the mentioned platform.
2 last things to make sure is in the Languages tab to check the Kotlin checkbox so we’ll have the created project configured to support Kotlin, and in the Templates tab, select Kotlin Logo. And that’s it - you may click Generate Project!. The generator will create the project files in the destination folder you gave.


## Enter the IDE
Using Android Studio, open the created folder as a project and give it a minute or two to build up and index. Once finished, your project view will probably look like this:

![title](2.png)

On your left you have the project tree in Android view, and as you can see, you have 3 modules: *core*, *android* and *lwjgl3*.
Core: This is where your game’s logic will be. You’re not supposed to have platform-specific code in it. Of course there are many times where that code needs to have interaction with platform related needs and for that you’ll use interfaces.

Platform-specific:
Android: All Android related code to run on Android will reside here - such as Android SDK uses.
Lwjgl3: lwjgl3 stands for Light-Weight Java Game Library. This library allows access to native media APIs (OpenGL, Vulkan, OpenAL, etc…) and therefore you can guess that this module is solely for running the game on the Desktop such as Windows, Linux and Mac.

No game logic is supposed to be in the platform-specific modules!

That’s it, we created our first project in Kotlin using libGdx. Let us now just make sure we’re able to run our project on both platforms we created - Desktop and Android.
Go to your *Lwjgl3Launcher* and click the green run icon next to the main() function. If you’ve done everything correctly you’ll see our game window:
![title](3.png)

For Android, you may run it on your physical Android device or an emulator. To launch it, you need to select the run configuration “android” in the top-right drop down menu and next to it select the device. I chose to run it on my device and it looks like this:
![title](4.png)

Note: If you’ve never developed an app, you first need to enable developer mode inside your device and enable “USB debugging”. [The following article explains it](https://www.digitaltrends.com/mobile/how-to-get-developer-options-on-android/). This step is already done in the emulator.

### To conclude
- We discussed briefly the libGdx’s structure - composed of the core module which holds the game logic and the platform modules for launching the game.
- We created our first libKTX project - Kotlin project integrated with libGdx.
- We launched our project on the Desktop and Android.
