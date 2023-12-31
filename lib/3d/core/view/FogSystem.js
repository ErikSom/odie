import { UniformGroup, utils } from 'pixi.js';
export class FogSystem {
    constructor(_entity, options) {
        this.fogUniforms = new UniformGroup({
            uFogColor: new Float32Array([1, 0, 0]),
            uFogDensity: 0.1,
            uFogNear: 20,
            uFogFar: 50,
        }, true);
        options.view3d.globalUniforms.uniforms.fog = this.fogUniforms;
        this.setData(options.fog);
    }
    setData(data) {
        var _a, _b, _c, _d;
        if (!data)
            return;
        this.color = (_a = data.color) !== null && _a !== void 0 ? _a : 0x000000;
        this.density = (_b = data.density) !== null && _b !== void 0 ? _b : 0.01;
        this.near = (_c = data.near) !== null && _c !== void 0 ? _c : 20;
        this.far = (_d = data.far) !== null && _d !== void 0 ? _d : 50;
    }
    set color(value) {
        this._hexFogColor = value;
        const uniforms = this.fogUniforms.uniforms;
        utils.hex2rgb(value, uniforms.uFogColor);
    }
    get color() {
        return this._hexFogColor;
    }
    set density(value) {
        const uniforms = this.fogUniforms.uniforms;
        this.fogUniforms.update();
        uniforms.uFogDensity = value;
    }
    get density() {
        const uniforms = this.fogUniforms.uniforms;
        return uniforms.uFogDensity;
    }
    set near(value) {
        const uniforms = this.fogUniforms.uniforms;
        this.fogUniforms.update();
        uniforms.uFogNear = value;
    }
    get near() {
        const uniforms = this.fogUniforms.uniforms;
        return uniforms.uFogNear;
    }
    set far(value) {
        const uniforms = this.fogUniforms.uniforms;
        this.fogUniforms.update();
        uniforms.uFogFar = value;
    }
    get far() {
        const uniforms = this.fogUniforms.uniforms;
        this.fogUniforms.update();
        return uniforms.uFogFar;
    }
}
FogSystem.DEFAULT_NAME = 'fog';
