# README #

This README would normally document whatever steps are necessary to get your application up and running.

### ODIE concepts ###

Odie is a game engine that mixes the good bits of entity components systems with the flexability of javascript.
Fundamentally it relies on a few key building blocks that pretty much anything can be built with.

Entity
A game element. As a loose rule it does do much on its own. Components can be added to it that give it functionality. Rather than using inheritance a entity can be composed of many components.

Components
A component is should be used to add logic and functionality to you entity. Generally a component should have a fairly focused task. In ODIE every component will have functions called on it automatically as when attached to an entity depending on its life cycle. generally it goes:

init() // called when the Entity is retreived from the pool
addedToScene() // called when the entity is aded to the game
start() // called the first time an entity is updated in the game
update() // called each tick
render() // called each render
removedFromScene() // whan the entity is removed from the game
reset() // when returned to the pool

Game
A single game element, this is what manages the entities and game systems. Game logic is contained in systems.

System
Systems are great for managing many entities or broader parts of your game. They have the same structure as components. Music systems, Collision System etc

Here is some example entitie:

```
class Player extends Entity
{
    constructor()
    {
        super(data)

        this.add(Movement) // add a movment component
        .add(Contoller) // add a controller component
        .add(Health) // add a health component
        .add(View) // add a view component
    }
}

class Enemy extends Entity
{
    constructor()
    {
        super(data)

        this.add(Movement) // add a movment component
        .add(AI) // add a AI component
        .add(Health) // add a health component
        .add(View) // add a view component
    }
}
```

example components

```

class Health extends Component
{
    constructor(entity, data)
    {
        super(entity, data);
        this.life = data.life || 100;

        entity.registerSignals('onDead');
    }

    hit()
    {
        this.life--;
        if(this.life < 0)
        {
            this.entity.signals.emit('onDead');
        }
    }
}

class Movment extends Component
{
    constructor(entity, data)
    {
        super(entity, data);
        this.xSpeed = 0;
        this.ySpeed = 0;
    }

    update()
    {
        this.entity.position.x += this.xSpeed;
        this.entity.positionx += this.ySpeed;
    }
}

```
System example:

```

class CollisonSystem extends System
{
    constructor(entity, data)
    {
        super(entity, data);

        this.entities = [];

        entity.registerSignals('onCollide');
    }

    entityAddedToScene(entity)
    {
        this.entities.push(entity)
    }

    entityRemovedToGame(entity)
    {
        const index = this.entities.indexOf(entity);

        this.entities.splice(index, 1);
    }

    update()
    {
        hittest(this.entities);
    }
}

```

To use them and add them to a game:

```

const game = new Game();
game.addSystem(CollisonSystem);

const player = new Player();
const enemy = new Enemy();

game.addChild(player);
game.addChild(enemy);

```

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact
