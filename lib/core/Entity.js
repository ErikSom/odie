import { Signal } from 'typed-signals';
import { getComponentName } from '../utils/getComponentName';
import { Runner } from '../utils/Runner';
import { Component } from './Component';
/**
 * unique id generator, because like snowflakes our entities are individual and special
 */
let _UID = 0;
export class Entity {
    constructor() {
        /**
         * a unique id for this entity, this NEVER changes even when being pooled
         */
        this.UID = _UID++;
        /**
         * A name to give this entity! Entities can be searched for by name within the game
         */
        this.name = `item${this.UID}`;
        /**
         * A game will internally create groups. Adding for example 'enemies' to this list
         * means that there will be a group in the game called 'enemies' that can be used to easily access
         * all enemies via `game.groups.enemies`
         */
        this.groups = [];
        /**
         * runners are used as internal communications on a component
         * they are fast, but not that flexible!
         */
        this.runners = {
            /**
             * A runner that will call the init function on all components
             * called automatically by the pooling system
             * allows you to pass in relevant initiation data
             *
             */
            init: new Runner('init', 1),
            /**
             * A runner that will call the addedToScene function on all components
             * called when this entity has been added to the game
             */
            addedToScene: new Runner('addedToScene', 1),
            /**
             * A runner that will call the start function on all components
             * called before the first update is called when an entity is added to the game
             */
            start: new Runner('start'),
            /**
             * A runner that will call the update function on all components
             * it will be called each time the game update loop fires
             * delta time will be passed in.
             */
            update: new Runner('update', 1),
            /**
             * A runner that will call the render function on all components
             * it will be called each time the screen is rendered.
             * this can be a different speed to the update loop!
             */
            render: new Runner('render', 2),
            /**
             * A runner that will call the removedFromScene function on all components
             * called when this entity is removed from a game
             */
            removedFromScene: new Runner('removedFromScene', 1),
            /**
             * A runner that will call the reset function on all components
             * When this entity is added back into the pool, reset is called.
             * giving all components the opportunity to tidy them selves up ready for their next usage
             */
            reset: new Runner('reset'),
            /**
             * A runner that will call the reset function on all components
             * fired when this entity is set to active = true
             * this is recursive, so all children will also be set to active
             */
            activate: new Runner('activate'),
            /**
             * A runner that will call the reset function on all components
             * fired when this entity is set to active = false
             * this is recursive, so all children will also be set to inactive
             */
            deactivate: new Runner('deactivate'),
            /**
             * The destroy runner. Calling this will destroy the entity.
             * A runner that will call the destroy function on all components
             * This is called when an entity is destroyed.
             * This means it will be removed from the game if added
             * If created from the pool system it will also be returned to the pool
             */
            destroy: new Runner('destroy'),
        };
        this.signals = {
            /**
             * this signal is dispatched when an entity is destroyed
             */
            onDestroyed: new Signal(),
        };
        /*
         * if an object is marked for removal by the gc this is true!
         */
        this._gc = false;
        this._adding = false;
        /**
         * a place where store all components based on a class provided
         * the can be accessed via getComponent
         */
        this._components = new Map();
    }
    /**
     * An moment to initiate all components within this entity
     * the data passed in expected to be key value pairs.
     * The keys are mapped to component names. and te relevant data is passed
     *
     * eg \{
     *   health:\{life:20\}, \<-- health component gets this object
     *   body:\{shape:'square'\} \<-- the body gets this object
     * \}
     *
     * the init function will most likely be called when retrieving an object from a pool.
     * @param data - the init data for this entity
     */
    init(data) {
        var _a;
        this.data = data;
        const components = this.runners.init.items;
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            component.init((_a = (data)) === null || _a === void 0 ? void 0 : _a[component.name]);
        }
    }
    /**
     * called by the pool system before its thrown back in to a pool
     * an opportunity for components to reset and tidy up before
     * the entity gets used again.
     */
    reset() {
        this._destroyed = false;
        this._gc = false;
        this._adding = false;
        this.runners.reset.run();
        this._components.forEach((component) => {
            if (component.signals) {
                const signals = component.signals;
                for (const i in signals) {
                    signals[i].disconnectAll();
                }
            }
        });
        for (const i in this.signals) {
            this.signals[i].disconnectAll();
        }
    }
    /**
     * calling this will destroy the entity
     * mainly it will give the components an opportunity to run any any destroy code
     * and let the game know to remove the entity.
     */
    destroy() {
        // this is so if you call destroy twice, weird things don't happen!
        if (this._destroyed)
            return;
        this._destroyed = true;
        if (this.scene) {
            this.scene.removeFromScene(this);
            // wait a frame...
            // TODO destroyed we should wait a frame here..
            // we should que stuff up for destruction and then
            // destroy i at the end of the game loop
            // let the components run their destroy methods
        }
        this.runners.destroy.run(this);
        // let everything else know entity is destroyed
        this.signals.onDestroyed.emit(this);
    }
    /**
     * create and add a component
     * @param ComponentClass - the component class to create and add
     * @param data - the data to pass to the component constructor
     * @param name -
     */
    addComponent(ComponentClass, data, name) {
        var _a, _b;
        name = name || getComponentName(ComponentClass);
        if (this._components.has(ComponentClass)) {
            throw new Error(`[Entity] ${name} component already exists`);
        }
        // create the component...
        const component = new ComponentClass(this, data);
        component.name = name;
        this._components.set(ComponentClass, component);
        // add to the Runners..
        for (const i in this.runners) {
            this.runners[i].add(component);
        }
        this._checkRenderAndUpdate();
        (_a = component.addedToEntity) === null || _a === void 0 ? void 0 : _a.call(component, this);
        if (this.scene) {
            (_b = component.addedToScene) === null || _b === void 0 ? void 0 : _b.call(component, this.scene);
        }
        return component;
    }
    /**
     * get a component of the specified type
     * @param ComponentClass - the type of component to get
     */
    getComponent(ComponentClass) {
        return this._components.get(ComponentClass);
    }
    /**
     * removes a component of specified type
     * @param ComponentClass - the type of component to remove
     * @param name - optional name used to register component
     */
    removeComponent(ComponentClass) {
        var _a, _b;
        const component = this._components.get(ComponentClass);
        if (!component) {
            return this;
        }
        for (const i in this.runners) {
            this.runners[i].remove(component);
        }
        (_a = component.removedFromEntity) === null || _a === void 0 ? void 0 : _a.call(component, this);
        this._checkRenderAndUpdate();
        (_b = component.reset) === null || _b === void 0 ? void 0 : _b.call(component);
        this._components.delete(ComponentClass);
        return this;
    }
    /**
     * add self will hookup the runners to the entity itself, effectivly treating it like a component
     * init / destroy / reset ar not added as these functions already exist so they can be overridden
     */
    addSelf() {
        this.runners.start.add(this);
        this.runners.update.add(this);
        this.runners.render.add(this);
        this.runners.addedToScene.add(this);
        this.runners.removedFromScene.add(this);
        this.runners.activate.add(this);
        this.runners.deactivate.add(this);
    }
    /**
     * Adds a generic object as a component to this entity
     * a bit like unit's addScript.
     *
     * @param object - and object with functions mapping to the component runners
     */
    addScript(object) {
        const ComponentClass = Component.create(`${this.name}_${this.constructor.name}`, object);
        return this.addComponent(ComponentClass);
    }
    /**
     * internally checks to see if we should hook up this component to the main
     * update and render loops. If there are not components in the update or render runners
     * then there is no point adding them
     */
    _checkRenderAndUpdate() {
        if (this.scene) {
            this._checkRunner(this.runners.render, this.scene['_onRenderEntities']);
            this._checkRunner(this.runners.update, this.scene['_onUpdateEntities']);
        }
    }
    /**
     * adds a runner to another targetRunner if it is not empty
     *
     * @param runner - the local entity runner
     * @param targetRunner - the scene runner we want to hook into
     */
    _checkRunner(runner, targetRunner) {
        const temp = runner;
        if (targetRunner.contains(temp) === temp.empty) {
            if (temp.empty) {
                targetRunner.remove(temp);
            }
            else {
                targetRunner.add(temp);
            }
        }
    }
}
