import { Shader } from 'pixi.js';
export interface CopyPassUniforms {
    uAlpha: number;
}
export declare class CopyPass extends Shader {
    constructor();
    get uniforms(): CopyPassUniforms;
    get alpha(): number;
    set alpha(value: number);
}
//# sourceMappingURL=CopyPass.d.ts.map