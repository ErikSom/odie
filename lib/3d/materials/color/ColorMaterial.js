import { Program, Shader, UniformGroup, utils } from 'pixi.js';
import frag from './color.frag';
import vert from './color.vert';
export class ColorMaterial extends Shader {
    // TODO convert to new material creation method (same as phong)
    constructor(color = 0xFF0000) {
        const uniforms = UniformGroup.from({ uColor: utils.hex2rgb(color, new Float32Array(3)) });
        super(Program.from(vert, frag, 'color'), uniforms);
        this._color = color;
    }
    set color(color) {
        this._color = color !== null && color !== void 0 ? color : 0xFF0000;
        this.uniforms.color = utils.hex2rgb(color, this.uniforms.color);
    }
    get color() {
        return this._color;
    }
}
