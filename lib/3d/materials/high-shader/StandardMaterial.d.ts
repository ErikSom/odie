import { Shader } from 'pixi.js';
import type { LightData } from '../../core';
import type { HighFragment } from './HighFragment';
import type { LightsGenerator } from './lights/generateLights';
export declare const standardShaderTemplate: {
    name: string;
    vertex: string;
    fragment: string;
};
export interface StandardMaterialConfig {
    modelMatrix: HighFragment;
    normalMatrix: HighFragment;
    uv: HighFragment;
    lights?: LightsGenerator;
    normal?: HighFragment;
    diffuse?: HighFragment;
    reflection?: HighFragment;
    emissive?: HighFragment;
    specular?: HighFragment;
    alpha?: HighFragment;
    extensions?: HighFragment[];
}
export declare class StandardMaterial extends Shader {
    static MAX_BONES: number;
    static FAST_NORMALS: boolean;
    /**
     * if true, then skinning bone data will be stored on textures rather than uniforms
     */
    static PREFER_TEXTURE: boolean;
    id: number;
    private readonly _config;
    private _built;
    constructor(config: StandardMaterialConfig, uniforms?: any);
    build(lightData: LightData, fog: boolean, isWebGL2: boolean): void;
}
//# sourceMappingURL=StandardMaterial.d.ts.map