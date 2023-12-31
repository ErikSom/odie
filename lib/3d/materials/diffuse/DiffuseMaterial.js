import { Program, Rectangle, Shader } from 'pixi.js';
import { colorGamma, diffuseStandard, modelMatrix, skinningStandard, uvsWithFrameStandard } from '../high-shader';
import { compileHighShader } from '../high-shader/compiler/compileHighShader';
import { dummyProgram } from '../high-shader/dummyProgram';
import diffuseFrag from './diffuse.frag';
import diffuseVert from './diffuse.vert';
export const diffuseShaderTemplate = {
    name: 'diffuse',
    vertex: diffuseVert,
    fragment: diffuseFrag,
};
/**
 * a really basic material that just shows a standard texture.
 * no normals or lighting!
 */
export class DiffuseMaterial extends Shader {
    constructor(uDiffuseMap, skinning = false) {
        super(dummyProgram, { uDiffuseMap, uMapFrame: new Rectangle(0, 0, 1, 1) });
        this.needsUpdate = true;
        this.skinning = skinning;
        const highFragments = [
            modelMatrix,
            uvsWithFrameStandard,
            diffuseStandard,
            colorGamma,
        ];
        if (skinning) {
            highFragments.push(skinningStandard);
        }
        const { vertex, fragment } = compileHighShader(false, diffuseShaderTemplate, highFragments);
        this.program = Program.from(vertex, fragment, 'diffuse-shader');
    }
    get uniforms() {
        return this.uniformGroup.uniforms;
    }
    set map(value) {
        this.uniforms.uDiffuseMap = value;
    }
    get map() {
        return this.uniforms.uDiffuseMap;
    }
    set opacity(value) {
        this.uniforms.opacity = value;
    }
    get opacity() {
        return this.uniforms.opacity;
    }
}
