import { Program, Shader, Texture, WRAP_MODES } from 'pixi.js';
import frag from './displacment.frag';
import vert from './displacment.vert';
import { DoubleSpring as Spring } from './DoubleSpring';
export class TVGlitch extends Shader {
    constructor(options) {
        // WebGL only
        const program = Program.from(vert, frag);
        if (options.map) {
            options.map.baseTexture.wrapMode = WRAP_MODES.REPEAT;
        }
        super(program, { uSampler: Texture.EMPTY, uTime: 0, uMap: options.map, power: [0.1, 0.1], scale: [1, 1] });
        this.count = 0;
        this.spring = new Spring();
        this.count2 = 0;
        this.flickering = true;
    }
    update() {
        this.spring.update();
        this.count++;
        if (this.count > 200) {
            this.spring.dx = (5 + (Math.random() * 10)) * 0.75;
            this.count = Math.random() * 200;
            this.spring.dy = Math.random() * 5;
        }
        this.uniforms.power[0] = (0.01 + this.spring.x) * 0.01 * 0.5;
        this.uniforms.power[1] = (this.spring.y) * 0.01 * 0.5;
        this.uniforms.scale[1] = 1 + Number(Math.sin(this.count2));
        this.count2 += 0.1;
    }
    glitch() {
        this.count = 0;
        this.spring.dx = 15 + (Math.random() * 30);
        this.spring.dy = 5 + (Math.random() * 5);
    }
}
