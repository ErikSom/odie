import type { FixedNumberArray } from '../../utils';
import type { Euler } from '../rotation/Euler';
import type { Quaternion } from '../rotation/Quaternion';
import type { Plane } from '../shapes/Plane';
import { Vector3 } from '../vector/Vector3';
export declare class Matrix4 {
    elements: FixedNumberArray<16>;
    constructor(elements?: FixedNumberArray<16>);
    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): this;
    identity(): this;
    clone(): Matrix4;
    copy(m: Matrix4): this;
    copyPosition(m: Matrix4): this;
    extractBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): this;
    makeBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): this;
    extractRotation(m: Matrix4): this;
    makeRotationFromEuler(euler: Euler): this;
    makeRotationFromQuaternion(q: Quaternion): this;
    /**
     * modifies the matrix such that it rotates to look in the direction of the
     * of the target relative to the eye. This on modifies rotation
     * @param eye - the eye position
     * @param center - the target that the eye will look at
     * @param up - which way is up?
     */
    lookAt(eye: Vector3, target: Vector3, up: Vector3): this;
    /**
     * This lookat function rotates to look at a target but also positions the matrix too
     *
     * @param eye - the eye position
     * @param center - the target that the eye will look at
     * @param up - which way is up?
     */
    lookAtMove(eye: Vector3, center: Vector3, up: Vector3): this;
    multiply(m: Matrix4): this;
    premultiply(m: Matrix4): this;
    multiplyMatrices(a: Matrix4, b: Matrix4): this;
    multiplyScalar(s: number): this;
    determinant(): number;
    transpose(): this;
    setPosition(v: Vector3): this;
    extractPosition(out: Vector3): Vector3;
    /**
     * Get the forward position of the matrix based on rotation
     * @param out - vector to assign the forward position to
     * @returns the forward postion of the matrix
     */
    getInverse(m: Matrix4, throwOnDegenerate?: boolean): this;
    scale(v: Vector3): this;
    extractScale(out: Vector3): Vector3;
    getMaxScaleOnAxis(): number;
    makeTranslation(x: number, y: number, z: number): this;
    makeRotationX(theta: number): this;
    makeRotationY(theta: number): this;
    makeRotationZ(theta: number): this;
    makeRotationAxis(axis: Vector3, angle: number): this;
    makeScale(x: number, y: number, z: number): this;
    makeShear(x: number, y: number, z: number): this;
    compose(position: Vector3, quaternion: Quaternion, scale: Vector3): this;
    decompose(position: Vector3, quaternion: Quaternion, scale: Vector3): this;
    makePerspective(fovy: number, aspect: number, near: number, far?: number): this;
    makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
    equals(matrix: Matrix4): boolean;
    fromArray(array: FixedNumberArray<16>, offset?: number): this;
    toArray(array: FixedNumberArray<16>, offset?: number): FixedNumberArray<16>;
    log(): void;
    /**
     * reflects the matrix using a plane (imagine it was a bit mirror!)
     * @param plane - the plane to reflect he matrix on
     */
    reflectOnPlane(plane: Plane): this;
    /**
     * Extract a vector representing FORWARD orientation
     * From identity matrix will be Vector3(0, 0, -1)
     * @param out - Vector that will receive XYZ values
     */
    extractForward(out: Vector3): Vector3;
    /**
     * Extract a vector representing RIGHT orientation
     * From identity matrix will be Vector3(1, 0, 0)
     * @param out - Vector that will receive XYZ values
     */
    extractRight(out: Vector3): Vector3;
    /**
     * Extract a vector representing UP orientation
     * From identity matrix will be Vector3(0, 1, 0)
     * @param out - Vector that will receive XYZ values
     */
    extractUp(out: Vector3): Vector3;
    /**
     * Extract a vector representing BACK orientation
     * From identity matrix will be Vector3(0, 0, 1)
     * @param out - Vector that will receive XYZ values
     */
    extractBack(out: Vector3): Vector3;
    /**
     * Extract a vector representing LEFT orientation
     * From identity matrix will be Vector3(-1, 0, 0)
     * @param out - Vector that will receive XYZ values
     */
    extractLeft(out: Vector3): Vector3;
    /**
     * Extract a vector representing DOWN orientation
     * From identity matrix will be Vector3(0, -1, 0)
     * @param out - Vector that will receive XYZ values
     */
    extractDown(out: Vector3): Vector3;
}
//# sourceMappingURL=Matrix4.d.ts.map