import type { Entity3D } from '../../3d/core/Entity3D';
import { Component } from '../../core/Component';
export interface SceneUtilsComponentOptions {
    map: Entity3D[];
}
export interface EntityHash {
    [hash: string]: Entity3D;
}
export declare class SceneUtilsComponent extends Component<SceneUtilsComponentOptions> {
    readonly entity: Entity3D;
    map: Entity3D[];
    constructor(entity: Entity3D, data: SceneUtilsComponentOptions);
    find(name: string): Entity3D;
    logNames(modelsOnly?: boolean): void;
    attachTo(name: string, entity: Entity3D): void;
    hide(name: string): void;
    show(name: string): void;
    /**
     *
     * @param searchFunction - a search function performed on every entity in the scene
     * @param asHash - determines if the returned group of entities is a hash, defaults to an array
     */
    search(searchFunction: (entity: Entity3D) => boolean, asHash?: boolean): Entity3D[] | EntityHash;
    /**
     * A lot like Array.first but for all entities in the scene.
     *
     * @param searchFunction - a search function performed on every entity in the scene
     */
    first(searchFunction: (entity: Entity3D) => boolean): Entity3D;
    /**
     * returns either a hash or array of all entities that have the specified component name in the scene or
     * @param asHash - determines if the returned group of entities is a hash, defaults to an array
     * @returns either a hash or array of all entities in the scene
     */
    getAllEntities(asHash?: boolean): Entity3D[] | EntityHash;
    /**
     * @param name - the name of the component to match forward
     * @param asHash - determines if the returned group of entities is a hash, defaults to an array
     * @returns either a hash or array of all entities that have the specified component name in the scene
     */
    findWithComponents(name: string, asHash?: boolean): Entity3D[] | EntityHash;
    /**
     * returns either a hash of all lights by name in the scene or
     * an array of all lights in the scene
     * @param asHash - determines if the returned group of entities is a hash, defaults to an array
     */
    findLights(asHash?: boolean): Entity3D[] | EntityHash;
}
//# sourceMappingURL=SceneUtilsComponent.d.ts.map