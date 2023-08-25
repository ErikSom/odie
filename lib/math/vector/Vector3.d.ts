import type { Rectangle } from 'pixi.js';
import type { Matrix3 } from '../matrix/Matrix3';
import type { Matrix4 } from '../matrix/Matrix4';
import type { Euler } from '../rotation/Euler';
import { Quaternion } from '../rotation/Quaternion';
import type { Cylindrical } from '../shapes/Cylindrical';
import type { Spherical } from '../shapes/Spherical';
export declare class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): this;
    setScalar(scalar: number): this;
    setX(x: number): this;
    setY(y: number): this;
    setZ(z: number): this;
    clone(): Vector3;
    copy(v: Vector3): this;
    add(v: Vector3): this;
    addScalar(s: number): this;
    addVectors(a: Vector3, b: Vector3): this;
    addScaledVector(v: Vector3, s: number): this;
    sub(v: Vector3): this;
    subScalar(s: number): this;
    subVectors(a: Vector3, b: Vector3): this;
    multiply(v: Vector3): this;
    multiplyScalar(scalar: number): this;
    multiplyVectors(a: Vector3, b: Vector3): this;
    applyEuler(euler: Euler): this;
    applyAxisAngle(axis: Vector3, angle: number): this;
    applyMatrix3(m: Matrix3): this;
    applyMatrix4(m: Matrix4): this;
    applyQuaternion(q: Quaternion): this;
    project(vec: Vector3, mat: Matrix4): this;
    unproject(vec: Vector3, viewport: Rectangle, invProjectionView: Matrix4): this;
    transformDirection(m: Matrix4): this;
    divide(v: Vector3): this;
    divideScalar(scalar: number): this;
    min(v: Vector3): this;
    max(v: Vector3): this;
    clamp(min: Vector3, max: Vector3): this;
    clampScalar(minVal: number, maxVal: number): this;
    clampLength(min: number, max: number): this;
    floor(): this;
    ceil(): this;
    round(): this;
    roundToZero(): this;
    negate(): this;
    dot(v: Vector3): number;
    lengthSq(): number;
    length(): number;
    manhattanLength(): number;
    normalize(): this;
    setLength(length: number): this;
    lerp(v: Vector3, alpha: number): this;
    lerpVectors(v1: Vector3, v2: Vector3, alpha: number): this;
    cross(v: Vector3): this;
    crossVectors(a: Vector3, b: Vector3): this;
    projectOnVector(vector: Vector3): this;
    projectOnPlane(planeNormal: Vector3): this;
    reflect(normal: Vector3): this;
    angleTo(v: Vector3): number;
    distanceTo(v: Vector3): number;
    distanceToSquared(v: Vector3): number;
    manhattanDistanceTo(v: Vector3): number;
    setFromSpherical(s: Spherical): this;
    setFromSphericalCoords(radius: number, phi: number, theta: number): this;
    setFromCylindrical(c: Cylindrical): this;
    setFromCylindricalCoords(radius: number, theta: number, y: number): this;
    setFromMatrixPosition(m: Matrix4): this;
    setFromMatrixScale(m: Matrix4): this;
    setFromMatrixColumn(m: Matrix4, index: number): this;
    equals(v: Vector3): boolean;
    fromArray(array: number[] | Float32Array, offset?: number): this;
    toArray(array: number[] | Float32Array, offset?: number): number[] | Float32Array;
    /**
     * Rounds each value in the Vector3 to a decimal point
     * @param decimal - the number of digits to round the decimals to
     * @returns the rounded Vector3
     */
    toFixed(decimal: number): Vector3;
}
//# sourceMappingURL=Vector3.d.ts.map