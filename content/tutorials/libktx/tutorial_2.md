---
title: "libGDX #2 - Hello World!"
date: 2023-12-03
draft: false
tags:
  - libGdx
  - libKTX
  - HelloWorld
image: /images/libktx_1.png
description: ""
sourceCode: https://github.com/GadWissberg/Tutorials_libGDX_2_Hello_World
comments:
  url: https://gad-wissberg.netlify.app/tutorials/libktx/tutorial_2/
  identifier: tutorial_libgdx_1
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

![title](1.png)

So if we look at our main class as mentioned, this is what we got:

```
class LibktxHelloWorld : ApplicationAdapter() {

    private val batch: SpriteBatch by lazy { SpriteBatch() }
    private val image: Texture by lazy { Texture("libgdx.png") }

    override fun create() {
    }

    override fun render() {
        Gdx.gl.glClearColor(0.15f, 0.15f, 0.2f, 1f)
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)
        batch.begin()
        batch.draw(image, 140f, 210f)
        batch.end()
    }

    override fun dispose() {
        batch.dispose()
        image.dispose()
    }
}
```

Following our previous tutorial, all this does is to display the libGdx logo with a gray background. The actual code in the overridden methods are not really important, but it’s nice to see the use of the life-cycle here: Although the create event is empty, we initialize our batch instance and load the png file using Kotlin's _lazy_ function. Everything we put in the create event will be executed once libGdx has been initialized. In the render event (which is called for every frame in our game) we clear the screen with gray color, and then draw the image. And in the dispose event we’re just freeing up allocated memory.
As you can see, using the life-cycle’s methods, we can decide what to do at any particular time in our game’s application.

## A picture is worth a thousand words

Now that we know how to deal with our game’s life-cycle, we can start adding some life into it. Images are a really useful way to apply ideas. A pack of colored pixels that express characteristics, world and mood. As mentioned, for this tutorial we’ll load up a single image and apply movement on it.
On the default libGdx project setup, we got a folder named assets (in the same folder level of the core, android and desktop folders). As its name implies, we’ll put inside all of our project’s assets - images, sound files, fonts and any other binary file we wish to be loaded into our game at runtime in order to use it. We’re gonna put inside the folder a free to use image file smiley.png I found online:

![title](2.png)

You may remove the _libgdx.png_ file as we won’t need it.
Whether you know that or not, PNG (Portable Network Graphics) format is the recommended format to use for image assets in game development, web design and general user-interfaces. The reason is its support for lossless data compression and transparency. Of course there are dozens of other formats with certain advantages (like SVG for vector based, JPG for large images with high amount of details and etc…) but PNG is considered to fit most for our purpose.
As you can probably guess, we’re gonna need to update our code to support the new file (and avoid using the old one). The change will only take place in the Texture creation:

```
    private val image: Texture by lazy { Texture("smiley.png") }
```

Run the project and you’ll notice the new image is displayed. Now we’ll understand a bit more about that code.
First, we create an instance of the _SpriteBatch_ class. This instance will be our tool to handle drawing onto the screen.
Secondly, we create an instance of the Texture class and give it the name of our image file. Textures are the way we load images onto our GPU (Graphics Processing Unit) memory. Yes, this small game is using your GPU. Some of you probably know this term in relation to modern AAA games on PC, consoles and all other platforms. libGdx uses the GPU to draw graphics (using openGL). This is an advantage since we take out responsibility from our CPU to do this job and let it focus on the other logic the game needs. Of course in today's terms, the CPUs are really efficient, fast and can even handle this job in a certain manner, but since GPUs are present in almost every device with a screen, there’s no reason not to use it.
Once we’ve created our Texture, we’re ready to draw it. Our _render()_ is already drawing it - let’s explain it a bit more:

```
override fun render() {
  Gdx.gl.glClearColor(0.15f, 0.15f, 0.2f, 1f)
  Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)
  batch.begin()
  batch.draw(image, 140f, 210f)
  batch.end()
}
```

The first line sets the color to use when we clear our game’s window - given color (RGB and Alpha for transparency).
The second line clears the game’s window with the color we set in the previous line.
In the third line we begin the drawing process (for the current frame).
In the fourth line we draw the texture we loaded, at the position of _x=140f_, _y=210f_ on our game’s window.
The last line ends the drawing process. It is mandatory to end the drawing process.
As mentioned before, _render()_ is called for each frame in the game - as we’re aiming on default to 60 FPS, it means this whole process runs 60 times per second.
One last thing to mention is the _dispose()_. Although Kotlin is a JVM language and uses a garbage collector, we do still allocate memory which is out of the scope of the GC (like the image we loaded onto the GPU). It is important to release that allocated memory to avoid memory leaks.

## Moving on to apply movement

Now that we’re more aware of what we do when adding an image asset to our program, let’s give it a bit of life. We’re going to apply a simple horizontal movement in order to show how we can manipulate our data using the _render()_. The movement will be dictated as follows: we begin moving our image to the right. Will move it ‘till its right edge reaches the right side of the screen. When it reaches, we’ll begin moving it left. When its left edge reaches the left side of the screen, we return to move it right. And we shall repeat forever.

First, we need to define some variables to represent our image’s movement. Currently it is nothing but a matrix loaded into the GPU. Basically, we need to store the current position of the image and its velocity. We can do this by creating several float variables and changing them accordingly. But since we’re already in a friendly game dev framework, we can do this more elegantly by creating a pair of 2D vectors:

```
private val position: Vector2 = Vector2(140f, 210f)
private val velocity: Vector2 = Vector2(1F, 0F)
```

If you’re not familiar with vectors, no worries. I’m not going to dive much into their meaning and uses in this tutorial but you should know that vectors are heavily used in computer graphics and game development (and basically in every other scientific field). libGdx provides wonderful math functionality to use quickly. You only need to know for now that a vector is an array of numbers, and in our case we use 2D vectors (two-dimensional, so it has 2 numbers) since we work here on a 2D program - thus our vectors represent the Cartesian coordinate system (x and y) and provide us a direction and a size.
Looking at our new pair, position is basically (x,y) coordinates - set to the position we already have in the _render()_. For velocity we have set _(1,0)_ - You can imagine an arrow originated at _(0,0)_ points to _(1,0)_, ending up to be an arrow pointing to the right. We basically set our velocity’s direction to the right. If we had set _(-1,0)_ it would be to the left.

![title](3.png)

Our velocity vector displayed on the Cartesian coordinate system.

Now we got to the fun - some logic! First, we’re gonna need to use our position vector. We do this by replacing the hard-coded coordinates in _batch!!.draw()_ with our vector’s coords:

```
batch.draw(image, position.x, position.y)
```

If you run it, nothing will change of-course, since the position vector is not changed at all.
To apply the velocity vector on our position vector what we need to do is basically add the velocity to our position. Addition between two vectors in the same dimension (2 in our case) is straightforward: _(x1,y1)+(x2,y2)=(x1+x2,y1+y2)_. Since we’re already using the Vector2 class, we got these basic functionalities to use:

```
position.add(velocity)
```

We’re gonna put it right before we do any drawing related code - that means in the first line of _render()_:

```
override fun render() {
  position.add(velocity)

  Gdx.gl.glClearColor(0.15f, 0.15f, 0.2f, 1f)
  Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

  batch.begin()
  batch.draw(image, position.x, position.y)
  batch.end()
}
```

Run it, and you’ll see the smiley moves to the right (eventually out of the game’s screen):

![title](4.png)

Basically what happens now is for each rendered frame in our game, we add an amount of 1 unit to our position X coordinate and we draw the smiley in the new position. Playing these frames together at a rate of about 60 FPS gives the illusion of the smiley actually moving!
As we said we want to make it move left when it touches the right edge and right when it touches the left edge. So it means for each frame we’ll check if the current X value of the position + the width of the image is equal or larger than our game’s screen width. The reason we add the image’s width value is because the origin point of our image is on default _(0,0)_. That means, for a given X and Y coordinates, we begin to draw the image’s pixels starting on its local axis _(0,0)_ point. In addition to that, we also want to do the same check for the left edge. Since our origin point is _(0,0)_, we only need to check if the position’s X value is equal or smaller than 0.
libGdx provides us with a convenient class called Gdx to access certain data of media resources that our game uses such as graphics, audio, files, network, logging and more… What we need is our game’s resolution width value and use it in our logic. So our _render()_ should like this now:

```
override fun render() {
    position.add(velocity)

    if (position.x <= 0F || position.x + image.width >= Gdx.graphics.width) {
        velocity.scl(-1F)
    }

    Gdx.gl.glClearColor(0.15f, 0.15f, 0.2f, 1f)
    Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)

    batch.begin()
    batch.draw(image, position.x, position.y)
    batch.end()
}
```

For each frame, before we draw it, we check both edges. If we’re outside, we simply multiply our vector by -1. Multiplying a vector with a number (called scalar) is basically just multiplying each number in the vector with it (thus scaling it). In our case, Y=0 so nothing changes on that axis. Only the X changes accordingly.
If you have followed correctly, running it will result with the smiley starting to move right, touching the right edge of the game’s screen and then changing to left ‘till it reaches the left edge and returning to right - going like infinitely.

There’s nothing special platform-wise, so you basically see the same thing on your Android or any other platform you chose.

### To conclude

- We learned the framework’s lifecycle and how to use it to our needs.
- Added our own asset - an image.
- Applied movement on our image using vectors with a very basic collision check with the game’s screen edges.
