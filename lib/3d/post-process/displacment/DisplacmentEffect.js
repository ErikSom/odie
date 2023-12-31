import { Program, Shader, Texture } from 'pixi.js';
import frag from './displacment.frag';
import vert from './displacment.vert';
export class DisplacmentEffect extends Shader {
    constructor(options) {
        const program = Program.from(vert, frag);
        super(program, { uSampler: Texture.EMPTY, uTime: 0, uMap: options.map, power: [0.1, 0.1] });
    }
    setPower(x, y) {
        this.uniforms.power[0] = x;
        this.uniforms.power[1] = y;
    }
}
