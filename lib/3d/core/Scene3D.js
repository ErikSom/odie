import { GroupSystem } from '../../core/groups/GroupSystem';
import { Scene } from '../../core/Scene';
import { ContainerSystem } from './container/ContainerSystem';
import { TransformSystem } from './transform/TransformSystem';
import { View3DSystem } from './view/View3DSystem';
export class Scene3D extends Scene {
    constructor(options) {
        super();
        this.register('onGameover');
        this.register('onGameComplete');
        this.group = this.addSystem(GroupSystem);
        this.transform = this.addSystem(TransformSystem);
        this.container = this.addSystem(ContainerSystem);
        this.view3d = this.addSystem(View3DSystem, options);
        this.groups = this.group.groups;
    }
    addChild(...entities) {
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            this.container.root.addChild(entity);
        }
    }
    removeChild(...entities) {
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            this.container.root.removeChild(entity);
        }
    }
}
