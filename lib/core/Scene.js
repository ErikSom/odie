import { Runner, Signals } from '../utils';
import { getComponentName } from '../utils/getComponentName';
import { Time } from '../utils/Time';
import { Entity } from './Entity';
import { Group } from './groups/Group';
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
export class Scene extends Signals {
    /**
     *
     * @param data - Options to use for your game
     * updateAndRender - True if you want the update and render to be
     * called simultaneously. This can be handy if you want to render and update the game at different rates
     */
    constructor(data = {}) {
        super();
        // TODO pass options from constructor. this should be done as a separate PR as it will involve breaking
        // our current constructor params for scene3D and scene2D
        this.time = new Time();
        this._width = 100;
        this._height = 100;
        this._entitiesToRemove = [];
        this._entitiesToAdd = [];
        // store all items..
        // could be replaced with the children!
        /**
         * A list of ALL entities currently in the Game
         */
        this.allEntities = new Group();
        // special internal runner for managing updates
        this._onUpdateEntities = new Runner('run', 1);
        // special internal runner for managing renders
        this._onRenderEntities = new Runner('run', 2);
        /**
         * A runner called when the game is resized. Calls `entityAddedToScene()` on any registered objects.
         * System are automatically registered to this
         */
        this.onResize = new Runner('resize', 2);
        // global shouts item added / removed...
        /**
         * A runner called when any entity is added to the game. Calls `entityAddedToScene()`
         * on any registered objects. System are automatically registered to this
         */
        this.onEntityAddedToScene = new Runner('entityAddedToScene', 1);
        /**
         * A runner called when any entity is removed from the game. Calls `entityRemovedFromScene()`
         * on any registered objects. System are automatically registered to this
         */
        this.onEntityRemovedFromScene = new Runner('entityRemovedFromScene', 1);
        // some system shouts..
        /**
         * A runner called before a game update happens. Calls `preupdate()`
         * on any registered objects. System are automatically registered to this
         */
        this.onPreupdate = new Runner('preupdate', 1);
        /**
         * A runner called after the game has updated. Calls `postupdate()`
         * on any registered objects. System are automatically registered to this
         */
        this.onPostupdate = new Runner('postupdate', 1);
        /**
         * A runner called before a game render happens. Calls `prerender()`
         * on any registered objects. System are automatically registered to this
         */
        this.onPrerender = new Runner('prerender', 1);
        /**
         * A runner called after the game has render. Calls `postrender()`
         * on any registered objects. System are automatically registered to this
         */
        this.onPostrender = new Runner('postrender', 1);
        /**
         * A runner called when a game is about to be emptied. Calls `empty()`
         * on any registered objects. System are automatically registered to this
         */
        this.onEmpty = new Runner('empty', 1);
        /**
         * The system is the Entity that all systems are added to.
         */
        this._system = new Entity();
        this._system.name = 'system';
        this.addToScene(this._system);
        this.paused = false;
        this._updateAndRender = (data.updateAndRender === undefined) ? true : data.updateAndRender;
        /**
         * easy access to the signals registered to the system
         */
        this.signals = this._system.signals;
        this._runners = [
            this.onResize,
            this.onEntityAddedToScene,
            this.onEntityRemovedFromScene,
            this.onPreupdate,
            this.onPostupdate,
            this.onPrerender,
            this.onPostrender,
            this.onEmpty,
        ];
    }
    /**
     * the width of the game. to modify this its best to call `game.resize(w, h)`
     */
    get width() {
        return this._width;
    }
    /**
     * the height of the game. to modify this its best to call `game.resize(w, h)`
     */
    get height() {
        return this._height;
    }
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
    addSystem(_systemClass, data, name) {
        name = name || getComponentName(_systemClass);
        if (this._system.getComponent(_systemClass)) {
            throw new Error(`[Scene] ${name} system already exists`);
        }
        const system = this._system.addComponent(_systemClass, data, name);
        // hook up the system events
        this._runners.forEach((runner) => runner.add(system));
        system.scene = this;
        return system;
    }
    /**
     * return the system of the specified type
     * @param SystemClass -
     */
    getSystem(SystemClass) {
        return this._system.getComponent(SystemClass);
    }
    /**
     * Directly adds an entity to the game.
     * @param entity - the entity to add to the game
     */
    addToScene(entity) {
        if (entity._gc) {
            const index = this._entitiesToRemove.indexOf(entity);
            this._entitiesToRemove.splice(index, 1);
            entity._gc = false;
        }
        if (entity.scene) {
            if (entity.scene === this) {
                return;
                // todo might need to optimize if in the same Game?
            }
            this._removeEntity(entity);
        }
        entity.scene = this;
        this.allEntities.add(entity);
        //
        entity.runners.addedToScene.run(this);
        // emit..
        this.onEntityAddedToScene.run(entity);
        //
        this._entitiesToAdd.push(entity);
    }
    /**
     * Directly removes an entity from the game
     * @param entity - the entity to remove
     */
    removeFromScene(entity) {
        if (entity._gc || !entity.scene)
            return;
        entity._gc = true;
        this._entitiesToRemove.push(entity);
    }
    /**
     * Called before the game is rendered. Called by a render system before it is about to draw to the screen
     */
    renderStart() {
        if (this._updateAndRender) {
            this.update();
        }
        this.onPrerender.run(this.time);
        this._onRenderEntities.run(this.time);
    }
    /**
     * called by a render system when it has finished rendering
     */
    renderFinish() {
        this.onPostrender.run(this.time);
    }
    /**
     * Call this each tick to update the game. Currently you must pass in delta time
     * This should be changed though.
     *
     * @param dt - the delta time between frames
     */
    update() {
        if (this.paused)
            return;
        this.time.nextUpdate();
        this._addEntities();
        this._removeEntities();
        // post update..
        this.onPreupdate.run(this.time);
        // Update the frame if the lag counter is greater than or
        // equal to the frame duration
        // while (this.lag >= this.frameDuration){
        // Update the logic
        // update();
        this._removeEntities();
        // update entities..
        this._onUpdateEntities.run(this.time);
        // Reduce the lag counter by the frame duration
        this._removeEntities();
        // post update..
        this.onPostupdate.run(this.time);
    }
    /**
     * This is called when you want to essentially clean out the game. Its like wiping the slate clean
     * All systems will be notified and all entities will be removed.
     *
     */
    empty() {
        this._removeEntities();
        this.onEmpty.run();
        // The FIRST item is the System..
        for (let i = 0; i < this.allEntities.children.length; i++) {
            const entity = this.allEntities.children[i];
            entity.runners.removedFromScene.run(this);
            entity.scene = null;
            entity._gc = false;
        }
        this.allEntities.empty();
        // TODO move this
        // empty the top level scene..
        if (this._rootContainer) {
            this._rootContainer.empty();
        }
        this._onUpdateEntities.removeAll();
        this._onRenderEntities.removeAll();
        this.onResize.removeAll();
        this.onEntityAddedToScene.removeAll();
        this.onEntityRemovedFromScene.removeAll();
        this.onPreupdate.removeAll();
        this.onPostupdate.removeAll();
        this.onPrerender.removeAll();
        this.onPostrender.removeAll();
        this.onEmpty.removeAll();
        this._entitiesToAdd.length = 0;
        this._entitiesToRemove.length = 0;
        // add the system back in..
        this.addToScene(this._system);
        // add runners back
        this._system['_components'].forEach((k) => {
            this._runners.forEach((runner) => runner.add(k));
        });
    }
    /**
     *
     * @param w - the width to make the game
     * @param h - the height to make the game
     */
    resize(w, h) {
        this._width = w;
        this._height = h;
        this.onResize.run(w, h);
    }
    _addEntities() {
        if (!this._entitiesToAdd.length)
            return;
        for (let i = 0; i < this._entitiesToAdd.length; i++) {
            const entity = this._entitiesToAdd[i];
            const runners = entity.runners;
            if (!runners.update.empty) {
                this._onUpdateEntities.add(runners.update);
            }
            if (!runners.render.empty) {
                this._onRenderEntities.add(runners.render);
            }
            runners.start.run();
        }
        this._entitiesToAdd.length = 0;
    }
    _removeEntities() {
        const entitiesToRemove = this._entitiesToRemove;
        if (!entitiesToRemove.length)
            return;
        for (let i = 0; i < entitiesToRemove.length; i++) {
            const entity = entitiesToRemove[i];
            this._removeEntity(entity);
        }
        entitiesToRemove.length = 0;
    }
    _removeEntity(entity) {
        const runners = entity.runners;
        this.onEntityRemovedFromScene.run(entity);
        runners.removedFromScene.run(this);
        this.allEntities.remove(entity);
        if (!runners.update.empty) {
            this._onUpdateEntities.remove(runners.update);
        }
        if (!runners.render.empty) {
            this._onRenderEntities.remove(runners.render);
        }
        entity.scene = null;
        entity._gc = false;
    }
}
