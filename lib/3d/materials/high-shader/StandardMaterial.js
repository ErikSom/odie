import { Program, Shader } from 'pixi.js';
import { compileHighShader } from './compiler/compileHighShader';
import { dummyProgram } from './dummyProgram';
import { fogStandard, } from './fragments';
import { colorGamma } from './fragments/ColorFragments';
import standardFrag from './standard.frag';
import standardVert from './standard.vert';
export const standardShaderTemplate = {
    name: 'standard',
    vertex: standardVert,
    fragment: standardFrag,
};
let UID = 0;
export class StandardMaterial extends Shader {
    constructor(config, uniforms = {}) {
        super(dummyProgram, uniforms);
        this.id = UID++;
        this._config = config;
    }
    build(lightData, fog, isWebGL2) {
        var _a;
        const config = this._config;
        if (!this._built) {
            if (fog) {
                config.extensions.push(fogStandard);
            }
        }
        else {
            console.warn('[Standard Material] shader built again');
        }
        this._built = true;
        const highFragments = [
            config.modelMatrix,
            config.normalMatrix,
            config.uv,
            // color..
            config.normal,
            config.diffuse,
            config.alpha,
            config.specular,
            config.emissive,
            config.reflection,
            config.lights(lightData.lights),
            colorGamma,
            ...(_a = config.extensions) !== null && _a !== void 0 ? _a : [],
        ].filter((a) => !!a);
        const { vertex, fragment } = compileHighShader(isWebGL2, standardShaderTemplate, highFragments);
        this.program = Program.from(vertex, fragment);
    }
}
StandardMaterial.MAX_BONES = 20;
StandardMaterial.FAST_NORMALS = false;
/**
 * if true, then skinning bone data will be stored on textures rather than uniforms
 */
StandardMaterial.PREFER_TEXTURE = true;
