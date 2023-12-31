import { CameraEntity } from '../CameraEntity';
import { OrbitalComponent } from './OrbitalComponent';
export class OrbitalCameraEntity extends CameraEntity {
    constructor(data = {}) {
        super(data);
        this.addComponent(OrbitalComponent, data);
    }
}
