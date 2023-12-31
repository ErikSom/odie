import { Program, Shader } from 'pixi.js';
import thresholdFrag from './threshold.frag';
import thresholdVert from './threshold.vert';
const thresholdUniforms = {
    luminosityThreshold: 0.9,
    smoothWidth: 0.03,
    defaultOpacity: 0,
    defaultColor: [0, 0, 0],
};
export class ThresholdPass extends Shader {
    constructor() {
        super(Program.from(thresholdVert, thresholdFrag), thresholdUniforms);
    }
}
