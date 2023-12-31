import { Matrix4 } from '../../../math/matrix/Matrix4';
import { ObservablePoint3D } from '../../../math/point/ObservablePoint3D';
import { Euler } from '../../../math/rotation/Euler';
import { Quaternion } from '../../../math/rotation/Quaternion';
import { Vector3 } from '../../../math/vector/Vector3';
let tempVec;
let tempVec2;
let tempEuler;
let tempQuat;
let tempMatrix;
let UP;
export class TransformComponent {
    constructor(entity) {
        if (!tempVec) {
            tempVec = new Vector3();
            tempVec2 = new Vector3();
            tempEuler = new Euler();
            tempQuat = new Quaternion();
            tempMatrix = new Matrix4();
            UP = new Vector3(0, 1, 0);
        }
        this.entity = entity;
        this.custom = false;
        this.static = false;
        this.parent = null;
        this.position = new ObservablePoint3D(this._onChange, this, 0, 0, 0);
        this.scale = new ObservablePoint3D(this._onChange, this, 1, 1, 1);
        this.rotation = new ObservablePoint3D(this._onRotationChange, this, 0, 0, 0);
        this.localTransform = new Matrix4();
        this.worldTransform = new Matrix4();
        this.localID = 0;
        this.currentLocalID = -2;
        this.worldID = 0;
        this.parentID = -1;
        this.quat = new Quaternion();
        this.rotationDirty = true;
        this._oTick = -1;
        this.rTick = -1;
    }
    extractScale(out) {
        return this.worldTransform.extractScale(out);
    }
    /**
     * extracts the rotation matrix from the world transform (this is the global position, not local)
     * @param out - the matrix to write the rotation too
     */
    extractRotation(out) {
        // this method does not support reflection matrices
        return out.extractRotation(this.worldTransform);
    }
    extractPosition(out) {
        return this.worldTransform.extractPosition(out);
    }
    /**
     * Get the forward position of the object based on rotation, does not included world position
     * @param out - vector to assign the forward position to
     * @returns the forward position of the object
     */
    extractForward(out) {
        return this.worldTransform.extractForward(out);
    }
    addedToScene() {
        this._onRotationChange();
    }
    init(data) {
        if (data) {
            if (data.rotation)
                this.rotation.copyFrom(data.rotation);
            if (data.scale)
                this.scale.copyFrom(data.scale);
            if (data.position)
                this.position.copyFrom(data.position);
        }
    }
    reset() {
        this.localTransform.identity();
        this.worldTransform.identity();
        this.localID = 0;
        this.currentLocalID = -2;
        this.worldID = 0;
        this.parentID = -1;
    }
    applyMatrix(matrix) {
        const translation = tempVec;
        const quat = this.quat;
        const scale = tempVec2;
        matrix.decompose(translation, quat, scale);
        this.position.x = translation.x;
        this.position.y = translation.y;
        this.position.z = translation.z;
        this.scale.x = scale.x;
        this.scale.y = scale.y;
        this.scale.z = scale.z;
        tempEuler.setFromQuaternion(quat);
        this.rotation.x = tempEuler.x;
        this.rotation.y = tempEuler.y;
        this.rotation.z = tempEuler.z;
    }
    /**
     * this will make the entity face the target you tell it too.
     *
     * @param targetEntity - the thing to look at! As long as it has x / y / z property
     * @param step - the amount used to simulate a slerp
     */
    lookAt(targetEntity, step) {
        // This method does not support objects having non-uniformly-scaled parent(s)
        const q1 = tempQuat;
        const m1 = tempMatrix;
        const position = tempVec;
        const target = tempVec2;
        const parent = this.entity.parent;
        if (this.entity.scene) {
            (this.entity.scene).transform['_updateWorld'](this.entity, true);
        }
        target.x = targetEntity.x;
        target.y = targetEntity.y;
        target.z = targetEntity.z;
        position.setFromMatrixPosition(this.worldTransform);
        // TODO may need to flip for non camera of light??
        m1.lookAt(position, target, UP);
        if (step) {
            q1.setFromRotationMatrix(m1);
            this.quat.rotateTowards(q1, step);
        }
        else {
            this.quat.setFromRotationMatrix(m1);
        }
        if (parent) {
            m1.extractRotation(parent.transform.worldTransform);
            q1.setFromRotationMatrix(m1);
            this.quat.premultiply(q1.inverse());
        }
        this._onChange();
    }
    extractData() {
        return {
            rotation: { x: this.rotation.x, y: this.rotation.y, z: this.rotation.z },
            position: { x: this.position.x, y: this.position.y, z: this.position.z },
            scale: { x: this.scale.x, y: this.scale.y, z: this.scale.z },
        };
    }
    _onChange() {
        const entity = this.entity;
        const scene = entity.scene;
        if (scene) {
            const tS = scene.transform;
            this.localID++;
            if (!entity._gc && this._oTick !== tS['_tick']) {
                this._oTick = tS['_tick'];
                tS['_toUpdate'][tS['_updateCount']++] = entity;
            }
        }
    }
    _onRotationChange() {
        this.rotationDirty = true;
        this._onChange();
    }
}
TransformComponent.DEFAULT_NAME = 'transform';
