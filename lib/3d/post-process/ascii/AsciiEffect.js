import { Program, Shader, Texture } from 'pixi.js';
import frag from './ascii.frag';
import vert from './ascii.vert';
export class AsciiShader extends Shader {
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
