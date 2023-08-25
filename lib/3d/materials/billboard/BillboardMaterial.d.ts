import type { Texture } from 'pixi.js';
import { Shader } from 'pixi.js';
export interface BillboardMaterialUniforms {
    uMap: Texture;
    uOpacity: number;
}
/**
 * a material for rendering billboards - planes that basically face the camera the whole time!
 * does as bit of maths on the shader to unproject a plane
 */
export declare class BillboardMaterial extends Shader {
    /**
     *
     * @param uMap - the texture you want the billboard to have this can be from sprite sheet (what whaaat?)
     * @param opacity - the transparency of the material, like pixi's alpha!
     */
    constructor(uMap: Texture, opacity?: number);
    get uniforms(): BillboardMaterialUniforms;
    /**
     * set the texture of the billboard
     */
    set texture(texture: Texture);
    /**
     * gets the texture of a billboard
     */
    get texture(): Texture;
    /**
     * set the opacity of the billboard
     */
    set opacity(value: number);
    /**
     * gets the opacity of a billboard
     */
    get opacity(): number;
}
//# sourceMappingURL=BillboardMaterial.d.ts.map