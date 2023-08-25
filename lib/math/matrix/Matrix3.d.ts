import type { FixedNumberArray } from '../../utils';
import type { Matrix4 } from './Matrix4';
export declare class Matrix3 {
    elements: FixedNumberArray<9>;
    constructor();
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this;
    identity(): this;
    clone(): Matrix3;
    copy(m: Matrix3): this;
    setFromMatrix4(m: Matrix4): this;
    multiply(m: Matrix3): this;
    premultiply(m: Matrix3): this;
    multiplyMatrices(a: Matrix3, b: Matrix3): this;
    multiplyScalar(s: number): this;
    determinant(): number;
    getInverse(matrix: Matrix3, throwOnDegenerate?: boolean): this;
    transpose(): this;
    getNormalMatrix(matrix4: Matrix4): this;
    transposeIntoArray(r: number[] | FixedNumberArray<9>): this;
    setUvTransform(tx: number, ty: number, sx: number, sy: number, rotation: number, cx: number, cy: number): this;
    scale(sx: number, sy: number): this;
    rotate(theta: number): this;
    translate(tx: number, ty: number): this;
    equals(matrix: Matrix3): boolean;
    fromArray(array: FixedNumberArray<9>, offset?: number): this;
    toArray(array: FixedNumberArray<9>, offset?: number): FixedNumberArray<9>;
}
//# sourceMappingURL=Matrix3.d.ts.map