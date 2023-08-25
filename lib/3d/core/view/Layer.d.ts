import { Signal } from 'typed-signals';
import type { CameraEntity } from '../../camera/CameraEntity';
import type { Entity3D } from '../Entity3D';
import type { RenderParameters } from '.';
/**
 * A layer is used to hold a group of entities that would be rendered together,
 * does not work in the same way as a PIXI display object in the sense of the layer being a parent
 */
export declare class Layer {
    /** an array containing opaque entities */
    opaqueRenderables: Entity3D[];
    /** an array containing transparent entities */
    transparentRenderables: Entity3D[];
    /** a list of entities currently not assigned to one of the entity arrays */
    changedEntities: Entity3D[];
    /** the layer's id */
    id: string;
    /** the index to determine the order of when all layers are rendered */
    renderIndex: number;
    /** a signal to be called before this layer has been rendered */
    onPreRender: Signal<(layer: Layer, params: RenderParameters) => void>;
    /** a signal to be called once this layer has been rendered */
    onPostRender: Signal<(layer: Layer, params: RenderParameters) => void>;
    /** its visible state, will render if set to true */
    visible: boolean;
    /** used to determine whether or not to update changed entities' state */
    private _tick;
    /** amount of entities currently not assigned to one of the entity arrays */
    private _changedEntityCount;
    /** set instance state, to only be set once */
    private readonly _allowInstancing;
    /**
     * @param allowInstancing - set instance state
     * @param id - layer id
     * @param index - render index
     */
    constructor(id: string, index: number, allowInstancing?: boolean);
    /**
     * @param camera - a camera used to determine the zIndex of entities
     */
    update(camera: CameraEntity): void;
    /**
     * get all entities in the layer
     * @param out - an optional array to use instead of a newly instantiated one
     * @returns an array containing all entities from the opaqueRenderables and transparentRenderables arrays
     */
    getAll(out?: Entity3D[]): Entity3D[];
    /**
     * Add an entity to the layer
     * @param entity - entity to be added
     */
    add(entity: Entity3D): void;
    /**
     * Remove an entity from the layer
     * @param entity - the entity to be removed
     */
    remove(entity: Entity3D): void;
    /**
     * empty this layer's entity arrays and instances
     */
    empty(): void;
    /**
     * determine the zIndex of entities
     * @param group - group of entities to test
     * @param camera - a camera used to determine the zIndex of entities
     */
    private _updateZDist;
    /**
     * Sets entity to change state ready to be assigned to an array (called when added to layer)
     * @param entity - the entity that has been changed
     */
    private _onChange;
}
//# sourceMappingURL=Layer.d.ts.map