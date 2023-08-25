import { Matrix4 } from '../../math/matrix/Matrix4';
import { Entity3D } from '../core/Entity3D';
import type { BoneEntity } from './BoneEntity';
export declare class SkeletonEntity extends Entity3D {
    bones: BoneEntity[];
    boneInverses: Matrix4[];
    constructor(bones: BoneEntity[]);
    calculateInverses(): void;
}
//# sourceMappingURL=SkeletonEntity.d.ts.map