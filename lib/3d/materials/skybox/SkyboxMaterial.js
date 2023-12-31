import { Program, Shader } from 'pixi.js';
import frag from './skybox.frag';
import vert from './skybox.vert';
export class SkyboxMaterial extends Shader {
    constructor(cubeTexture) {
        super(Program.from(vert, frag), { cubeTexture });
    }
}
