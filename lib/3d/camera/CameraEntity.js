import { Entity3D } from '../core/Entity3D';
import { CameraComponent } from './CameraComponent';
export class CameraEntity extends Entity3D {
    constructor(data = {}) {
        super();
        this.camera = this.addComponent(CameraComponent, data);
        this.position.z = 10;
    }
}
