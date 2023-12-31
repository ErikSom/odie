import { Program, Shader } from 'pixi.js';
import copyFrag from './copy.frag';
import copyVert from './copy.vert';
export class CopyPass extends Shader {
    constructor() {
        super(Program.from(copyVert, copyFrag), { uAlpha: 1 });
    }
    get uniforms() {
        return this.uniformGroup.uniforms;
    }
    get alpha() {
        return this.uniforms.uAlpha;
    }
    set alpha(value) {
        this.uniforms.uAlpha = value;
    }
}
