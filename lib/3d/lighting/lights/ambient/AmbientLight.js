import { utils } from 'pixi.js';
export class AmbientLight {
    constructor(color = 0xFFFFFF, intensity = 1) {
        this._color = new Float32Array(3);
        this._hexColor = 0x000000;
        this.color = color;
        this._intensity = intensity;
        this.output = new Float32Array(3);
        this.dirty = true;
    }
    update() {
        if (!this.dirty)
            return;
        this.dirty = false;
        const output = this.output;
        const color = this._color;
        const intensity = this._intensity;
        output[0] = Math.pow(color[0] * intensity, 2.2);
        output[1] = Math.pow(color[1] * intensity, 2.2);
        output[2] = Math.pow(color[2] * intensity, 2.2);
    }
    set color(value) {
        if (this._hexColor === value)
            return;
        this._hexColor = value;
        utils.hex2rgb(value, this._color);
        this.dirty = true;
    }
    get color() {
        return this._hexColor;
    }
    set intensity(value) {
        if (this._intensity === value)
            return;
        this._intensity = value;
        this.dirty = true;
    }
    get intensity() {
        return this._intensity;
    }
}
