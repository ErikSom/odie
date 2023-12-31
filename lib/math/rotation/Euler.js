/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { clamp } from '../Math';
import { Matrix4 } from '../matrix/Matrix4';
import { Quaternion } from './Quaternion';
export class Euler {
    constructor(x, y, z, order) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.order = order || Euler.DefaultOrder;
    }
    set(x, y, z, order) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.order = order || this.order;
        return this;
    }
    clone() {
        return new Euler(this.x, this.y, this.z, this.order);
    }
    copy(euler) {
        this.x = euler.x;
        this.y = euler.y;
        this.z = euler.z;
        this.order = euler.order;
        return this;
    }
    setFromRotationMatrix(m, order) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        const te = m.elements;
        const m11 = te[0];
        const m12 = te[4];
        const m13 = te[8];
        const m21 = te[1];
        const m22 = te[5];
        const m23 = te[9];
        const m31 = te[2];
        const m32 = te[6];
        const m33 = te[10];
        order = order || this.order;
        if (order === 'XYZ') {
            this.y = Math.asin(clamp(m13, -1, 1));
            if (Math.abs(m13) < 0.99999) {
                this.x = Math.atan2(-m23, m33);
                this.z = Math.atan2(-m12, m11);
            }
            else {
                this.x = Math.atan2(m32, m22);
                this.z = 0;
            }
        }
        else if (order === 'YXZ') {
            this.x = Math.asin(-clamp(m23, -1, 1));
            if (Math.abs(m23) < 0.99999) {
                this.y = Math.atan2(m13, m33);
                this.z = Math.atan2(m21, m22);
            }
            else {
                this.y = Math.atan2(-m31, m11);
                this.z = 0;
            }
        }
        else if (order === 'ZXY') {
            this.x = Math.asin(clamp(m32, -1, 1));
            if (Math.abs(m32) < 0.99999) {
                this.y = Math.atan2(-m31, m33);
                this.z = Math.atan2(-m12, m22);
            }
            else {
                this.y = 0;
                this.z = Math.atan2(m21, m11);
            }
        }
        else if (order === 'ZYX') {
            this.y = Math.asin(-clamp(m31, -1, 1));
            if (Math.abs(m31) < 0.99999) {
                this.x = Math.atan2(m32, m33);
                this.z = Math.atan2(m21, m11);
            }
            else {
                this.x = 0;
                this.z = Math.atan2(-m12, m22);
            }
        }
        else if (order === 'YZX') {
            this.z = Math.asin(clamp(m21, -1, 1));
            if (Math.abs(m21) < 0.99999) {
                this.x = Math.atan2(-m23, m22);
                this.y = Math.atan2(-m31, m11);
            }
            else {
                this.x = 0;
                this.y = Math.atan2(m13, m33);
            }
        }
        else if (order === 'XZY') {
            this.z = Math.asin(-clamp(m12, -1, 1));
            if (Math.abs(m12) < 0.99999) {
                this.x = Math.atan2(m32, m22);
                this.y = Math.atan2(m13, m11);
            }
            else {
                this.x = Math.atan2(-m23, m33);
                this.y = 0;
            }
        }
        else {
            console.warn(`ODIE: .setFromRotationMatrix() given unsupported order: ${order}`);
        }
        this.order = order;
        return this;
    }
    setFromQuaternion(q, order) {
        matrix.makeRotationFromQuaternion(q);
        return this.setFromRotationMatrix(matrix, order);
    }
    setFromVector3(v, order) {
        return this.set(v.x, v.y, v.z, order || this.order);
    }
    reorder(newOrder) {
        // WARNING: this discards revolution information -bhouston
        q.setFromEuler(this);
        return this.setFromQuaternion(q, newOrder);
    }
    equals(euler) {
        return (euler.x === this.x) && (euler.y === this.y) && (euler.z === this.z) && (euler.order === this.order);
    }
    toVector3(out) {
        return out.set(this.x, this.y, this.z);
    }
}
Euler.DefaultOrder = 'XYZ';
const matrix = new Matrix4();
const q = new Quaternion();
