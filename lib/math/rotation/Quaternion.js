/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
/* eslint-disable max-statements-per-line */
import { clamp } from '../Math';
import { Vector3 } from '../vector/Vector3';
export class Quaternion {
    constructor(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = (w !== undefined) ? w : 1;
    }
    static slerp(qa, qb, qm, t) {
        return qm.copy(qa).slerp(qb, t);
    }
    static slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
        // fuzz-free, array-based Quaternion SLERP operation
        let x0 = src0[srcOffset0 + 0];
        let y0 = src0[srcOffset0 + 1];
        let z0 = src0[srcOffset0 + 2];
        let w0 = src0[srcOffset0 + 3];
        const x1 = src1[srcOffset1 + 0];
        const y1 = src1[srcOffset1 + 1];
        const z1 = src1[srcOffset1 + 2];
        const w1 = src1[srcOffset1 + 3];
        if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
            let s = 1 - t;
            const cos = (x0 * x1) + (y0 * y1) + (z0 * z1) + (w0 * w1);
            const dir = (cos >= 0 ? 1 : -1);
            const sqrSin = 1 - (cos * cos);
            // Skip the Slerp for tiny steps to avoid numeric problems:
            if (sqrSin > Number.EPSILON) {
                const sin = Math.sqrt(sqrSin);
                const len = Math.atan2(sin, cos * dir);
                s = Math.sin(s * len) / sin;
                t = Math.sin(t * len) / sin;
            }
            const tDir = t * dir;
            x0 = (x0 * s) + (x1 * tDir);
            y0 = (y0 * s) + (y1 * tDir);
            z0 = (z0 * s) + (z1 * tDir);
            w0 = (w0 * s) + (w1 * tDir);
            // Normalize in case we just did a lerp:
            if (s === 1 - t) {
                const f = 1 / Math.sqrt((x0 * x0) + (y0 * y0) + (z0 * z0) + (w0 * w0));
                x0 *= f;
                y0 *= f;
                z0 *= f;
                w0 *= f;
            }
        }
        dst[dstOffset] = x0;
        dst[dstOffset + 1] = y0;
        dst[dstOffset + 2] = z0;
        dst[dstOffset + 3] = w0;
    }
    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    clone() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }
    copy(quaternion) {
        this.x = quaternion.x;
        this.y = quaternion.y;
        this.z = quaternion.z;
        this.w = quaternion.w;
        return this;
    }
    setFromEuler(euler) {
        const x = euler.x;
        const y = euler.y;
        const z = euler.z;
        const order = euler.order;
        // http://www.mathworks.com/matlabcentral/fileexchange/
        // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
        //	content/SpinCalc.m
        const cos = Math.cos;
        const sin = Math.sin;
        const c1 = cos(x / 2);
        const c2 = cos(y / 2);
        const c3 = cos(z / 2);
        const s1 = sin(x / 2);
        const s2 = sin(y / 2);
        const s3 = sin(z / 2);
        if (order === 'XYZ') {
            this.x = (s1 * c2 * c3) + (c1 * s2 * s3);
            this.y = (c1 * s2 * c3) - (s1 * c2 * s3);
            this.z = (c1 * c2 * s3) + (s1 * s2 * c3);
            this.w = (c1 * c2 * c3) - (s1 * s2 * s3);
        }
        else if (order === 'YXZ') {
            this.x = (s1 * c2 * c3) + (c1 * s2 * s3);
            this.y = (c1 * s2 * c3) - (s1 * c2 * s3);
            this.z = (c1 * c2 * s3) - (s1 * s2 * c3);
            this.w = (c1 * c2 * c3) + (s1 * s2 * s3);
        }
        else if (order === 'ZXY') {
            this.x = (s1 * c2 * c3) - (c1 * s2 * s3);
            this.y = (c1 * s2 * c3) + (s1 * c2 * s3);
            this.z = (c1 * c2 * s3) + (s1 * s2 * c3);
            this.w = (c1 * c2 * c3) - (s1 * s2 * s3);
        }
        else if (order === 'ZYX') {
            this.x = (s1 * c2 * c3) - (c1 * s2 * s3);
            this.y = (c1 * s2 * c3) + (s1 * c2 * s3);
            this.z = (c1 * c2 * s3) - (s1 * s2 * c3);
            this.w = (c1 * c2 * c3) + (s1 * s2 * s3);
        }
        else if (order === 'YZX') {
            this.x = (s1 * c2 * c3) + (c1 * s2 * s3);
            this.y = (c1 * s2 * c3) + (s1 * c2 * s3);
            this.z = (c1 * c2 * s3) - (s1 * s2 * c3);
            this.w = (c1 * c2 * c3) - (s1 * s2 * s3);
        }
        else if (order === 'XZY') {
            this.x = (s1 * c2 * c3) - (c1 * s2 * s3);
            this.y = (c1 * s2 * c3) - (s1 * c2 * s3);
            this.z = (c1 * c2 * s3) + (s1 * s2 * c3);
            this.w = (c1 * c2 * c3) + (s1 * s2 * s3);
        }
        return this;
    }
    setFromAxisAngle(axis, angle) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
        // assumes axis is normalized
        const halfAngle = angle / 2;
        const s = Math.sin(halfAngle);
        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = Math.cos(halfAngle);
        return this;
    }
    setFromRotationMatrix(m) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
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
        const trace = m11 + m22 + m33;
        let s;
        if (trace > 0) {
            s = 0.5 / Math.sqrt(trace + 1.0);
            this.w = 0.25 / s;
            this.x = (m32 - m23) * s;
            this.y = (m13 - m31) * s;
            this.z = (m21 - m12) * s;
        }
        else if (m11 > m22 && m11 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
            this.w = (m32 - m23) / s;
            this.x = 0.25 * s;
            this.y = (m12 + m21) / s;
            this.z = (m13 + m31) / s;
        }
        else if (m22 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
            this.w = (m13 - m31) / s;
            this.x = (m12 + m21) / s;
            this.y = 0.25 * s;
            this.z = (m23 + m32) / s;
        }
        else {
            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
            this.w = (m21 - m12) / s;
            this.x = (m13 + m31) / s;
            this.y = (m23 + m32) / s;
            this.z = 0.25 * s;
        }
        return this;
    }
    setFromUnitVectors(vFrom, vTo) {
        // assumes direction vectors vFrom and vTo are normalized
        // TODO circular
        if (!v1)
            v1 = new Vector3();
        let r;
        const EPS = 0.000001;
        r = vFrom.dot(vTo) + 1;
        if (r < EPS) {
            r = 0;
            if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                v1.set(-vFrom.y, vFrom.x, 0);
            }
            else {
                v1.set(0, -vFrom.z, vFrom.y);
            }
        }
        else {
            v1.crossVectors(vFrom, vTo);
        }
        this.x = v1.x;
        this.y = v1.y;
        this.z = v1.z;
        this.w = r;
        return this.normalize();
    }
    angleTo(q) {
        return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
    }
    rotateTowards(q, step) {
        const angle = this.angleTo(q);
        if (angle === 0)
            return this;
        const t = Math.min(1, step / angle);
        this.slerp(q, t);
        return this;
    }
    inverse() {
        // quaternion is assumed to have unit length
        return this.conjugate();
    }
    conjugate() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }
    dot(v) {
        return (this.x * v.x) + (this.y * v.y) + (this.z * v.z) + (this.w * v.w);
    }
    lengthSq() {
        return (this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w);
    }
    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
    }
    normalize() {
        let l = this.length();
        if (l === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        }
        else {
            l = 1 / l;
            this.x = this.x * l;
            this.y = this.y * l;
            this.z = this.z * l;
            this.w = this.w * l;
        }
        return this;
    }
    multiply(q) {
        return this.multiplyQuaternions(this, q);
    }
    premultiply(q) {
        return this.multiplyQuaternions(q, this);
    }
    multiplyQuaternions(a, b) {
        // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
        const qax = a.x;
        const qay = a.y;
        const qaz = a.z;
        const qaw = a.w;
        const qbx = b.x;
        const qby = b.y;
        const qbz = b.z;
        const qbw = b.w;
        this.x = (qax * qbw) + (qaw * qbx) + (qay * qbz) - (qaz * qby);
        this.y = (qay * qbw) + (qaw * qby) + (qaz * qbx) - (qax * qbz);
        this.z = (qaz * qbw) + (qaw * qbz) + (qax * qby) - (qay * qbx);
        this.w = (qaw * qbw) - (qax * qbx) - (qay * qby) - (qaz * qbz);
        return this;
    }
    slerp(qb, t) {
        if (t === 0)
            return this;
        if (t === 1)
            return this.copy(qb);
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const w = this.w;
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
        let cosHalfTheta = (w * qb.w) + (x * qb.x) + (y * qb.y) + (z * qb.z);
        if (cosHalfTheta < 0) {
            this.w = -qb.w;
            this.x = -qb.x;
            this.y = -qb.y;
            this.z = -qb.z;
            cosHalfTheta = -cosHalfTheta;
        }
        else {
            this.copy(qb);
        }
        if (cosHalfTheta >= 1.0) {
            this.w = w;
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }
        const sqrSinHalfTheta = 1.0 - (cosHalfTheta * cosHalfTheta);
        if (sqrSinHalfTheta <= Number.EPSILON) {
            const s = 1 - t;
            this.w = (s * w) + (t * this.w);
            this.x = (s * x) + (t * this.x);
            this.y = (s * y) + (t * this.y);
            this.z = (s * z) + (t * this.z);
            return this.normalize();
        }
        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
        this.w = ((w * ratioA) + (this.w * ratioB));
        this.x = ((x * ratioA) + (this.x * ratioB));
        this.y = ((y * ratioA) + (this.y * ratioB));
        this.z = ((z * ratioA) + (this.z * ratioB));
        return this;
    }
    equals(q) {
        return (q.x === this.x) && (q.y === this.y) && (q.z === this.z) && (q.w === this.w);
    }
    fromArray(array, offset) {
        if (offset === undefined)
            offset = 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        this.w = array[offset + 3];
        return this;
    }
    toArray(array, offset) {
        if (array === undefined)
            array = [];
        if (offset === undefined)
            offset = 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        array[offset + 3] = this.w;
        return array;
    }
}
let v1 = null;
