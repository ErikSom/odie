export class ContainerComponent {
    constructor(entity) {
        this.entity = entity;
        this.children = [];
        this.parent = null;
    }
    empty() {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].container.parent = null;
        }
        this.children.length = 0;
    }
    traverse(callback) {
        callback(this.entity);
        const children = this.children;
        for (let i = 0, l = children.length; i < l; i++) {
            children[i].container.traverse(callback);
        }
    }
    add(childEntity) {
        if (childEntity.parent) {
            const index = childEntity.parent.container.children.indexOf(childEntity);
            if (index !== -1) {
                childEntity.parent.container.children.splice(index, 1);
            }
        }
        childEntity.container.parent = this.entity;
        this.children.push(childEntity);
        // add all children to the world!
        if (this.entity.scene && !childEntity.scene) {
            this.entity.scene.addToScene(childEntity);
        }
    }
    removeAll() {
        for (let i = 0; i < this.children.length; i++) {
            const childEntity = this.children[i];
            if (this.entity.scene) {
                this.entity.scene.removeFromScene(childEntity);
            }
            childEntity.container.parent = null;
        }
        this.children.length = 0;
    }
    remove(childEntity) {
        const index = this.children.indexOf(childEntity);
        if (index !== -1) {
            this.children.splice(index, 1);
            if (this.entity.scene) {
                this.entity.scene.removeFromScene(childEntity);
            }
            childEntity.container.parent = null;
        }
    }
}
ContainerComponent.DEFAULT_NAME = 'container';
