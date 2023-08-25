import { Texture } from '@pixi/core';
import type { ComponentInterface } from '../../core';
import { Matrix4 } from '../../math/matrix/Matrix4';
import type { Entity3D } from '../core';
import type { SkeletonEntity } from './SkeletonEntity';
export interface SkinnedComponentOptions {
    skeleton: SkeletonEntity;
    bindMatrix?: Float32Array;
}
export declare class SkinnedComponent implements ComponentInterface<SkinnedComponentOptions, Entity3D> {
    static DEFAULT_NAME: string;
    readonly entity: Entity3D;
    readonly bindMatrix: Matrix4;
    readonly bindMatrixInverse: Matrix4;
    readonly bones: Float32Array;
    private readonly _skeleton;
    private readonly _bonesTextureData;
    private _dataTextureDirty;
    private _boneTexture;
    constructor(entity: Entity3D, data: SkinnedComponentOptions);
    render(): void;
    /**
     * will return a texture with the current bone matrices data stored on it.
     */
    get boneTexture(): Texture;
}
//# sourceMappingURL=SkinnedComponent.d.ts.map