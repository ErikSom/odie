import type { Matrix4 } from '../../math';
import { Entity3D } from '../core/Entity3D';
export declare class BoneEntity extends Entity3D {
    userData: any;
    inverseBindMatrix: Matrix4;
    readonly type: string;
    readonly isBone: boolean;
    constructor(bindMatrix: Matrix4);
}
//# sourceMappingURL=BoneEntity.d.ts.map