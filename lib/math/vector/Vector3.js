/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { clamp } from '../Math';
import { Quaternion } from '../rotation/Quaternion';
export class Vector3 {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        return this;
    }
    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.y = y;
        return this;
    }
    setZ(z) {
        this.z = z;
        return this;
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    }
    addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }
    addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    subScalar(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
    }
    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
    multiplyVectors(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    }
    applyEuler(euler) {
        if (!quaternion)
            quaternion = new Quaternion();
        return this.applyQuaternion(quaternion.setFromEuler(euler));
    }
    applyAxisAngle(axis, angle) {
        if (!quaternion)
            quaternion = new Quaternion();
        return this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
    }
    applyMatrix3(m) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const e = m.elements;
        this.x = (e[0] * x) + (e[3] * y) + (e[6] * z);
        this.y = (e[1] * x) + (e[4] * y) + (e[7] * z);
        this.z = (e[2] * x) + (e[5] * y) + (e[8] * z);
        return this;
    }
    applyMatrix4(m) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const e = m.elements;
        const w = 1 / ((e[3] * x) + (e[7] * y) + (e[11] * z) + e[15]);
        this.x = ((e[0] * x) + (e[4] * y) + (e[8] * z) + e[12]) * w;
        this.y = ((e[1] * x) + (e[5] * y) + (e[9] * z) + e[13]) * w;
        this.z = ((e[2] * x) + (e[6] * y) + (e[10] * z) + e[14]) * w;
        return this;
    }
    applyQuaternion(q) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const qx = q.x;
        const qy = q.y;
        const qz = q.z;
        const qw = q.w;
        // calculate quat * vector
        const ix = (qw * x) + (qy * z) - (qz * y);
        const iy = (qw * y) + (qz * x) - (qx * z);
        const iz = (qw * z) + (qx * y) - (qy * x);
        const iw = (-qx * x) - (qy * y) - (qz * z);
        // calculate result * inverse quat
        this.x = (ix * qw) + (iw * -qx) + (iy * -qz) - (iz * -qy);
        this.y = (iy * qw) + (iw * -qy) + (iz * -qx) - (ix * -qz);
        this.z = (iz * qw) + (iw * -qz) + (ix * -qy) - (iy * -qx);
        return this;
    }
    project(vec, mat) {
        const x = vec.x;
        const y = vec.y;
        const z = vec.z;
        const m = mat.elements;
        const a00 = m[0];
        const a01 = m[1];
        const a02 = m[2];
        const a03 = m[3];
        const a10 = m[4];
        const a11 = m[5];
        const a12 = m[6];
        const a13 = m[7];
        const a20 = m[8];
        const a21 = m[9];
        const a22 = m[10];
        const a23 = m[11];
        const a30 = m[12];
        const a31 = m[13];
        const a32 = m[14];
        const a33 = m[15];
        const lw = 1 / ((x * a03) + (y * a13) + (z * a23) + a33);
        this.x = ((x * a00) + (y * a10) + (z * a20) + a30) * lw;
        this.y = ((x * a01) + (y * a11) + (z * a21) + a31) * lw;
        this.z = ((x * a02) + (y * a12) + (z * a22) + a32) * lw;
        return this;
    }
    // out: vec3, vec: vec3, viewport: vec4, invProjectionView: mat4): vec3
    unproject(vec, viewport, invProjectionView) {
        const viewX = viewport.x;
        const viewY = viewport.y;
        const viewWidth = viewport.width;
        const viewHeight = viewport.height;
        let x = vec.x;
        let y = vec.y;
        const z = vec.z;
        x = x - viewX;
        y = viewHeight - y - 1;
        y = y - viewY;
        this.x = ((2 * x) / viewWidth) - 1;
        this.y = ((2 * y) / viewHeight) - 1;
        this.z = (z * 2) - 1;
        return this.project(this, invProjectionView);
    }
    transformDirection(m) {
        // input: Matrix4 affine matrix
        // vector interpreted as a direction
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const e = m.elements;
        this.x = (e[0] * x) + (e[4] * y) + (e[8] * z);
        this.y = (e[1] * x) + (e[5] * y) + (e[9] * z);
        this.z = (e[2] * x) + (e[6] * y) + (e[10] * z);
        return this.normalize();
    }
    divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }
    divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        return this;
    }
    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        return this;
    }
    clamp(min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        return this;
    }
    clampScalar(minVal, maxVal) {
        min.set(minVal, minVal, minVal);
        max.set(maxVal, maxVal, maxVal);
        return this.clamp(min, max);
    }
    clampLength(min, max) {
        const length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    }
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }
    roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
        return this;
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
    dot(v) {
        return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
    }
    // TODO lengthSquared?
    lengthSq() {
        return (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
    }
    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    normalize() {
        return this.divideScalar(this.length() || 1);
    }
    setLength(length) {
        return this.normalize().multiplyScalar(length);
    }
    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    }
    lerpVectors(v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
    }
    cross(v) {
        return this.crossVectors(this, v);
    }
    crossVectors(a, b) {
        const ax = a.x;
        const ay = a.y;
        const az = a.z;
        const bx = b.x;
        const by = b.y;
        const bz = b.z;
        this.x = (ay * bz) - (az * by);
        this.y = (az * bx) - (ax * bz);
        this.z = (ax * by) - (ay * bx);
        return this;
    }
    projectOnVector(vector) {
        const scalar = vector.dot(this) / vector.lengthSq();
        return this.copy(vector).multiplyScalar(scalar);
    }
    projectOnPlane(planeNormal) {
        v1.copy(this).projectOnVector(planeNormal);
        return this.sub(v1);
    }
    reflect(normal) {
        // reflect incident vector off plane orthogonal to normal
        // normal is assumed to have unit length
        return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
    }
    angleTo(v) {
        const theta = this.dot(v) / (Math.sqrt(this.lengthSq() * v.lengthSq()));
        // clamp, to handle numerical problems
        return Math.acos(clamp(theta, -1, 1));
    }
    distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }
    distanceToSquared(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return (dx * dx) + (dy * dy) + (dz * dz);
    }
    manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
    }
    setFromSpherical(s) {
        return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
    }
    setFromSphericalCoords(radius, phi, theta) {
        const sinPhiRadius = Math.sin(phi) * radius;
        this.x = sinPhiRadius * Math.sin(theta);
        this.y = Math.cos(phi) * radius;
        this.z = sinPhiRadius * Math.cos(theta);
        return this;
    }
    setFromCylindrical(c) {
        return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
    }
    setFromCylindricalCoords(radius, theta, y) {
        this.x = radius * Math.sin(theta);
        this.y = y;
        this.z = radius * Math.cos(theta);
        return this;
    }
    setFromMatrixPosition(m) {
        const e = m.elements;
        this.x = e[12];
        this.y = e[13];
        this.z = e[14];
        return this;
    }
    setFromMatrixScale(m) {
        const sx = this.setFromMatrixColumn(m, 0).length();
        const sy = this.setFromMatrixColumn(m, 1).length();
        const sz = this.setFromMatrixColumn(m, 2).length();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    }
    setFromMatrixColumn(m, index) {
        return this.fromArray(m.elements, index * 4);
    }
    equals(v) {
        return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
    }
    fromArray(array, offset) {
        if (offset === undefined)
            offset = 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
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
        return array;
    }
    // TODO do Odie version
    // fromBufferAttribute(attribute, index, offset)
    // {
    //     if (offset !== undefined)
    //     {
    //         console.warn('THREE.Vector3: offset has been removed from .fromBufferAttribute().');
    //     }
    //     this.x = attribute.getX(index);
    //     this.y = attribute.getY(index);
    //     this.z = attribute.getZ(index);
    //     return this;
    // }
    /**
     * Rounds each value in the Vector3 to a decimal point
     * @param decimal - the number of digits to round the decimals to
     * @returns the rounded Vector3
     */
    toFixed(decimal) {
        const pow = Math.pow(10, decimal);
        this.x = ((this.x * pow) | 0) / pow;
        this.y = ((this.y * pow) | 0) / pow;
        this.z = ((this.z * pow) | 0) / pow;
        return this;
    }
}
// temp variables...
let quaternion;
const min = new Vector3();
const max = new Vector3();
const v1 = new Vector3();
