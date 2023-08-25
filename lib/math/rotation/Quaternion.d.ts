import type { Matrix4 } from '../matrix/Matrix4';
import { Vector3 } from '../vector/Vector3';
import type { Euler } from './Euler';
export declare class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion;
    static slerpFlat(dst: number[], dstOffset: number, src0: number[], srcOffset0: number, src1: number[], srcOffset1: number, t: number): void;
    set(x: number, y: number, z: number, w: number): this;
    clone(): Quaternion;
    copy(quaternion: Quaternion): this;
    setFromEuler(euler: Euler): this;
    setFromAxisAngle(axis: Vector3, angle: number): this;
    setFromRotationMatrix(m: Matrix4): this;
    setFromUnitVectors(vFrom: Vector3, vTo: Vector3): this;
    angleTo(q: Quaternion): number;
    rotateTowards(q: Quaternion, step: number): this;
    inverse(): this;
    conjugate(): this;
    dot(v: Quaternion): number;
    lengthSq(): number;
    length(): number;
    normalize(): this;
    multiply(q: Quaternion): this;
    premultiply(q: Quaternion): this;
    multiplyQuaternions(a: Quaternion, b: Quaternion): this;
    slerp(qb: Quaternion, t: number): this;
    equals(q: Quaternion): boolean;
    fromArray(array: number[] | Float32Array, offset?: number): this;
    toArray(array: number[] | Float32Array, offset?: number): number[] | Float32Array;
}
//# sourceMappingURL=Quaternion.d.ts.map