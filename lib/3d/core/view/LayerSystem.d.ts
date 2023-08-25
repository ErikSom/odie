import { Signal } from 'typed-signals';
import type { SystemInterface } from '../../../core/SystemInterface';
import type { Entity3D } from '../Entity3D';
import type { Scene3D } from '../Scene3D';
import { Layer } from './Layer';
import type { RenderParameters } from './View3DSystem';
/** A hash prepared to contain any layers needed using a string based id*/
export interface LayerHash {
    [details: string]: Layer;
}
/** A system to manage a single or multiple layers
 ** Layers can be added at will and there is always a layer present, named "default"
 */
export declare class LayerSystem implements SystemInterface {
    static DEFAULT_NAME: string;
    readonly layers: LayerHash;
    readonly signals: {
        /** a signal to be emmited at the start of every update loop */
        preRender: Signal<(layers: Layer[], params: RenderParameters) => void>;
        /** a signal to be emmited at the end of every update loop */
        postRender: Signal<(layers: Layer[], params: RenderParameters) => void>;
    };
    readonly scene: Scene3D;
    private _renderList;
    constructor();
    update(): void;
    /** @returns object containing all layers */
    getAll(): LayerHash;
    /** @returns array containing all layers in order of renderIndex*/
    getOrderedArray(): Layer[];
    /**
     * Find a layer based on the entity it contains
     * @param entity - The entity in which we check for its layer
     * @returns A layer containing the entity given
     */
    getLayerFromEntity(entity: Entity3D): Layer;
    /**
     * Add layer to list of available layers
     * @param id - The id of the layer
     * @returns The instance of the new layer
     */
    addLayer(id: string): Layer;
    /**
     * Remove layer from list of available layers
     ** This should be avoided unless absolutely necessary
     * @param id - The id of the layer
     * @param clear - Used to prevent moving to new layer
     * @param newLayer - Set a new destination for the objects using an existing layer
     * @returns The layer that the objects are being set to
     */
    removeLayer(id: string, clear?: boolean, newLayer?: string): Layer;
    /**
     * Remove mask from layer based on id
     * @param id - The Id of the layer being requested
     * @returns The layer requested as long as it exists
     */
    getLayer(id: string): Layer;
    /**
     * Move a list of entities or a single entity to another layer
     * @param entities - List of entities or single entity that are to be moved
     * @param id - The id of the new layer
     * @param clear - (Used primarily by removeLayer function), used to prevent moving to new layer
     */
    entitiesToLayer(entities: Entity3D[] | Entity3D, id: string, clear?: boolean): void;
    /**
     * Renders all available layers
     * @param renderData - Holds all the information needed to call renderGroup in View3DSystem
     */
    renderLayers(renderData: RenderParameters): void;
    /**
     * Set the render index of the layer
     * @param layer - the layer that the index is being changed for
     * @param index - the index of which to set onto the layer, cannot set index to 0, cannot go out of layer list size
     */
    setLayerIndex(layer: Layer, index: number): void;
    /**
     * Sort a hash of layers for setting rendering order
     * @param layers - a hash containing layers to be sorted
     * @returns an ordered array of layers based on the layer's renderIndex
     */
    orderLayers(layers: LayerHash): Layer[];
}
//# sourceMappingURL=LayerSystem.d.ts.map