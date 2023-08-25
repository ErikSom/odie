import { Matrix4 } from '../matrix/Matrix4';
import type { Vector3 } from '../vector/Vector3';
import { Quaternion } from './Quaternion';
export declare type RotationOrder = 'XYZ' | 'YZX' | 'ZXY' | 'XZY' | 'YXZ' | 'ZYX';
export declare class Euler {
    static DefaultOrder: RotationOrder;
    x: number;
    y: number;
    z: number;
    order: RotationOrder;
    constructor(x?: number, y?: number, z?: number, order?: RotationOrder);
    set(x: number, y: number, z: number, order?: RotationOrder): this;
    clone(): Euler;
    copy(euler: Euler): this;
    setFromRotationMatrix(m: Matrix4, order?: RotationOrder): this;
    setFromQuaternion(q: Quaternion, order?: RotationOrder): this;
    setFromVector3(v: Vector3, order?: RotationOrder): this;
    reorder(newOrder: RotationOrder): this;
    equals(euler: Euler): boolean;
    toVector3(out: Vector3): Vector3;
}
//# sourceMappingURL=Euler.d.ts.map