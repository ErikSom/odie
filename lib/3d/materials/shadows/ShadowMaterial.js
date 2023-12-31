import { Program, Shader, Texture, UniformGroup } from 'pixi.js';
import { Matrix4 } from '../../../math/matrix/Matrix4';
import { alphaDiscard, alphaMap, generateSkinning, modelMatrix, uvsStandard } from '../high-shader';
import { compileHighShader } from '../high-shader/compiler/compileHighShader';
import { StandardMaterial } from '../high-shader/StandardMaterial';
import fragment from './shadow.frag';
import vertex from './shadow.vert';
/**
 * the Shader template for the shadow shader
 */
export const shadowTemplate = {
    name: 'shadow',
    vertex,
    fragment,
};
/**
 * a material used for rendering shadows!
 * its super simple and basically renders the depth of each object to the red channel of a pixel
 * supports skinning!
 * TODO - make sure instancing works too
 */
export class ShadowMaterial extends Shader {
    constructor(options = {}) {
        var _a;
        const highFragments = [
            modelMatrix,
        ];
        if (options.skinned) {
            highFragments.push(generateSkinning(StandardMaterial.MAX_BONES));
        }
        if (options.alphaMap) {
            highFragments.push(uvsStandard, alphaMap, alphaDiscard);
        }
        const { vertex, fragment } = compileHighShader(false, shadowTemplate, highFragments);
        const uniforms = UniformGroup.from({
            uModelMatrix: new Matrix4(),
            uAlphaTest: 0.5,
            uAlphaMap: (_a = options.alphaMap) !== null && _a !== void 0 ? _a : Texture.WHITE,
        });
        super(Program.from(vertex, fragment), uniforms);
    }
}
