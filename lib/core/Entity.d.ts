import { Signal } from 'typed-signals';
import { Runner } from '../utils/Runner';
import type { ComponentConstructor, ComponentInterface } from './ComponentInterface';
import type { Scene } from './Scene';
export declare type EntityRunnerKeys = 'init' | 'addedToScene' | 'start' | 'update' | 'render' | 'removedFromScene' | 'reset' | 'activate' | 'deactivate' | 'destroy';
export declare class Entity<OPTIONS_TYPE = Record<string, any>, SCENE_TYPE extends Scene = Scene> {
    /**
     * a unique id for this entity, this NEVER changes even when being pooled
     */
    readonly UID: number;
    /**
     * we store the data the last set of in the init function here.
     */
    data?: OPTIONS_TYPE;
    /**
     * A name to give this entity! Entities can be searched for by name within the game
     */
    name: string;
    /**
     * A reference to the game this entity exists in
     * this property is automatically set by the scene when the entity is added
     * it is set to null when the entity is removed from the game
     */
    scene: SCENE_TYPE;
    /**
     * A game will internally create groups. Adding for example 'enemies' to this list
     * means that there will be a group in the game called 'enemies' that can be used to easily access
     * all enemies via `game.groups.enemies`
     */
    readonly groups: string[];
    /**
     * runners are used as internal communications on a component
     * they are fast, but not that flexible!
     */
    readonly runners: Record<EntityRunnerKeys, Runner>;
    readonly signals: Record<string, Signal<(...args: any[]) => void>>;
    _gc: boolean;
    _adding: boolean;
    /**
     * a place where store all components based on a class provided
     * the can be accessed via getComponent
     */
    private readonly _components;
    /**
     * boolean we check to make sure we only destroy something once :)
     */
    private _destroyed;
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
    init(data?: OPTIONS_TYPE): void;
    /**
     * called by the pool system before its thrown back in to a pool
     * an opportunity for components to reset and tidy up before
     * the entity gets used again.
     */
    reset(): void;
    /**
     * calling this will destroy the entity
     * mainly it will give the components an opportunity to run any any destroy code
     * and let the game know to remove the entity.
     */
    destroy(): void;
    /**
     * create and add a component
     * @param ComponentClass - the component class to create and add
     * @param data - the data to pass to the component constructor
     * @param name -
     */
    addComponent<COMPONENT extends ComponentInterface<DATA, any, any>, DATA = Record<string, any>>(ComponentClass: ComponentConstructor<DATA, any, any, COMPONENT>, data?: DATA, name?: string): COMPONENT;
    /**
     * get a component of the specified type
     * @param ComponentClass - the type of component to get
     */
    getComponent<COMPONENT extends ComponentInterface<DATA, any, any>, DATA = Record<string, any>>(ComponentClass: ComponentConstructor<DATA, any, any, COMPONENT>): COMPONENT;
    /**
     * removes a component of specified type
     * @param ComponentClass - the type of component to remove
     * @param name - optional name used to register component
     */
    removeComponent<COMPONENT extends ComponentInterface<DATA, any, any>, DATA = Record<string, any>>(ComponentClass: ComponentConstructor<DATA, any, any, COMPONENT>): this;
    /**
     * add self will hookup the runners to the entity itself, effectivly treating it like a component
     * init / destroy / reset ar not added as these functions already exist so they can be overridden
     */
    addSelf(): void;
    /**
     * Adds a generic object as a component to this entity
     * a bit like unit's addScript.
     *
     * @param object - and object with functions mapping to the component runners
     */
    addScript(object?: ComponentInterface<void>): ComponentInterface;
    /**
     * internally checks to see if we should hook up this component to the main
     * update and render loops. If there are not components in the update or render runners
     * then there is no point adding them
     */
    private _checkRenderAndUpdate;
    /**
     * adds a runner to another targetRunner if it is not empty
     *
     * @param runner - the local entity runner
     * @param targetRunner - the scene runner we want to hook into
     */
    private _checkRunner;
}
//# sourceMappingURL=Entity.d.ts.map