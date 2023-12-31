import { State } from 'pixi.js';
import { Entity } from '../../core/Entity';
import { ContainerComponent } from './container/ContainerComponent';
import { TransformComponent } from './transform/TransformComponent';
import { View3DComponent } from './view/View3DComponent';
export class Entity3D extends Entity {
    constructor(view3dData) {
        super();
        /**
         * used internally in the engine to know if this entity needs / updating or rendering
         */
        this._worldActive = true;
        this._active = true;
        this.container = this.addComponent(ContainerComponent);
        this.transform = this.addComponent(TransformComponent);
        if (view3dData) {
            if (!view3dData.state) {
                const state = new State();
                state.depthTest = true;
                state.blend = false;
                state.culling = true;
                view3dData.state = state;
            }
            this.view3d = this.addComponent(View3DComponent, view3dData);
        }
    }
    addChild(...entities) {
        for (let i = 0; i < entities.length; i++) {
            this.container.add(entities[i]);
        }
    }
    removeChild(...entities) {
        for (let i = 0; i < entities.length; i++) {
            this.container.remove(entities[i]);
        }
    }
    removeChildren() {
        this.container.removeAll();
    }
    //	POSITION
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
    set z(value) {
        this.transform.position.z = value;
    }
    get z() {
        return this.transform.position.z;
    }
    // scale
    set sx(value) {
        this.transform.scale.x = value;
    }
    get sx() {
        return this.transform.scale.x;
    }
    set sy(value) {
        this.transform.scale.y = value;
    }
    get sy() {
        return this.transform.scale.y;
    }
    set sz(value) {
        this.transform.scale.z = value;
    }
    get sz() {
        return this.transform.scale.z;
    }
    // rotation
    set rx(value) {
        this.transform.rotation.x = value;
    }
    get rx() {
        return this.transform.rotation.x;
    }
    set ry(value) {
        this.transform.rotation.y = value;
    }
    get ry() {
        return this.transform.rotation.y;
    }
    set rz(value) {
        this.transform.rotation.z = value;
    }
    get rz() {
        return this.transform.rotation.z;
    }
    // object accessors..
    get position() {
        return this.transform.position;
    }
    get scale() {
        return this.transform.scale;
    }
    get rotation() {
        return this.transform.rotation;
    }
    set active(value) {
        this._active = value;
        const isActive = this.parent ? (this.parent._worldActive && value) : value;
        if (isActive !== this._worldActive) {
            this._worldActive = isActive;
            if (isActive) {
                this.runners.activate.run();
            }
            else {
                this.runners.deactivate.run();
            }
        }
        const children = this.container.children;
        for (let i = 0; i < children.length; i++) {
            children[i].active = isActive;
        }
    }
    get active() {
        return this._active;
    }
    get parent() {
        return this.container.parent;
    }
}
