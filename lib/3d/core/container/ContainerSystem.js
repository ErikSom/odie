import { Entity3D } from '../Entity3D';
import { ContainerComponent } from './ContainerComponent';
export class ContainerSystem {
    constructor(entity) {
        this.entity = entity;
        this.root = new Entity3D();
    }
    addedToScene() {
        this.entity.scene.addToScene(this.root);
    }
    reset() {
        this.root.container.empty();
    }
    entityAddedToScene(entity) {
        const container = entity.getComponent(ContainerComponent);
        if (!container)
            return;
        const children = container.children;
        for (let i = 0; i < children.length; i++) {
            this.entity.scene.addToScene(children[i]);
        }
    }
    entityRemovedFromScene(entity) {
        const container = entity.getComponent(ContainerComponent);
        if (!container)
            return;
        const children = container.children;
        for (let i = 0; i < children.length; i++) {
            this.entity.scene.removeFromScene(children[i]);
        }
    }
}
ContainerSystem.DEFAULT_NAME = 'container';
