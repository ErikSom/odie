/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
export class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    get width() {
        return this.x;
    }
    set width(value) {
        this.x = value;
    }
    get height() {
        return this.y;
    }
    set height(value) {
        this.y = value;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
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
    clone() {
        return new Vector2(this.x, this.y);
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        return this;
    }
    addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }
    addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    subScalar(s) {
        this.x -= s;
        this.y -= s;
        return this;
    }
    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }
    divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }
    applyMatrix3(m) {
        const x = this.x;
        const y = this.y;
        const e = m.elements;
        this.x = (e[0] * x) + (e[3] * y) + e[6];
        this.y = (e[1] * x) + (e[4] * y) + e[7];
        return this;
    }
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    }
    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
    }
    clamp(min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        return this;
    }
    clampScalar(minVal, maxVal) {
        min.set(minVal, minVal);
        max.set(maxVal, maxVal);
        return this.clamp(min, max);
    }
    clampLength(min, max) {
        const length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    }
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
        return this;
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    dot(v) {
        return (this.x * v.x) + (this.y * v.y);
    }
    cross(v) {
        return (this.x * v.y) - (this.y * v.x);
    }
    lengthSq() {
        return (this.x * this.x) + (this.y * this.y);
    }
    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
        return this.divideScalar(this.length() || 1);
    }
    angle() {
        // computes the angle in radians with respect to the positive x-axis
        let angle = Math.atan2(this.y, this.x);
        if (angle < 0)
            angle += 2 * Math.PI;
        return angle;
    }
    distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }
    distanceToSquared(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return (dx * dx) + (dy * dy);
    }
    manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }
    setLength(length) {
        return this.normalize().multiplyScalar(length);
    }
    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    }
    lerpVectors(v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
    }
    equals(v) {
        return ((v.x === this.x) && (v.y === this.y));
    }
    fromArray(array, offset) {
        if (offset === undefined)
            offset = 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    }
    toArray(array, offset) {
        if (array === undefined)
            array = [];
        if (offset === undefined)
            offset = 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        return array;
    }
    // TODO add odie version!
    // fromBufferAttribute(attribute, index, offset)
    // {
    //     if (offset !== undefined)
    //     {
    //         console.warn('THREE.Vector2: offset has been removed from .fromBufferAttribute().');
    //     }
    //     this.x = attribute.getX(index);
    //     this.y = attribute.getY(index);
    //     return this;
    // }
    rotateAround(center, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const x = this.x - center.x;
        const y = this.y - center.y;
        this.x = (x * c) - (y * s) + center.x;
        this.y = (x * s) + (y * c) + center.y;
        return this;
    }
}
const min = new Vector2();
const max = new Vector2();
