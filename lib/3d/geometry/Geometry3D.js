import { Geometry } from 'pixi.js';
export class Geometry3D extends Geometry {
    castToBaseGeometry() {
        return this;
    }
}
