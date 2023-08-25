import type { Texture } from 'pixi.js';
import { Shader } from 'pixi.js';
export declare const diffuseShaderTemplate: {
    name: string;
    vertex: string;
    fragment: string;
};
export interface DiffuseMaterialUniforms {
    uDiffuseMap: Texture;
    opacity: number;
}
/**
 * a really basic material that just shows a standard texture.
 * no normals or lighting!
 */
export declare class DiffuseMaterial extends Shader {
    needsUpdate: boolean;
    skinning: boolean;
    constructor(uDiffuseMap: Texture, skinning?: boolean);
    get uniforms(): DiffuseMaterialUniforms;
    set map(value: Texture);
    get map(): Texture;
    set opacity(value: number);
    get opacity(): number;
}
//# sourceMappingURL=DiffuseMaterial.d.ts.map