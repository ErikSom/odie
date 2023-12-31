import { DRAW_MODES, State } from 'pixi.js';
import { Matrix3 } from '../../../math/matrix/Matrix3';
import { Box3 } from '../../../math/shapes/Box3';
import { Sphere } from '../../../math/shapes/Sphere';
import { Runner } from '../../../utils';
import { NOOP } from '../../../utils/helpers/Functions';
import { calculateBounds } from '../../geometry/utils/calculateBounds';
import { generateFaces } from '../../geometry/utils/generateFaces';
// @ts-ignore
State.prototype.onBlendChange = new Runner('onBlendChange', 1);
// eslint-disable-next-line accessor-pairs
Object.defineProperty(State.prototype, 'blend', {
    set(value) {
        if (!!(this.data & (1 << 0)) !== value) {
            this.data ^= (1 << 0);
            this.onBlendChange.run();
        }
    },
});
export class View3DComponent {
    constructor(entity, data) {
        this.entity = entity;
        this.data = data;
        this.zdist = 0;
        // TODO multiple geometries per container?
        this.draw = (data.draw === undefined) ? DRAW_MODES.TRIANGLES : data.draw;
        this._geometry = data.geometry;
        this._material = data.material;
        this._state = data.state;
        this.renderCustom = data.renderCustom;
        // this is where we cache the normal matrix
        // TODO, only create if we need?
        this._cachedNormal = new Matrix3();
        this.transformDirty = -1;
        this.orderBias = data.orderBias || 0;
        if (!this._state) {
            const state = new State();
            state.depthTest = true;
            state.culling = true;
            state.blend = false;
            state.clockwiseFrontFace = true;
            this._state = state;
        }
        // @ts-ignore
        this._state.onBlendChange.add(this);
        /**
         * determines if the object is renderable or not
         * (transforms will still be applied, it just wont get drawn to the screen)
         */
        this.renderable = true;
        this.group = [];
        this.instanced = false;
        this._layer = null;
        this.id = null;
        this.onChange = NOOP;
        this.tick = -1;
        this._dirtyBoundsId = -1;
        this.boundingSphere = new Sphere();
        this.boundingBox = new Box3();
        this.frustumCull = (data.frustumCull === undefined) ? true : data.frustumCull;
        this.layerId = data.layerId || 'default';
        this.shadowMaterial = data.shadowMaterial;
    }
    getBoundingSphere() {
        const transform = this.entity.transform;
        const boundingSphere = this.boundingSphere;
        if (this._dirtyBoundsId !== transform.worldID) {
            const geometry = this._geometry;
            if (!geometry.boundingBox) {
                this._addGeometryBounds(geometry);
            }
            // TODO: generateBounds doesn't currently generate bounds
            boundingSphere.copy(geometry.boundingSphere || this._generateBounds(geometry));
            boundingSphere.applyMatrix4(transform.worldTransform);
            this._dirtyBoundsId = transform.worldID;
        }
        return boundingSphere;
    }
    /** Creates an array of faces based on the entitiy's geometry
     * @returns an array of indices and vertices */
    getFaces() {
        let faces = this.geometry.faces;
        if (!faces) {
            faces = generateFaces(this.geometry);
        }
        return faces;
    }
    onBlendChange() {
        if (this._layer) {
            this._layer['_onChange'](this.entity);
        }
    }
    _addGeometryBounds(geometry) {
        const boundingBox = calculateBounds(geometry);
        geometry.boundingBox = boundingBox;
        geometry.boundingSphere = boundingBox.getBoundingSphere(new Sphere());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _generateBounds(_geometry) {
        console.warn('The geometry\'s bounds don\'t exist');
    }
    set state(value) {
        if (this._state === value)
            return;
        // @ts-ignore
        this._state.onBlendChange.remove(this);
        this._state = value;
        // @ts-ignore
        this._state.onBlendChange.add(this);
    }
    get state() {
        return this._state;
    }
    set material(value) {
        if (this._material === value)
            return;
        this._material = value;
        if (this._layer) {
            this._layer['_onChange'](this.entity);
        }
    }
    get material() {
        return this._material;
    }
    set geometry(value) {
        if (this._geometry === value)
            return;
        this._geometry = value;
        this._dirtyBoundsId = -1;
        if (this._layer) {
            this._layer['_onChange'](this.entity);
        }
    }
    get geometry() {
        return this._geometry;
    }
    set layer(value) {
        this._layer = value;
    }
    get layer() {
        let layer = this._layer;
        if (!layer)
            layer = this.entity.scene.view3d.layers.getLayer(this.layerId);
        return layer;
    }
}
View3DComponent.DEFAULT_NAME = 'view3d';
