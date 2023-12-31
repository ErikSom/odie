import { Entity } from '../../core/Entity';
import { View2DComponent } from './view/View2DComponent';
export class Entity2D extends Entity {
    constructor(view2dData = {}) {
        super();
        this.view2d = this.addComponent(View2DComponent, view2dData);
        this.transform = this.view.transform;
    }
    get view() {
        return this.view2d.view;
    }
    get position() {
        return this.transform.position;
    }
    get scale() {
        return this.transform.scale;
    }
    get rotation() {
        return this.transform.rotation;
    }
    set x(value) {
        this.transform.position.x = value;
    }
    get x() {
        return this.transform.position.x;
    }
    set y(value) {
        this.transform.position.y = value;
    }
    get y() {
        return this.transform.position.y;
    }
    set scaleX(value) {
        this.transform.scale.x = value;
    }
    get scaleX() {
        return this.transform.scale.x;
    }
    set scaleY(value) {
        this.transform.scale.y = value;
    }
    get scaleY() {
        return this.transform.scale.x;
    }
}
