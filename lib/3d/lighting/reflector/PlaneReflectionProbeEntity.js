import { Entity3D } from '../../core/Entity3D';
import { PlaneReflectionProbeComponent } from './PlaneReflectionProbeComponent';
import { RenderGroupComponent } from './RenderGroupComponent';
export class PlaneReflectionProbeEntity extends Entity3D {
    constructor(options = {}) {
        super();
        this.renderGroup = this.addComponent(RenderGroupComponent);
        this.reflectionProbe = this.addComponent(PlaneReflectionProbeComponent, options, 'reflectionProbe');
    }
    get reflection() {
        return this.reflectionProbe.reflectionTexture;
    }
    get refraction() {
        return this.reflectionProbe.refractionTexture;
    }
    get ignoreList() {
        return this.renderGroup.toIgnoreList;
    }
    get renderList() {
        return this.renderGroup.toRenderList;
    }
}
