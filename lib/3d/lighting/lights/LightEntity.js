import { Entity3D } from '../../core/Entity3D';
import { ShadowComponent } from '../shadows/ShadowComponent';
import { LightComponent } from './LightComponent';
export class LightEntity extends Entity3D {
    constructor(lightData = {}) {
        super();
        this.light = this.addComponent(LightComponent, lightData);
        this.name = lightData.name;
        if (lightData.castShadow) {
            this._addShadowCaster(lightData.shadowOptions);
        }
    }
    /**
     * adds a shadow caster to a light.
     * gotcha - make sure to add a shadow BEFORE the first render, or the shadow code will not be built in to the shader
     */
    _addShadowCaster(options = {}) {
        if (!this.shadow) {
            this.shadow = this.addComponent(ShadowComponent, Object.assign(Object.assign({}, options), { light: this }));
        }
    }
    set intensity(value) {
        this.light.intensity = value;
    }
    get intensity() {
        return this.light.intensity;
    }
    set distance(value) {
        this.light.distance = value;
    }
    get distance() {
        return this.light.distance;
    }
    set color(value) {
        this.light.color = value;
    }
    get color() {
        return this.light.color;
    }
    set softness(value) {
        this.light.softness = value;
    }
    get softness() {
        return this.light.softness;
    }
}
