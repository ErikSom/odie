import { LightEntity } from './lights';
/**
 * light system is a super simple way to manage lights. it accepts a LightData
 * object that let us build out lights for the scene.
 *
 * This LightData object can be generated using the LightEditSystem
 */
export class LightSetupSystem {
    constructor(_entity, data = {}) {
        var _a, _b;
        const lightsData = (_a = data.data) !== null && _a !== void 0 ? _a : {};
        let totalLights = (_b = data.totalLights) !== null && _b !== void 0 ? _b : 0;
        this._data = data;
        // -1 cos ambient light..
        totalLights = Math.max(Object.keys(lightsData).length - 1, totalLights);
        this.lights = [];
        // make all lights!
        let id = 0;
        while (id++ < totalLights) {
            const light = new LightEntity();
            light.name = `light-${id}`;
            this.lights.push(light);
        }
        Object.keys(lightsData).forEach((key, i) => {
            if (key === 'ambientLight')
                return;
            const light = this.lights[i];
            const lightData = lightsData[key];
            light.name = key;
            light.transform.init(lightData.transform);
            light.light.init(lightData.light);
        });
    }
    start() {
        this.lights.forEach((light) => {
            this.scene.addChild(light);
        });
        const ambientLight = this.scene.view3d.lights.ambientLight;
        const ambientLightData = this._data.data.ambientLight;
        ambientLight.intensity = ambientLightData.intensity;
        ambientLight.color = ambientLightData.color;
    }
}
