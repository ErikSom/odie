import { Runner, Signals } from '../utils';
import { Time } from '../utils/Time';
import { Entity } from './Entity';
import { Group } from './groups/Group';
import type { SystemConstructor, SystemInterface } from './SystemInterface';
/**
 * Game, dd does exactly what it says on the tin! A game is essentially:
 *
 * 1 - A bunch of game Entities
 *
 * 2 - a collection of Systems all interacting with each other and the entities
 *
 * This game is the most minimal version of ODIE, check out BasicGame for something a little higher level
 *
 * Key events in Odie are powered by Runner's
 * the great thing is entities and components automatically get attached to them, so as
 * long as the correct function exists in a system / component it will be called.
 *
 * ```
 *
 * const game = new Game();
 *
 * game.addSystem(SpawnSystem, {maxEnemies:10});
 *
 * game.spawn.addEnemy();
 *
 * requestAnimationFrame(dt)
 * {
 *    game.update(dt);
 * }
 * ```
 */
export declare class Scene extends Signals {
    readonly allEntities: Group<Entity>;
    readonly time: Time;
    paused: boolean;
    readonly onResize: Runner<'resize'>;
    readonly onEntityAddedToScene: Runner<'entityAddedToScene'>;
    readonly onEntityRemovedFromScene: Runner<'entityRemovedFromScene'>;
    readonly onPreupdate: Runner<'preupdate'>;
    readonly onPostupdate: Runner<'postupdate'>;
    readonly onPrerender: Runner<'prerender'>;
    readonly onPostrender: Runner<'postrender'>;
    readonly onEmpty: Runner<'empty'>;
    private _width;
    private _height;
    private _entitiesToRemove;
    private _entitiesToAdd;
    private readonly _onUpdateEntities;
    private readonly _onRenderEntities;
    private readonly _runners;
    private readonly _system;
    /**
     * If true update will be called automatically before a scene is rendered. defaults to true
     */
    private readonly _updateAndRender;
    private readonly _rootContainer?;
    /**
     *
     * @param data - Options to use for your game
     * updateAndRender - True if you want the update and render to be
     * called simultaneously. This can be handy if you want to render and update the game at different rates
     */
    constructor(data?: {
        updateAndRender?: boolean;
    });
    /**
     * the width of the game. to modify this its best to call `game.resize(w, h)`
     */
    get width(): number;
    /**
     * the height of the game. to modify this its best to call `game.resize(w, h)`
     */
    get height(): number;
    /**
     * An ODIE game is built out of systems. A System should focus on managing a broad features of a game.
     * Adding a system should be done at the start of the game rather than on the fly. Shortcuts are added
     * by default so A System can then be accessed using its name.
     * Each system should have a unique name, otherwise an error will be thrown.
     *
     * ```
     * // add our spawn system
     * game.add(SpawnSystem, {maxEnemies:10});
     *
     * // access via shortcut
     * game.spawn.spawnEnemy();
     *
     * // access normally
     * game.system.spawn.spawnEnemy();
     * ```
     *
     * @param _systemClass - A class reference to an Odie System.
     * @param data - A list of options passed to the System when it is initialized.
     * @param name - The name of the system to use. This name is how the system can be accessed
     * from the game. If none is provided a name will be derived from the class name. SpawnSystem would be named spawn
     * @param addSelf - set to true if you want system added directly to the class.
     */
    addSystem<DATA, SYSTEM extends SystemInterface<DATA, Entity, Scene>>(_systemClass: SystemConstructor<DATA, Entity, Scene, SYSTEM>, data?: DATA, name?: string): SYSTEM;
    /**
     * return the system of the specified type
     * @param SystemClass -
     */
    getSystem<DATA, SYSTEM extends SystemInterface<DATA, Entity, Scene>>(SystemClass: SystemConstructor<DATA, Entity, Scene, SYSTEM>): SYSTEM;
    /**
     * Directly adds an entity to the game.
     * @param entity - the entity to add to the game
     */
    addToScene(entity: Entity): void;
    /**
     * Directly removes an entity from the game
     * @param entity - the entity to remove
     */
    removeFromScene(entity: Entity): void;
    /**
     * Called before the game is rendered. Called by a render system before it is about to draw to the screen
     */
    renderStart(): void;
    /**
     * called by a render system when it has finished rendering
     */
    renderFinish(): void;
    /**
     * Call this each tick to update the game. Currently you must pass in delta time
     * This should be changed though.
     *
     * @param dt - the delta time between frames
     */
    update(): void;
    /**
     * This is called when you want to essentially clean out the game. Its like wiping the slate clean
     * All systems will be notified and all entities will be removed.
     *
     */
    empty(): void;
    /**
     *
     * @param w - the width to make the game
     * @param h - the height to make the game
     */
    resize(w: number, h: number): void;
    private _addEntities;
    private _removeEntities;
    private _removeEntity;
}
//# sourceMappingURL=Scene.d.ts.map