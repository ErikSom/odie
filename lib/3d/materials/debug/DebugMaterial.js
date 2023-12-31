import { Program, Shader, UniformGroup, utils } from 'pixi.js';
import frag from './debug.frag';
import vert from './debug.vert';
export class DebugMaterial extends Shader {
    constructor(color = 0xFF0000) {
        const uniforms = UniformGroup.from({ color: utils.hex2rgb(color, new Float32Array(3)) });
        super(Program.from(vert, frag), uniforms);
        this._color = color;
    }
    set color(color = 0xFF0000) {
        this._color = color;
        this.uniforms.color = utils.hex2rgb(color, this.uniforms.color);
    }
    get color() {
        return this._color;
    }
}
