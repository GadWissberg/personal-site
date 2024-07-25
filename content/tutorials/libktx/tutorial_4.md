---
title: "libGDX #4 - Scene2D"
date: 2024-07-25
draft: false
tags:
  - libGdx
  - libKTX
  - Scene2D
image: /images/libktx_3.png
description: ""
sourceCode: https://github.com/GadWissberg/Tutorials_libGDX_3_User_Input
comments:
  url: https://gad-wissberg.netlify.app/tutorials/libktx/tutorial_4/
  identifier: tutorial_libgdx_3
---

## Managing our world using Scene2D

After we gave a basic interactivity to our game with a single entity, you can see it can be expanded into unlimited ways. But if you think of it, when the game will have dozens or even hundreds of different entities where each one reacts differently to the environment and the player’s input, the code will quickly get messy and hard to maintain. Before we continue developing new features and ideas, it’s a good idea to stop and comprehend the need of managing the entities in our game’s world in a more organized and productive way. Sure, you can start adding arrays, lists, and other data structures to organize everything. But we aim in these tutorials to be exposed to as many available tools and libs which can provide us solutions to problems that probably others encountered before. For our needs, we’re gonna use _Scene2D_. _Scene2D_ is a module in libGdx serving as a scene-graph. A scene-graph is basically a graph data-structure (usually structured as a tree) which represents the logical and graphical representation of a graphic application. You may find more explanation regarding the definition of it in the excellent tutor [learnopengl.com](https://learnopengl.com/Guest-Articles/2021/Scene/Scene-Graph).
When using a scene-graph we can manage our game’s entities in an hierarchical manner. This means that not only can we manage the game's elements such as characters, obstacles etc, but also actually manage the UI elements too. Some use _Scene2D_ for the game-play elements only, some use it for UI only and some for both. Remember, libGdx is a framework and not an engine - hence you’re not restricted to the way you implement your game’s development and structure. In this tutorial we’ll create a very simple game in which smileys will pop up randomly on the screen, and the player’s target is to click them.

## Stop making a scene, it’s simple!

We’re gonna continue from the codebase of [tutorial 3](https://github.com/GadWissberg/Tutorials_libGDX_3_User_Input) although we’ll remove all of the LibktxHelloWorld class fields, remove the usage of InputProcessor and its overridden methods and clean the lifecycle methods too. Basically, our starting point is supposed to look like that:

```
class LibktxHelloWorld : ApplicationAdapter() {


   override fun create() {
   }


   override fun render() {
   }


   override fun dispose() {
   }


}
```

Before we begin coding, you should know that libKTX also contains modular utilities and extensions for various parts of libGDX (Visit libKTX Github page for detailed information [https://github.com/libktx/](https://github.com/libktx/). So although we can continue this tutorial using libGdx standard Java API, I think it is more appropriate and preferred to use the available utilities since we write in Kotlin. So for that we’ll add two additional imports. First, let’s add a new version value to our _gradle.properties_ file:

```
ktxVersion=1.12.1-rc1
```

And two additional dependencies in _core\build.gradle_, under the dependencies section:

```
implementation "io.github.libktx:ktx-actors:$ktxVersion"
implementation "io.github.libktx:ktx-scene2d:$ktxVersion"
```

The first one is a module of extensions for Scene2D GUI elements and the second one is a module of type-safe Kotlin builders for Scene2D GUI. You may find additional info on each one accordingly:

[https://github.com/libktx/ktx/tree/master/actors](https://github.com/libktx/ktx/tree/master/actors)

[https://github.com/libktx/ktx/tree/master/scene2d](https://github.com/libktx/ktx/tree/master/scene2d)

We’ll begin straight-forward with the subject: The stage. Let’s create a new instance of _Stage_:

```
private val stage by lazy { stage() }
```

Also, make sure to import

```
import ktx.scene2d.actors
```

It allows us to start using the Kotlin extensions module. In this case we use the stage() function to create our stage.

We declare the stage as a class property since we’ll be using it in several phases of our game’s life-cycle. Just like we saw earlier with Batch and Texture, the class Stage allocates memory (it implements Disposable) in its lifetime, thus we need to make sure we dispose it in order to avoid memory leaks:

```
override fun dispose() {
   stage.dispose()
}
```

One last thing left in order to have our stage ready to use. You might have guessed that we need to make sure our render() phase needs to be used. On each frame our game generates, we need to take into account everything that happens in the stage. That means it is our responsibility to update the stage’s state and call it to draw the whole scene-graph into our game’s canvas. For this need, Stage exposes 2 methods: _act()_ and _draw()_. The first takes care to update our stage’s state and all the entities inside it. The second, as it says, draws according to all the entities inside into our screen:

```
override fun render() {
   ScreenUtils.clear(Color.BLACK)
   stage.act()
   stage.draw()
}
```

_ScreenUtils_ is a convenient class that calls the _glClear_ methods we used earlier to clear our screen using openGL. So what happens currently in our game loop:
Clear the screen.
Update our stage.
Draw everything we got on the stage.
Great! We have a stage ready. Of-course, running our game will display you a complete black window since our stage is empty. It is time to bring in the actors.

## There are no small parts, only small actors

Just like a real stage in the theater, the whole activity is happening by the actors. Our stage will contain actors that behave in a defined logic in each new frame the stage renders. As we saw above, we call act() and draw(). These calls will be applied to each actor on the stage too. Our game will contain the mentioned smileys, so as you guess - each smiley is an actor. So let’s add them. First, we need the smiley texture as before:

```
private val smileyTexture by lazy { Texture("smiley.png") }

override fun dispose() {
   stage.dispose()
   smileyTexture.dispose()
}
```

Now we’ll create the smiley actor and add into our stage:

```
override fun create() {

  stage.actors {
    image(smileyTexture)
  }

}
```

First of all, we load up the smiley image file.
Then we create an instance of _Image_ using the _image()_, passing it the loaded texture. The _Image_ class inherits a class called _Widget_, which inherits _Actor_ - so basically our instance is an actor. Then we insert the actor into our stage instance using the _actors()_ function via the trailing lambda. On default, when creating an actor, its location is x=0, y=0. Meaning, it is positioned at the bottom left, originating with its bottom left point. Before we launch to see the result, let’s make it a bit dynamic by setting its position random in the screen via the _image()_ trailing lambda:

```
override fun create() {

  stage.actors {

    image(smileyTexture) {

      val halfWidth = it.width / 2F
      val halfHeight = it.height / 2F
      val randomX = MathUtils.random(stage.width)
      val randomY = MathUtils.random(stage.height)
      val clampedX = MathUtils.clamp(randomX, halfWidth, stage.width - halfWidth)
      val clampedY = MathUtils.clamp(randomY, halfHeight, stage.height - halfHeight)
      it.setPosition(clampedX - halfWidth, clampedY - halfHeight)

    }
  }
}
```

Let’s break it down:

1. We calculate its half dimensions and store it in local variables for convenience.

```
val halfWidth = it.width / 2F
val halfHeight = it.height / 2F
```

2. We generate random coordinates in the range of [0, ScreenResolution]. We use _MathUtils.random()_ to generate a random value in the range [0,dimension-size). _MathUtils_ is a collection of useful math functions included in libGdx. The public field width and height are provided in the Stage class to obtain its dimensions - which in our default case equals to our game screen dimensions.

```
val randomX = MathUtils.random(stage.width)
val randomY = MathUtils.random(stage.height)
```

Now each time we’ll start the game, the smiley will appear in a random position:

![title](1.png)

Our next step is to make the smiley pop in random positions. To apply such logic, let me introduce you to a very useful mechanism in the Stage class: _Actions_. An action in the Stage scene graph is basically a runnable that runs and gets triggered with a predefined logic, and is handled by the scene graph. There are many ready-made actions in the _Actions_ class, and you can also define your own. For our usage, let’s break down the smiley’s logic into actions:

- Apply infinitely the following action:
  - Apply the following actions sequentially: - Apply the following action with a delay of 1 second: - Scale down the smiley to a size of complete 0 in duration of 2 seconds. - Position the smiley in a new random place. - Apply the following action with a delay of 1 second - Scale up the smiley to the original size in duration of 2 seconds. - Wait for 4 seconds.
    Each line is an action! Let’s see this interpreted into code:

```
it.addAction(
   Actions.forever(
       Actions.sequence(
           Actions.delay(1F, Actions.scaleTo(0F, 0F, 2F)),
           Actions.run { putSmileyInRandomPosition(smileyA) },
           Actions.delay(1F, Actions.scaleTo(1F, 1F, 2F)),
           Actions.delay(4F)
       )
   )
)
```

Each method of Actions creates an action. The overall method _forever()_ receives the complex action and returns an action that runs forever the given sequence of actions. This action is added to the actor and will automatically be handled in the stage. This is the modified create():

```
override fun create() {
   stage.actors {

       image(smileyTexture) {

           setOrigin(Align.center)

           putSmileyInRandomPosition(it)

           it.addAction(
               Actions.forever(
                   Actions.sequence(
                       Actions.delay(1F, Actions.scaleTo(0F, 0F, 2F)),
                       Actions.run { putSmileyInRandomPosition(it) },
                       Actions.delay(1F, Actions.scaleTo(1F, 1F, 2F)),
                       Actions.delay(4F)
                   )
               )
           )

       }
   }
}


private fun putSmileyInRandomPosition(it: Actor) {
   val halfWidth = it.width / 2F
   val halfHeight = it.height / 2F
   val randomX = MathUtils.random(stage.width)
   val randomY = MathUtils.random(stage.height)
   val clampedX = MathUtils.clamp(randomX, halfWidth, stage.width - halfWidth)
   val clampedY = MathUtils.clamp(randomY, halfHeight, stage.height - halfHeight)
   it.setPosition(clampedX - halfWidth, clampedY - halfHeight)
}
```

You may notice I added a call of _setOrigin()_ with center. This is mainly for making the smiley scale down to its center point and not to its left-bottom point. I also extracted the position logic to a private method for reuse and called it once on creation and in the run action which lets us run our own code. Once you run it, you’re supposed to see the smiley appear in different positions, with the scaling animation.

Let’s upgrade our scene a bit - have multiple smileys! What this means is we’re gonna have now multiple actors. The actors have the same definition so we’re gonna reuse our code:

```
override fun create() {
   stage.actors {
       addSmiley()
       addSmiley()
       addSmiley()
   }
}


private fun @Scene2dDsl StageWidget.addSmiley() {
   image(smileyTexture) {

       setOrigin(Align.center)

       putSmileyInRandomPosition(it)

       it.addAction(
           Actions.forever(
               Actions.sequence(
                   Actions.delay(1F, Actions.scaleTo(0F, 0F, 2F)),
                   Actions.run { putSmileyInRandomPosition(it) },
                   Actions.delay(1F, Actions.scaleTo(1F, 1F, 2F)),
                   Actions.delay(4F)
               )
           )
       )


   }
}


private fun putSmileyInRandomPosition(it: Actor) {
   val halfWidth = it.width / 2F
   val halfHeight = it.height / 2F
   val randomX = MathUtils.random(stage.width)
   val randomY = MathUtils.random(stage.height)
   val clampedX = MathUtils.clamp(randomX, halfWidth, stage.width - halfWidth)
   val clampedY = MathUtils.clamp(randomY, halfHeight, stage.height - halfHeight)
   it.setPosition(clampedX - halfWidth, clampedY - halfHeight)
}
```

Easy! We extracted the actor creation piece of code into an extension method of _StageWidget_ (A widget class in the ktx.scene2d module used for adding actors directly to the stage) and called it 3 times! (Kotlin’s official documentation for extension classes - [https://kotlinlang.org/docs/extensions.html](https://kotlinlang.org/docs/extensions.html)). We also add the _@Scene2dDsl_ annotation to indicate that this function is part of the custom DSL for Scene2d. It’s just for good practice although it’ll also work without it. Each call creates a new actor and inserts it into our stage:

![title](2.png)

## Time for Some Interactivity!

As we said earlier, this game will be about catching the random smileys. So what we need to do is to add to each smiley a click listener. Once the click event is triggered on it, the smiley will be removed from our scene. And to avoid our game to be done quickly, we’ll create a new smiley once the clicked smiley is removed. So let’s modify our addSmiley():

```
private fun @Scene2dDsl StageWidget.addSmiley() {
   image(smileyTexture) {

       setOrigin(Align.center)

       putSmileyInRandomPosition(it)

       it.addAction(
           Actions.forever(
               Actions.sequence(
                   Actions.delay(1F, Actions.scaleTo(0F, 0F, 2F)),
                   Actions.run { putSmileyInRandomPosition(it) },
                   Actions.delay(1F, Actions.scaleTo(1F, 1F, 2F)),
                   Actions.delay(4F)
               )
           )
       )

       it.addListener(object : ClickListener() {
           override fun clicked(event: InputEvent?, x: Float, y: Float) {
               stage.actors {
                   addSmiley()
               }
               it.remove()
           }
       })
   }
}
```

As you can see, we used the Actor’s _addListener()_ and passed it a callback to be triggered once we click inside the actor’s bounding box. The stage ecosystem handles for us this bounding box check. In the callback we call again our good old addSmiley() and then call _remove()_ which removes the actor from its parent - in our case the direct parent is the stage itself. Run it now, and try to catch the smileys! Wait, what? It doesn’t work! Well, we forgot something - initializing the input processor! As we saw in the previous tutorial, libGdx expects us to provide an instance that implements InputProcessor. What a good relief - The Stage class implements InputProcessor :) So all we got to do is to provide it on the beginning:

```
override fun create() {

   Gdx.input.inputProcessor = stage

   stage.actors {
       addSmiley()
       addSmiley()
       addSmiley()
   }
}
```

Now you should be able to catch the smileys with the mouse - or click on it with the touch screen on the mobile. Each click will create an additional smiley!

So as you can see, using a scene graph like Stage is very convenient, clean and easy. The game can get really big and full of certain elements and entities, so it is very recommended to use ready-made tools to help organize everything.

## To conclude

- We introduced the Stage class, the actors in it and the concept of the graph scene.
- Learned to apply certain actions on actors.
- Applied interactivity using a click listener.
