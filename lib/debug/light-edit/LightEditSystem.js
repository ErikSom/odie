import { utils } from 'pixi.js';
import { copyToClipboard } from '../copyToClipboard';
import { getGUI } from '../debugGUI';
import { LightEditComponent } from './LightEditComponent';
/**
 * a light editing system build to complement the LightSystem interface
 * this will generate a json lights file that can then be used with the LightSystem
 * add this to you scene and then a dat gui will appear for each light you add to the scene.
 *
 * play around with the settings, then hit copy.
 * A json will be copied to the clipboard
 *
 */
export class LightEditSystem {
    constructor() {
        this._activeLights = [];
        this._gui = getGUI();
    }
    start() {
        this._ambientLight = this.scene.view3d.lights.ambientLight;
        const obj = { copy: () => {
                const data = this._activeLights.reduce((data, light) => {
                    const lightData = {
                        transform: light.transform.extractData(),
                        light: light.light.extractData(),
                    };
                    data[light.name] = lightData;
                    return data;
                }, {});
                data.ambientLight = {
                    intensity: this._ambientLight.intensity,
                    color: this._ambientLight.color,
                };
                copyToClipboard(JSON.stringify(data, null, 4));
                // eslint-disable-next-line no-console
                console.log('[light edit system] light data for you sir:');
                // eslint-disable-next-line no-console
                console.log(data);
            } };
        // add the ambient light...
        this._gui.add(obj, 'copy');
        const folder = this._gui.addFolder('ambient');
        // color
        folder.add(this._ambientLight, 'intensity', 0, 1);
        folder.addColor(this, 'ambientLightColor');
    }
    entityAddedToScene(entity) {
        if (entity.light) {
            entity.addComponent(LightEditComponent, { gui: this._gui });
            this._activeLights.push(entity);
        }
    }
    /**
     * internal function to allow as to use gui color picker
     */
    set ambientLightColor(value) {
        if (typeof value === 'string') {
            value = utils.string2hex(value);
        }
        this._ambientLight.color = value;
    }
    /**
     * internal function to allow as to use gui color picker
     */
    get ambientLightColor() {
        return this._ambientLight.color;
    }
}
