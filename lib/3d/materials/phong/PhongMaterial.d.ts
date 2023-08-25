import { Rectangle, Texture } from 'pixi.js';
import type { Plane } from '../../../math';
import { Matrix3 } from '../../../math';
import type { StandardMaterialConfig } from '../high-shader';
import { StandardMaterial } from '../high-shader';
export interface PhongMaterialOptions {
    /** Fast normals mean the shader will not need to calculate normal matrix. This is a win as long as scale stays uniform on the model */
    fastNormals?: boolean;
    /** The base color of the material */
    color?: number;
    /** The diffuse texture (this can come from a sprite sheet!) */
    diffuseMap?: Texture;
    /** The specular color */
    specular?: number;
    /** Amount of shine from the material, value between 0-1 */
    gloss?: number;
    /** The specular map texture */
    specularMap?: Texture;
    /** The normal map texture */
    normalMap?: Texture;
    /** tha scale depth of the normal map */
    normalScale?: number;
    /** The amount of light emmision */
    emissive?: number;
    /** The colour of light emmision */
    emissiveColor?: number;
    /** A texture that is used to add light emission */
    emissiveMap?: Texture;
    /** Opacity of the material 0-1 */
    opacity?: number;
    /** Set to true for vertex skinning animation! */
    skinning?: boolean;
    /** The maximum number of bones to upload to the GPU. Default is StandardMaterial.MAX_BONES (20)*/
    maxBones?: number;
    /** prefer to use a bone texture to store data (unlimited bones!), defaults to `StandardMaterial.PREFER_TEXTURE`(true) */
    boneTexture?: boolean;
    /** Set to true for vertex skinning animation! */
    morphTargets?: boolean;
    /** A texture to apply occlusion (after light calculations) */
    occlusionMap?: Texture;
    /** The environment map cube texture
     ** CubeTexture isn't exported from pixi, so this is temporary
     */
    environmentMap?: Texture;
    /** A value that will make material 100% reflective if 1 and 0% reflective if 0 */
    metalPower?: number;
    /** A map that will make material 100% reflective if a pixel is 0xffffff and 0% reflective if pixel is 0x000000 */
    metalMap?: Texture;
    /** If true, transforms will be instanced * use this if you know what you are doing ?:)*/
    instancing?: boolean;
    /** The name of you shader (defaults to phong-shader) */
    name?: string;
    /** True if you want shadows to be applied to this material */
    receiveShadows?: boolean;
    /** Add a clipping plane */
    clippingPlane?: Plane;
    /**
     * use tangents for calculating normals if they are available
     * pro - slightly faster shader, but requires tangents to be generated if they are not in the model
     * con - if the tangents are not provided, some lighting may appear ia bit off!
     */
    tangents?: boolean;
    /** use an alpha test for discarding pixels */
    alphaTest?: number;
    /**
     * true to use the lights in the scene
     */
    useLights?: boolean;
    /**
     * config to override any standard parts of the shader
     */
    config?: Partial<StandardMaterialConfig>;
    /**
     * any uniforms to set on the shader..
     */
    uniforms?: PhongUniforms;
}
/**
 * the possible uniforms that this shader may added to the shader
 */
export interface PhongUniforms {
    [key: string]: any;
    uClippingPlane?: Plane;
    uEnvironmentMap?: Texture;
    uMetalRoughnessPower?: Float32Array;
    uNormalScale?: number;
    uNormalMap?: Texture;
    uNormalMatrix?: Matrix3;
    uEmissiveMap?: Texture;
    uEmissiveColor?: Float32Array;
    uSpecularGloss?: number[];
    uSpecularMap?: Texture;
    uDiffuseMap?: Texture;
    uMapFrame?: Rectangle;
    uDiffuseColor?: Float32Array;
    uAlphaTest?: number;
    uMorphTargetInfluence?: Float32Array;
}
export declare class PhongMaterial extends StandardMaterial {
    static PREFER_TANGENTS: boolean;
    tangents: boolean;
    private _hexColor;
    private _hexEmissiveColor;
    private _emissiveIntensity;
    constructor(options?: PhongMaterialOptions);
    get uniforms(): PhongUniforms;
    set diffuseMap(value: Texture);
    get diffuseMap(): Texture;
    set color(value: number);
    get color(): number;
    set specular(value: number);
    get specular(): number;
    set gloss(value: number);
    get gloss(): number;
    set specularMap(value: Texture);
    get specularMap(): Texture;
    set emissiveColor(value: number);
    get emissiveColor(): number;
    set emissive(value: number);
    get emissive(): number;
    set environmentMap(value: Texture);
    get environmentMap(): Texture;
    set metalPower(value: number);
    get metalPower(): number;
    set clippingPlane(value: Plane);
    get clippingPlane(): Plane;
    get morphTargets(): Float32Array;
}
//# sourceMappingURL=PhongMaterial.d.ts.map