import { Entity3D } from '../../core/Entity3D';
import { ReflectionProbeComponent } from './ReflectionProbeComponent';
import { RenderGroupComponent } from './RenderGroupComponent';
export class ReflectionProbeEntity extends Entity3D {
    // TODO refactor to use RenderGroup
    constructor(options = {}) {
        super();
        this.renderGroup = this.addComponent(RenderGroupComponent);
        this.reflectionProbe = this.addComponent(ReflectionProbeComponent, options);
    }
    get cubeTexture() {
        return this.reflectionProbe.cubeTexture;
    }
    get ignoreList() {
        return this.renderGroup.toIgnoreList;
    }
    get renderList() {
        return this.renderGroup.toRenderList;
    }
}
