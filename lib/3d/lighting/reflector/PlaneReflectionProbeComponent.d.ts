import { RenderTexture } from 'pixi.js';
import { Signal } from 'typed-signals';
import type { ComponentInterface } from '../../../core/ComponentInterface';
import type { ColorArray } from '../../../math/misc/ColorArray';
import { Plane } from '../../../math/shapes/Plane';
import type { Entity3D } from '../../core/Entity3D';
import type { Scene3D } from '../../core/Scene3D';
import type { View3DSystem } from '../../core/view/View3DSystem';
export interface PlaneReflectionProbeOptions {
    refreshRate?: number;
    plane?: Plane;
    resolution?: number;
    debug?: boolean;
    refraction?: boolean;
    reflection?: boolean;
    clipBias?: number;
    clear?: boolean;
    clearColor?: ColorArray;
}
/**
 * A reflection plane will render a reflected scene from the pov of the camera.
 * used for sexy lovely reflections. You can also render a scene for reflections
 */
export declare class PlaneReflectionProbeComponent implements ComponentInterface<PlaneReflectionProbeOptions, Entity3D, Scene3D> {
    static DEFAULT_NAME: string;
    reflectionTexture: RenderTexture;
    refractionTexture: RenderTexture;
    readonly entity: Entity3D;
    /**
     * if false, nothing will be rendering is skipped. true by default
     */
    enabled: boolean;
    readonly signals: {
        /**
         * dispatched before the reflection probe has rendered
         */
        onRenderBegin: Signal<(component: PlaneReflectionProbeComponent) => void>;
        /**
         * dispatched after the reflection probe has rendered
         */
        onRenderComplete: Signal<(component: PlaneReflectionProbeComponent) => void>;
    };
    clearColor: ColorArray;
    clear: boolean;
    private _plane;
    private _debugSprite;
    private readonly _debug;
    private readonly _virtualCamera;
    private readonly _refreshRate;
    private _frequency;
    private readonly _clipBias;
    constructor(entity: Entity3D, opts?: PlaneReflectionProbeOptions);
    addedToScene(scene: Scene3D): void;
    removedFromScene(scene: Scene3D): void;
    preDrawScene(view3d: View3DSystem): void;
    resize(): void;
}
//# sourceMappingURL=PlaneReflectionProbeComponent.d.ts.map