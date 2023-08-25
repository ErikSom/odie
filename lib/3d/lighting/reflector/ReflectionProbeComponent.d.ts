import { Texture } from 'pixi.js';
import { Signal } from 'typed-signals';
import type { ComponentInterface } from '../../../core/ComponentInterface';
import type { ColorArray } from '../../../math/misc/ColorArray';
import { Vector3 } from '../../../math/vector/Vector3';
import type { Entity3D } from '../../core/Entity3D';
import type { Scene3D } from '../../core/Scene3D';
export interface ReflectionProbeOptions {
    refreshRate?: number;
    size?: number;
    debug?: boolean;
    mipmap?: boolean;
    position?: Vector3;
    near?: number;
    far?: number;
    clear?: boolean;
    clearColor?: ColorArray;
}
/**
 * A reflection probe will generate a cubeTexture from capturing the scene from its point of view
 * Can be quite intensive as each update requires the scene to be rendered 6 times.length
 * But also, reflections look cool init!
 */
export declare class ReflectionProbeComponent implements ComponentInterface<ReflectionProbeOptions, Entity3D, Scene3D> {
    static readonly DEFAULT_NAME = "reflectionProbe";
    readonly entity: Entity3D;
    readonly signals: {
        /**
         * dispatched after the reflection probe has rendered
         */
        onRenderComplete: Signal<(component: ReflectionProbeComponent) => void>;
    };
    /**
     * if false, nothing will be rendering is skipped. true by default
     */
    enabled: boolean;
    cubeTexture: Texture;
    clearColor: ColorArray;
    clear: boolean;
    private readonly _virtualCamera;
    private readonly _refreshRate;
    private _frequency;
    private readonly _sideData;
    private readonly _mipmap;
    constructor(entity: Entity3D, opts?: ReflectionProbeOptions);
    addedToScene(scene: Scene3D): void;
    removedFromScene(scene: Scene3D): void;
    drawScene(): void;
    preDrawScene(): void;
}
//# sourceMappingURL=ReflectionProbeComponent.d.ts.map