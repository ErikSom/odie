import { Rectangle, Texture, utils } from 'pixi.js';
import { Matrix3 } from '../../../math';
import { StandardMaterial } from '../high-shader';
import { alphaDiscard, alphaStandard, clipping, diffuseStandard, emissiveStandard, fastNormalMatrix, generateSkinning, modelMatrix, normalMapStandard, normalMapTangentStandard, normalStandard, reflectionStandard, skinningTexture, specularStandard, standardNormalMatrix, uvsWithFrameStandard, } from '../high-shader/fragments';
import { morphTargetNormalStandard } from '../high-shader/fragments/morphTargetFragments';
import { generateLights, generateLightsWithShadow } from '../high-shader/lights/generateLights';
import { generateNoLights } from '../high-shader/lights/generateNoLights';
export class PhongMaterial extends StandardMaterial {
    constructor(options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        const useLights = (_a = options.useLights) !== null && _a !== void 0 ? _a : true;
        const uniforms = (_b = options.uniforms) !== null && _b !== void 0 ? _b : {};
        let normalMatrix;
        if ((_c = options.fastNormals) !== null && _c !== void 0 ? _c : StandardMaterial.FAST_NORMALS) {
            normalMatrix = fastNormalMatrix;
        }
        else {
            normalMatrix = standardNormalMatrix;
            uniforms.uNormalMatrix = new Matrix3();
        }
        let lights = generateNoLights;
        if (useLights) {
            if (options.receiveShadows) {
                lights = generateLightsWithShadow;
            }
            else {
                lights = generateLights;
            }
        }
        const config = {
            modelMatrix,
            normalMatrix,
            uv: uvsWithFrameStandard,
            alpha: alphaStandard,
            lights,
            extensions: [],
        };
        uniforms.uDiffuseColor = new Float32Array([1, 1, 1, 1]);
        uniforms.uMapFrame = new Rectangle(0, 0, 1, 1);
        if (options.diffuseMap) {
            config.diffuse = diffuseStandard;
            uniforms.uDiffuseMap = (_d = options.diffuseMap) !== null && _d !== void 0 ? _d : Texture.WHITE;
        }
        if (options.specular !== undefined || options.gloss !== undefined || options.specularMap) {
            config.specular = specularStandard;
            uniforms.uSpecularMap = (_e = options.specularMap) !== null && _e !== void 0 ? _e : Texture.WHITE;
            uniforms.uSpecularGloss = [(_f = options.specular) !== null && _f !== void 0 ? _f : 100, (_g = options.gloss) !== null && _g !== void 0 ? _g : 2]; // 0.9;
        }
        uniforms.uEmissiveColor = new Float32Array([1, 1, 1]);
        if (options.emissiveMap || options.emissiveColor !== undefined || options.emissive !== undefined) {
            config.emissive = emissiveStandard;
            uniforms.uEmissiveMap = (_h = options.emissiveMap) !== null && _h !== void 0 ? _h : Texture.WHITE;
        }
        if (options.normalMap) {
            options.tangents = (_j = options.tangents) !== null && _j !== void 0 ? _j : PhongMaterial.PREFER_TANGENTS;
            if (options.tangents) {
                config.normal = normalMapTangentStandard;
            }
            else {
                config.normal = normalMapStandard;
            }
            uniforms.uNormalMap = options.normalMap;
            uniforms.uNormalScale = (_k = options.normalScale) !== null && _k !== void 0 ? _k : 1;
        }
        else {
            config.normal = normalStandard;
        }
        if (options.environmentMap) {
            config.reflection = reflectionStandard;
            uniforms.uMetalRoughnessPower = new Float32Array([
                (_l = options.metalPower) !== null && _l !== void 0 ? _l : 1,
                // TODO hiding this for now!
                0,
            ]);
            uniforms.uEnvironmentMap = options.environmentMap;
        }
        if (options.clippingPlane) {
            config.extensions.push(clipping);
            uniforms.uClippingPlane = options.clippingPlane;
        }
        if (options.morphTargets) {
            config.extensions.push(morphTargetNormalStandard);
            uniforms.uMorphTargetInfluence = new Float32Array([0, 0, 0, 0]);
        }
        if (options.skinning) {
            const useBoneTexture = (_m = options.boneTexture) !== null && _m !== void 0 ? _m : StandardMaterial.PREFER_TEXTURE;
            let skinningFragment;
            if (useBoneTexture) {
                skinningFragment = skinningTexture;
            }
            else {
                skinningFragment = generateSkinning((_o = options.maxBones) !== null && _o !== void 0 ? _o : StandardMaterial.MAX_BONES);
            }
            config.extensions.push(skinningFragment);
        }
        if (options.alphaTest) {
            uniforms.uAlphaTest = options.alphaTest;
            config.extensions.push(alphaDiscard);
        }
        // override anything!
        if (options.config) {
            // smartly merge the extensions as we need to concat the two array..
            let extensions = config.extensions;
            if (options.config.extensions) {
                extensions = config.extensions.concat(options.config.extensions);
            }
            Object.assign(config, options.config);
            config.extensions = extensions;
        }
        super(config, uniforms);
        this.tangents = (_p = options.tangents) !== null && _p !== void 0 ? _p : false;
        this.color = (_q = options.color) !== null && _q !== void 0 ? _q : 0xFFFFFF;
        this._emissiveIntensity = (_r = options.emissive) !== null && _r !== void 0 ? _r : 1;
        this.emissiveColor = (_s = options.emissiveColor) !== null && _s !== void 0 ? _s : 0xFFFFFF;
    }
    get uniforms() {
        return this.uniformGroup.uniforms;
    }
    set diffuseMap(value) {
        this.uniforms.uDiffuseMap = value;
    }
    get diffuseMap() {
        return this.uniforms.uDiffuseMap;
    }
    set color(value) {
        this._hexColor = value;
        utils.hex2rgb(value, this.uniforms.uDiffuseColor);
    }
    get color() {
        return this._hexColor;
    }
    set specular(value) {
        this.uniforms.uSpecularGloss[0] = value;
    }
    get specular() {
        return this.uniforms.uSpecularGloss[0];
    }
    set gloss(value) {
        this.uniforms.uSpecularGloss[1] = value;
    }
    get gloss() {
        return this.uniforms.uSpecularGloss[1];
    }
    set specularMap(value) {
        this.uniforms.uSpecularMap = value;
    }
    get specularMap() {
        return this.uniforms.uSpecularMap;
    }
    set emissiveColor(value) {
        this._hexEmissiveColor = value;
        const uEmissiveColor = this.uniforms.uEmissiveColor;
        utils.hex2rgb(value, uEmissiveColor);
        uEmissiveColor[0] *= this._emissiveIntensity;
        uEmissiveColor[1] *= this._emissiveIntensity;
        uEmissiveColor[2] *= this._emissiveIntensity;
    }
    get emissiveColor() {
        return this._hexEmissiveColor;
    }
    set emissive(value) {
        this._emissiveIntensity = value;
        this.emissiveColor = this._hexColor;
    }
    get emissive() {
        return this._emissiveIntensity;
    }
    set environmentMap(value) {
        this.uniforms.uEnvironmentMap = value;
    }
    get environmentMap() {
        return this.uniforms.uEnvironmentMap;
    }
    set metalPower(value) {
        this.uniforms.uMetalRoughnessPower[0] = value;
    }
    get metalPower() {
        return this.uniforms.uMetalRoughnessPower[0];
    }
    set clippingPlane(value) {
        this.uniforms.uClippingPlane = value;
    }
    get clippingPlane() {
        return this.uniforms.uClippingPlane;
    }
    get morphTargets() {
        return this.uniforms.uMorphTargetInfluence;
    }
}
PhongMaterial.PREFER_TANGENTS = false;
