import { UniformGroup } from 'pixi.js';
import type { Entity, SystemInterface } from '../../../core';
import type { Scene3D } from '../Scene3D';
import type { View3DSystem } from '.';
export interface FogSystemOptions {
    view3d: View3DSystem;
    fog: FogOptions;
}
export interface FogOptions {
    enabled?: boolean;
    color?: number;
    density?: number;
    near?: number;
    far?: number;
}
export interface FogUniforms {
    uFogColor: Float32Array;
    uFogDensity: number;
    uFogNear: number;
    uFogFar: number;
}
export declare class FogSystem implements SystemInterface {
    static DEFAULT_NAME: string;
    scene: Scene3D;
    readonly fogUniforms: UniformGroup;
    private _hexFogColor;
    constructor(_entity: Entity, options: FogSystemOptions);
    setData(data: FogOptions): void;
    set color(value: number);
    get color(): number;
    set density(value: number);
    get density(): number;
    set near(value: number);
    get near(): number;
    set far(value: number);
    get far(): number;
}
//# sourceMappingURL=FogSystem.d.ts.map