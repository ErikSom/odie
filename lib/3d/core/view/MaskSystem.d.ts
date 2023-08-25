import { Signal } from 'typed-signals';
import type { SystemInterface } from '../../../core/SystemInterface';
import type { Entity3D } from '../Entity3D';
import type { Scene3D } from '../Scene3D';
import type { Layer } from './Layer';
import type { RenderParameters } from './View3DSystem';
/**
 * Contain relevant information regarding the layers and their masks,
 *  as well as signals for the render loop
 * @param mask - The object in which to mask the layer with
 * @param layer - The layer in which to mask
 * @param preRender - The signal to be dispatched before rendering the mask
 * @param postRender - The signal to be dispatched after the layer's objects are rendered
 */
export interface LayerMasks {
    /** allow mask to test against itself
     * * example usage - when mask normals face in on itself
     */
    testSelf: boolean;
    /** object used to mask the layer */
    mask: Entity3D;
    /** layer being masked */
    layer: Layer;
    /** depth of the layer for depth testing purposes */
    depth: number;
}
/** Options to change how the mask will function */
export interface MaskOptions {
    /** allow mask to test against itself
     * * example usage - when mask normals face in on itself
     */
    testSelf: boolean;
}
/** hash containing all the layers being depth tested */
export interface LayerDepthGroup {
    [hash: string]: Layer[];
}
/** A system designed to allow for the use of 3d masking using webGLs stencil buffer
 ** Masks are to be created from Entity3D objects
 ** Only layers from the LayerSystem can be masked
 */
export declare class MaskSystem implements SystemInterface {
    static DEFAULT_NAME: string;
    /** current game scene */
    readonly scene: Scene3D;
    readonly signals: {
        /** called once the state of the masks change
         * * example - adding or removing masks */
        onMasksChange: Signal<(layer: Layer, mask: Entity3D) => void>;
    };
    /** the state to determine if the mask system will render masks */
    enabled: boolean;
    private _cachedRenderLayers;
    /** Contain relevant information regarding the layers and their masks */
    private readonly _maskedLayers;
    /** holds webgl object */
    private _gl;
    /** 2d array containing layers to renderer multiple depth levels */
    private readonly _renderLevels;
    constructor();
    /** Store access to webGL instead of doing it multiple times every render loop */
    start(): void;
    /**
     * Add mask from layer based on id
     * @param id - The id of the layer
     * @param mask - The entity that will be the mask for the given layer
     * @param options - Options to change how the mask will function
     * @returns The layer that the mask object is being set to
     */
    addMask(layer: Layer, mask: Entity3D, options?: MaskOptions): void;
    /**
     * Remove mask from layer based on id, detach signal bindings and return object to original layer
     * @param id - The id of the layer
     * @returns The layer that the mask object originally belonged to
     */
    removeLayerMask(layer: Layer): Layer;
    /** Prepare webGL to render the mask
     * @param layer - The layer currently being rendered
     * @param renderData - The render information to allow mask system to call the renderGroup function in View3DSystem
     */
    preRender(layer: Layer, renderData: RenderParameters): void;
    /** Reset webGL to original state from before mask render
     * @param layer - The layer currently being rendered
     */
    postRender(): void;
    /** Remove masks on all masked layers */
    removeAll(): void;
    /** Get information from a mask or layer
     * @param source - The layer or mask currently being check in use by masking system
     */
    maskingInformation(source: Layer | Entity3D): LayerMasks;
    private _renderFunction;
    private _renderLayer;
    /**
     * Checks whether or not the layer needs to be culled based off mask intersection with camera's frustum
     * @param maskData - Contain relevant information regarding the layers and their masks,
     * as well as signals for the render loop
     * @param camera - the camera in the current renderSession and not the one attached to the View3System
     * @returns cull state of the layer
     */
    private _cullMaskLayer;
}
//# sourceMappingURL=MaskSystem.d.ts.map