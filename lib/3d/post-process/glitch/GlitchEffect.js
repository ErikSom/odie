import { Program, Shader, Texture } from 'pixi.js';
import frag from './glitch.frag';
import vert from './glitch.vert';
export class GlitchShader extends Shader {
    constructor() {
        const program = Program.from(vert, frag);
        super(program, { uSampler: Texture.EMPTY, uTime: 0 });
    }
    addChild(entity) {
        this.rootContainer.add(entity);
    }
    removeChild(entity) {
        this.rootContainer.remove(entity);
    }
}
