import { Entity3D } from '../3d/core/Entity3D';
import { BoxGeometry } from '../3d/geometry';
import { PhongMaterial } from '../3d/materials/phong/PhongMaterial';
export class DebugEntity extends Entity3D {
    constructor(size = 1) {
        const material = new PhongMaterial({ color: 0xFF0000 });
        super({
            geometry: new BoxGeometry(size, size, size),
            material,
        });
    }
}
