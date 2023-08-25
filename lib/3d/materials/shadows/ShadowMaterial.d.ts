import { Shader, Texture } from 'pixi.js';
/**
 * the Shader template for the shadow shader
 */
export declare const shadowTemplate: {
    name: string;
    vertex: string;
    fragment: string;
};
export interface ShadowMaterialOptions {
    /**
     * true if the element is a model with bones
     */
    skinned?: boolean;
    /**
     * the alpha map to test pixels against. Uses the alpha channel
     */
    alphaMap?: Texture;
    /**
     * the threshold for the test the pixel alpha against. If the pixel value is lower than the threshold it is not rendered
     */
    alphaTest?: number;
}
/**
 * a material used for rendering shadows!
 * its super simple and basically renders the depth of each object to the red channel of a pixel
 * supports skinning!
 * TODO - make sure instancing works too
 */
export declare class ShadowMaterial extends Shader {
    constructor(options?: ShadowMaterialOptions);
}
//# sourceMappingURL=ShadowMaterial.d.ts.map