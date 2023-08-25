import type { Time } from '../utils';
import type { ComponentInterface } from './ComponentInterface';
import type { Entity } from './Entity';
import type { Scene } from './Scene';
/**
 * Systems are great for managing many entities or broader parts of your game.
 * An ODIE game is basically made entirely of systems. These systems should generally have a focused responsibility
 * Example systems could be:
 *
 * - rendering system for drawing to the screen,
 * - a sound system for managing game sound,
 * - a spawn system for managing enemies,
 * - a collision system for managing hit detection,
 *
 * The main difference between a System and a Component is that when a
 * System is added to a Game it is hooked up to all the games \{Runner\}'s
 *
 * Systems are automatically wired into the game, simply implement the abstract functions that you need.
 *
 * As a general convention any system should be named with the postfix system. eg `EnemySystem`, `TransformSystem`.
 *
 * Once a system is added to a game it can be easily accessed directly from the game object
 *
 * ```
 *
 * class CollisionSystem extends System
 * {
 *    constructor(entity, data)
 *    {
 *        super(entity, data);
 *
 *        this.entities = [];
 *
 *        entity.registerSignals('onCollide');
 *    }
 *
 *    entityAddedToScene(entity)
 *    {
 *        this.entities.push(entity)
 *    }
 *
 *    entityRemovedFromScene(entity)
 *    {
 *        const index = this.entities.indexOf(entity);
 *
 *        this.entities.splice(index, 1);
 *    }
 *
 *    update()
 *    {
 *        hitTest(this.entities);
 *    }
 *
 *    empty()
 *    {
 *        this.entities.length = 0;
 *    }
 *
 * }
 *
 * ```
 */
export interface SystemInterface<DATA = Record<string, unknown>, ENTITY extends Entity = Entity, SCENE extends Scene = Scene> extends ComponentInterface<DATA, ENTITY, SCENE> {
    scene?: Scene;
    /**
     * called when any entity is added to the game
     * @param entity - added to the game
     */
    entityAddedToScene?: (entity: Entity) => void;
    /**
     * called when any entity is removed from the game
     * @param entity - the entity removed
     */
    entityRemovedFromScene?: (entity: Entity) => void;
    /**
     * called when any entity is added to the game
     * @param dt - the delta time of the game
     */
    postupdate?: (time: Time) => void;
    /**
     * called when any entity is added to the game
     * @param dt - the delta time of the game
     */
    preupdate?: (time: Time) => void;
    /**
     * called when the game is resized
     * @param w - the new width of the game
     * @param h - the new height of the game
     */
    resize?: (w: number, h: number) => void;
    /**
     * called when a game is reset
     * Use this function to empty out and effectively reset the state of the system
     */
    reset?: () => void;
    empty?: () => void;
    prerender?: () => void;
    postrender?: () => void;
}
export interface SystemConstructor<DATA, ENTITY extends Entity, SCENE extends Scene, SYSTEM extends SystemInterface<DATA, ENTITY, SCENE>> {
    new (entity?: ENTITY, data?: DATA): SYSTEM;
}
//# sourceMappingURL=SystemInterface.d.ts.map