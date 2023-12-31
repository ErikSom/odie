import { utils } from 'pixi.js';
import { Matrix4 } from '../../../math/matrix/Matrix4';
import { Vector3 } from '../../../math/vector/Vector3';
import { Entity3D } from '../../core/Entity3D';
import { SphereGeometry } from '../../geometry';
import { PhongMaterial } from '../../materials/phong/PhongMaterial';
const LIGHT_DIRECTION = new Vector3(0, 0, -1);
const map = {
    0: 0,
    1: 0,
    2: 0,
};
export var LIGHT_TYPE;
(function (LIGHT_TYPE) {
    LIGHT_TYPE[LIGHT_TYPE["DIRECTIONAL"] = 0] = "DIRECTIONAL";
    LIGHT_TYPE[LIGHT_TYPE["POINT"] = 1] = "POINT";
    LIGHT_TYPE[LIGHT_TYPE["SPOTLIGHT"] = 2] = "SPOTLIGHT";
})(LIGHT_TYPE || (LIGHT_TYPE = {}));
/**
 *
 */
export class LightComponent {
    /**
     * @param entity - the entity to add the light component to
     * @param data - the light properties to set
     */
    constructor(entity, data) {
        var _a, _b;
        this._rotationMatrix = new Matrix4();
        this.entity = entity;
        this.type = (_a = data.type) !== null && _a !== void 0 ? _a : LIGHT_TYPE.DIRECTIONAL;
        this.lightId = `${this.type}_${map[this.type]++}`;
        this._color = new Float32Array(3);
        this._hexColor = 0x000000;
        this.dirty = false;
        this.color = (_b = data.color) !== null && _b !== void 0 ? _b : 0xFFFFFF;
        this.intensity = (data.intensity === undefined) ? 1 : data.intensity;
        this.output = new Float32Array(3);
        if (entity.groups.indexOf('_lights') === -1) {
            entity.groups.push('_lights');
        }
        // light direction..
        this.direction = new Vector3();
        this._dirtyTransformId = -1;
        // points
        this.distance = data.distance || 500;
        this.position = new Vector3(1.0, -400.0, 1.0);
        this.limit = new Float32Array([0, 0]);
        if (data.debug) {
            const geometry = new SphereGeometry(1);
            const material = new PhongMaterial({
                color: this.color,
                useLights: false,
            });
            data.debug = new Entity3D({
                geometry,
                material,
            });
            const secondSphere = new Entity3D({
                geometry,
                material,
            });
            data.debug.addChild(secondSphere);
            secondSphere.z = -1;
            secondSphere.scale.set(0.5);
            entity.addChild(data.debug);
        }
        this.radius = data.radius || Math.PI / 4;
        if (data.softness === undefined) {
            this.softness = 0.5;
        }
        else {
            this.softness = data.softness;
        }
    }
    render() {
        if (this.entity.transform.worldID !== this._dirtyTransformId) {
            this._dirtyTransformId = this.entity.transform.worldID;
            const direction = this.direction;
            const rotationMatrix = this.entity.transform.extractRotation(this._rotationMatrix);
            direction.copy(LIGHT_DIRECTION)
                .applyMatrix4(rotationMatrix);
            this.entity.transform.extractPosition(this.position);
        }
        if (!this.dirty)
            return;
        this.dirty = false;
        const output = this.output;
        const color = this._color;
        const limit = this.limit;
        const intensity = this._intensity;
        output[0] = Math.pow(color[0] * intensity, 2.2);
        output[1] = Math.pow(color[1] * intensity, 2.2);
        output[2] = Math.pow(color[2] * intensity, 2.2);
        limit[0] = Math.cos((1 - this.softness) * this.radius); // data.innerLimit || this.radius;// 0.43706003;
        limit[1] = Math.cos(this.radius); // data.outerLimit ||  Math.PI/4;
    }
    extractData() {
        return {
            distance: this.distance,
            color: this.color,
            type: this.type,
            intensity: this.intensity,
            softness: this.softness,
            radius: this.radius,
        };
    }
    init(data) {
        for (const i in data) {
            this[i] = data[i];
        }
    }
    set radius(value) {
        this._radius = value;
        this.dirty = true;
    }
    get radius() {
        return this._radius;
    }
    set softness(value) {
        this._softness = value;
        this.dirty = true;
    }
    get softness() {
        return this._softness;
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
LightComponent.DEFAULT_NAME = 'light';
