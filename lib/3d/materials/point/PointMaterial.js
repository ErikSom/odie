import { Program, Shader } from 'pixi.js';
import { dummyProgram } from '../high-shader/dummyProgram';
import frag from './point.frag';
import vert from './point.vert';
export class PointMaterial extends Shader {
    constructor(size, instancing = false) {
        super(dummyProgram, { opacity: 1, size });
        this.instancing = instancing;
        this.needsUpdate = true;
    }
    build() {
        let vertSource = vert;
        if (this.instancing) {
            vertSource = `#define INSTANCING\n${vert}`;
        }
        this.program = Program.from(vertSource, frag, 'diffuse-shader');
    }
    set opacity(value) {
        this.uniforms.opacity = value;
    }
    get opacity() {
        return this.uniforms.opacity;
    }
}
