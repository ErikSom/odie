import { utils } from 'pixi.js';
let tick = 0;
/**
 * a light edit component lets you modify a light using the dat gui instance
 * it will modify the transform properties and the light properties
 * also some basic shadow properties
 * Adding a LightSystem will automatically attach this component to all lights in the scene
 */
export class LightEditComponent {
    constructor(entity, data) {
        var _a;
        this.entity = entity;
        this._movementRange = (_a = data.movementRange) !== null && _a !== void 0 ? _a : 10;
        this._gui = data.gui;
    }
    /**
     * internal function to allow as to use gui color picker
     */
    set lightColor(value) {
        if (typeof value === 'string') {
            value = utils.string2hex(value);
        }
        this.entity.light.color = value;
    }
    /**
     * internal function to allow as to use gui color picker
     */
    get lightColor() {
        return this.entity.light.color;
    }
    addedToScene() {
        const light = this.entity.light;
        const transform = this.entity.transform;
        if (!light)
            return;
        const gui = this._gui;
        const folder = gui.addFolder(this.entity.name || `light_${tick++}`);
        folder.addColor(this, 'lightColor');
        folder.add(light, 'intensity', 0, 2);
        const rotFolder = folder.addFolder('rotation');
        rotFolder.add(transform.rotation, 'x', -Math.PI, Math.PI);
        rotFolder.add(transform.rotation, 'y', -Math.PI, Math.PI);
        rotFolder.add(transform.rotation, 'z', -Math.PI, Math.PI);
        if (light.type > 0) {
            const posFolder = folder.addFolder('position');
            const range = this._movementRange;
            posFolder.add(transform.position, 'x', -range, range);
            posFolder.add(transform.position, 'y', -range, range);
            posFolder.add(transform.position, 'z', -range, range);
        }
        if (light.type === 2) {
            folder.add(light, 'radius', 0, Math.PI);
            folder.add(light, 'softness', 0, 1);
        }
        if (this.entity) {
            const shadowFolder = folder.addFolder('shadow');
            shadowFolder.add(this.entity.shadow, 'bias', 0, 0.006);
            shadowFolder.add(this.entity.shadow, 'poissonSpread', 1000, 20000);
        }
    }
}
