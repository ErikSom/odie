import { Signal } from 'typed-signals';
import { NOOP } from '../../../utils/helpers/Functions';
import { View3DComponent } from './View3DComponent';
const sortOpaque = (a, b) => {
    const aView3d = a.view3d;
    const bView3d = b.view3d;
    const aGeom = aView3d['_geometry'];
    const bGeom = bView3d['_geometry'];
    const aBase = aGeom.castToBaseGeometry();
    const bBase = bGeom.castToBaseGeometry();
    return (aView3d.orderBias - bView3d.orderBias)
        || (aView3d.state.data - bView3d.state.data)
        || (aView3d['_material'].program.id - bView3d['_material'].program.id) // @ts-ignore Materials error
        || (aView3d._material.id - bView3d._material.id)
        || (aBase.id - bBase.id);
    // || (aGeom.id - bGeom.id);// TODO remove when confident..
    //  || (aView3d.zdist - bView3d.zdist); // prolly not important..
};
const sortTransparent = (a, b) => {
    const aView3d = a.getComponent(View3DComponent);
    const bView3d = b.getComponent(View3DComponent);
    return ((aView3d.orderBias - bView3d.orderBias)
        || aView3d.zdist - bView3d.zdist);
    // TODO: figure out way to sort items through various methods
    // || (aView3d.orderBias - bView3d.orderBias)
    // || (aView3d.material.program.id - bView3d.material.program.id)
    // || (aView3d.material.id - bView3d.material.id)
    // || (aView3d.geometry.id - bView3d.geometry.id)
    // || (aView3d.state.data - bView3d.state.data);
};
/**
 * A layer is used to hold a group of entities that would be rendered together,
 * does not work in the same way as a PIXI display object in the sense of the layer being a parent
 */
export class Layer {
    /**
     * @param allowInstancing - set instance state
     * @param id - layer id
     * @param index - render index
     */
    constructor(id, index, allowInstancing = true) {
        this.opaqueRenderables = [];
        this.transparentRenderables = [];
        this._tick = 0;
        this.changedEntities = [];
        this._changedEntityCount = 0;
        this._allowInstancing = allowInstancing;
        this.renderIndex = index;
        this.id = id;
        this.onPreRender = new Signal();
        this.onPostRender = new Signal();
        this.visible = true;
    }
    /**
     * @param camera - a camera used to determine the zIndex of entities
     */
    update(camera) {
        this._tick++;
        let opaqueDirty = false;
        for (let i = 0; i < this._changedEntityCount; i++) {
            const entity = this.changedEntities[i];
            const view3d = entity.view3d;
            // this may have been removed
            // or actually being removed...
            // otherwise it may get added back in!
            if (entity._gc || !entity.scene)
                continue;
            const nextGroup = view3d['_state'].blend ? this.transparentRenderables : this.opaqueRenderables;
            if (view3d.group !== nextGroup) {
                if (view3d.group) {
                    const index = view3d.group.indexOf(entity);
                    if (index !== -1) {
                        view3d.group.splice(index, 1);
                    }
                }
                view3d.group = nextGroup;
                nextGroup.push(entity);
                if (nextGroup !== this.transparentRenderables) {
                    opaqueDirty = true;
                }
            }
        }
        if (opaqueDirty) {
            this.opaqueRenderables.sort(sortOpaque);
        }
        // currently always sort transparent..
        // always sort transparent ones by z..
        this._updateZDist(this.transparentRenderables, camera);
        this.transparentRenderables.sort(sortTransparent);
        this._changedEntityCount = 0;
    }
    /**
     * get all entities in the layer
     * @param out - an optional array to use instead of a newly instantiated one
     * @returns an array containing all entities from the opaqueRenderables and transparentRenderables arrays
     */
    getAll(out) {
        if (!out)
            out = [];
        out.push(...this.opaqueRenderables);
        out.push(...this.transparentRenderables);
        return out;
    }
    /**
     * Add an entity to the layer
     * @param entity - entity to be added
     */
    add(entity) {
        entity.view3d.layer = this;
        this._onChange(entity);
    }
    // TODO on change from instancing material to normal
    // TODO deal with blednmode changes
    // TODO - empty!!
    /**
     * Remove an entity from the layer
     * @param entity - the entity to be removed
     */
    remove(entity) {
        const view3d = entity.getComponent(View3DComponent);
        const group = view3d.group;
        if (group) {
            const index = group.indexOf(entity);
            if (index !== -1) {
                group.splice(index, 1);
            }
        }
        view3d.onChange = NOOP;
        view3d.group = null;
        view3d.layer = null;
        view3d.id = null;
        const index = this.changedEntities.indexOf(entity);
        if (index >= 0) {
            this.changedEntities.splice(index, 1);
            this._changedEntityCount--;
        }
    }
    /**
     * empty this layer's entity arrays and instances
     */
    empty() {
        this.opaqueRenderables.forEach((entity) => {
            entity.view3d.onChange = NOOP;
            entity.view3d.group = null;
            entity.view3d.layer = null;
            entity.view3d.id = null;
            entity.view3d.instanced = false;
        });
        this.transparentRenderables.forEach((entity) => {
            entity.view3d.onChange = NOOP;
            entity.view3d.group = null;
            entity.view3d.layer = null;
            entity.view3d.id = null;
            entity.view3d.instanced = false;
        });
        this.opaqueRenderables.length = 0;
        this.transparentRenderables.length = 0;
        this.changedEntities.length = 0;
        this._changedEntityCount = 0;
    }
    /**
     * determine the zIndex of entities
     * @param group - group of entities to test
     * @param camera - a camera used to determine the zIndex of entities
     */
    _updateZDist(group, camera) {
        const camFwd = camera.camera.forward;
        const camPos = camera.camera.position;
        const cx = camPos.x;
        const cy = camPos.y;
        const cz = camPos.z;
        const cfx = camFwd.x;
        const cfy = camFwd.y;
        const cfz = camFwd.z;
        for (let i = 0; i < group.length; i++) {
            const entity = group[i];
            // aabb? this shoiuld be the center of the items bounding box..
            const wt = entity.transform.worldTransform.elements;
            entity.view3d.zdist = -(((wt[12] - cx) * cfx) + ((wt[13] - cy) * cfy) + ((wt[14] - cz) * cfz));
        }
    }
    /**
     * Sets entity to change state ready to be assigned to an array (called when added to layer)
     * @param entity - the entity that has been changed
     */
    _onChange(entity) {
        const view3d = entity.view3d;
        if (!this._allowInstancing) {
            // @ts-ignore Materials error
            entity.getComponent(View3DComponent).material.instancing = false;
        }
        if (view3d.tick !== this._tick) {
            view3d.tick = this._tick;
            this.changedEntities[this._changedEntityCount++] = entity;
        }
    }
}
