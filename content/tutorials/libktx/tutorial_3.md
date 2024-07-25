---
title: "libGDX #3 - User Input"
date: 2023-12-03
draft: false
tags:
  - libGdx
  - libKTX
  - Input
image: /images/libktx_2.png
description: ""
sourceCode: https://github.com/GadWissberg/Tutorials_libGDX_4_scene2d
comments:
  url: https://gad-wissberg.netlify.app/tutorials/libktx/tutorial_4/
  identifier: tutorial_libgdx_3
---

## Reacting to the user’s input

Let’s not forget our goal in these series of tutorials - making games! A mandatory element that we’re going to touch (literally) in this tutorial is input from the player. Without input, we’re just creating a graphic application with a predefined logic. The interaction with it is one of the elements that makes it a game. An input includes a variety of types - keyboard, mouse, gamepad, screen touch (for mobile), etc… Not only a “touch” input is in our disposal - microphone, camera, gyro, nfc and much more are also inputs. Basically, every sensor that can receive a user’s interaction is translated into usable data and we can manipulate it in our code. In the following tutorial, we’ll focus on the mouse input (which is also the screen touch in our mobile). We’ll continue where we left off with our moving smiley and add the ability to make it move towards the point we click on the screen.

## Processing input

As introduced in the previous tutorial, libGdx provides us with a convenient class called Gdx to access certain data of media resources that our game uses. One of them is input. Although it is an interface, on runtime it gives us access to the current platform’s implementation. But what’s important is its setter of inputProcessor of type InputProcessor. We need it to pass our implementation of InputProcessor, and libGdx will take it from here triggering the implemented code according to the input event. So, we’ll begin by adding into our create() the following line:

```
Gdx.input.inputProcessor = this
```

What we basically do here is pass our main game class as the input processor. Of course, you’ll notice the error “Type mismatch: inferred type is LibKtxHelloWorld but InputProcessor! was expected” - this is because our main class does not implement the _InputProcessor_ interface yet. So let’s do that! We’ll add _InputProcessor_ to our main class declaration line:

```
class LibktxHelloWorld : ApplicationAdapter(), InputProcessor
```

Now we need to make sure our class implements each one of the interface’s methods. A quick way to add all of them is using AndroidStudio’s quick fix - put your cursor over the name of the class, let the error popup appear and click Implement members:

![title](1.png)

In the methods list dialog make sure all methods are selected and click OK to add them.
You’ll notice AndroidStudio has added them in the bottom of the class, each one with _TODO("Not yet implemented")_. You may replace each one of these TODOs with return false.

An important note: Generally, when writing code, it is important to keep your code clean. A more elegant solution here would be to create another class _GameInputProcessor_ which will implement by itself the _InputProcessor_ interface and have all the input related code reside in it. In the main class you’d just create an instance of _GameInputProcessor_ and pass it to _Gdx.input.inputProcessor_. This way we’re applying separation of concerns, encapsulating our input code in a specific place and keeping our main class more focused on other general logic. But in this tutorial we’re having our main class as the input processor just for brevity.

As we said in the beginning of this tutorial, we’ll make our smiley move towards the point we click on the screen. For that, we basically only need the _touchDown()_ method. This method is called each time the screen is touched (or the mouse was clicked on the desktop platform). So we’ll store the click position and have our smiley move towards it on every rendered frame in our game. Before we begin writing our logic, we’ll need to store the clicked position in an additional vector - so let’s add another one:

```
private val destination: Vector2 = Vector2()
```

In the method’s signature you’ll notice 4 parameters:
screenX - The X coordinate of the click position.
screenY - The Y coordinate of the click position (where the origin is on the upper left corner).
pointer - The pointer’s index. This is mostly relevant to mobile since the user can actually click on multiple positions on the screen. When developing for mobile, we want to be able to distinguish between multiple touches for many reasons.
button - The button index. On the desktop, this lets us know which mouse button was clicked. On mobile, this will always be Buttons.LEFT.

For our case, we only need the coordinates, so let’s store them in our new vector:

```
destination.set(screenX.toFloat(), Gdx.graphics.height - screenY.toFloat())
return true
```

Note I used the game’s screen height and subtracted the Y coordinate - meaning I mirrored the Y coordinate. This is because the Y coordinate we receive in this method is calculated given that the origin is on the upper left corner. But the Y coordinate we pass to the _batch.draw()_ is expected to be given where the origin is on the bottom left corner.

We set our vector with the new values (notice we’re provided with integers while the vector supports only float - thus the cast). In addition to that I changed the return value to true. Our code will work fine if this was returning false as well. This is a bit out of scope but basically what we do is return whether we want libGdx input handling to keep handling that specific input in additional input processors we have (which currently we have only one input processor so it’s not relevant). But we should stick to best practice and we consider that input as handled in this code so we return true.

Our next step is to make the smiley actually move towards the destination. We now have the destination position and the position of the smiley. Using these two vectors we need to update our velocity vector, which represents the smiley’s direction and speed. To do so, we’re going to apply subtraction on our two positions.
When you subtract one position vector (destination) from another (position), you perform element-wise subtraction of their components. This operation is defined as follows:

```
Vector C = destination - position
Cx = destination.x - position.x
Cy = destination.y - position.y
```

![title](2.png)

An example displayed on the Cartesian coordinate system.

The resulting vector C represents the difference in position between the points represented by vectors in both positions.
The direction of vector C is from the tip of vector position to the tip of vector destination. This is because when you subtract position from destination, you are effectively moving from the starting point of position to the ending point of destination. The resulting vector C points in that direction.
In a graphical sense, like in the image above, you can imagine vector C as an arrow that starts at the tip of vector position and points to the tip of vector destination. This is a way to represent how you would move from one point (the position represented by vector B) to another point (the position represented by vector A) in space.

So let’s write! Of course, the Vector2 class already has an implementation for this operation - _Vector2.sub(Vector2 v)_:

```
velocity.set(destination).sub(position).nor()
```

This line will replace our movement logic inside the _render()_ method we used for the previous tutorial. Our _render()_ should look like this now:

```
override fun render() {
    position.add(velocity)


    velocity.set(destination).sub(position).nor()


    Gdx.gl.glClearColor(0.15f, 0.15f, 0.2f, 1f)
    Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)


    batch.begin()
    batch.draw(image, position.x, position.y)
    batch.end()
}
```

Note we also used an additional method _nor()_. This normalizes the resulting vector. I don’t want to dive too much into Algebra in this tutorial, but what it involves is scaling it to have a length of 1 while preserving its original direction. In other words, you make the vector a unit vector. To normalize a vector, you divide each of its components by its magnitude (length) to ensure it points in the same direction but has a length of 1. This is useful to avoid our velocity to apply really big speed movement to the smiley in cases where the two positions are very far away. If you feel a bit lost in it, don’t worry, it’s not that necessary to fully understand it now.

You may now run the game, click on certain places in the screen and behold the smiley moving slowly towards the clicked position!
You’ll probably notice that the smiley moves in a way its left-bottom point reaches the destination position. It would have been more intuitive where the smiley will actually arrive at the destination with its center position. Well, that’s because the texture is drawn at its position with the origin point of _(0,0)_ of the texture. This means, we need to draw the smiley on its position with an horizontal and vertical offset. We want it centered so basically we need to draw with an horizontal offset in size of half smiley’s width. Same thing for vertical offset with the smiley’s height. To do that, we’ll modify a bit our drawing line:

```
batch.draw(image, position.x - image.width / 2F, position.y - image.height / 2F)
```

As you can see, we draw the smiley on his current position, move to the left side in a distance of the texture’s half width and move to the bottom side in a distance of the texture’s half height. Running the game will show us our smiley moving to the destination, arriving with its center position:

![title](3.png)

## Processing more input

Let’s improve it a little bit more - it’ll move as long the mouse clicks. That means, when the mouse button is released, the smiley will stop. Currently we only implement the _touchDown()_. We are going to implement _touchUp()_. As its name implies - it is called when the button is released. So, when it is released, we want the smiley to stop, which is basically no velocity:

```
override fun touchUp(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean {
  destination.set(position)
  return true
}
```

Once the button is released, we set the destination to be equal to the current position. Meaning nowhere to continue. Also, make sure to update the destination field where we create its vector to be equal to the initial position:

```
private val destination: Vector2 = Vector2(position)
```

This will make sure the smiley won’t start moving on its own when we start the game.

Another way to implement it will be to actually remove the line from _render()_ where we calculate the velocity and add it into the _touchDown()_:

```
override fun touchDown(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean {
   destination.set(screenX.toFloat(), Gdx.graphics.height - screenY.toFloat())

   velocity.set(destination).sub(position).nor()// Moved from render()

   return true
}
```

Then, change the _touchUp()_ to zero the velocity:

```
override fun touchUp(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean {
   velocity.setZero()
   return true
}
```

You basically got the same result but this approach is more correct since we let our velocity vector actually affect the movement direction and speed. Once the velocity is zero, we don’t move. Before you run it, make sure to zero the velocity vector when we create it (as it was originally _(1,0)_):

```
private val velocity: Vector2 = Vector2()
```

If you followed correctly, you got a smiley moving according to the mouse clicks and stops when the button is released.

As mentioned earlier, on the desktop these touch inputs are received from the mouse. On the mobile, these are actually the screen touches. When you run it on your mobile, every touch screen causes the smiley to move towards its position. When you touch with multiple fingers, the last touch in the sequence will be the destination. As mentioned, in the touch methods you have the pointer parameter which is the index of the touch point. This gives the flexibility to react accordingly with multiple touches (like certain gestures of zoom, sliding, etc)...

## To conclude

- We learned about Input Processors in libGdx.
- Implemented our own reaction to certain inputs.
