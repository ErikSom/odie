import { Texture } from '@pixi/core';
import { Matrix4 } from '../../math/matrix/Matrix4';
const tempMat = new Matrix4();
const tempMat2 = new Matrix4();
export class SkinnedComponent {
    constructor(entity, data) {
        this._dataTextureDirty = true;
        this.entity = entity;
        this._skeleton = data.skeleton;
        const dimensions = Math.ceil(Math.sqrt((data.skeleton.bones.length * 16) / 4));
        this._bonesTextureData = new Float32Array(dimensions * dimensions * 4);
        // use the _bonesTextureData as the base, that way they are the same and we only need to update one!
        this.bones = new Float32Array(this._bonesTextureData.buffer, 0, data.skeleton.bones.length * 16);
        this.bindMatrix = new Matrix4(data.bindMatrix);
        this.bindMatrixInverse = new Matrix4().getInverse(this.bindMatrix);
    }
    render() {
        const bones = this._skeleton.bones;
        const inverse = tempMat2.getInverse(this.entity.transform.worldTransform);
        for (let i = 0; i < bones.length; i++) {
            const bone = bones[i];
            const inverseBindMatrix = bone.inverseBindMatrix;
            const boneWorldMatrix = bone.transform.worldTransform;
            tempMat.multiplyMatrices(boneWorldMatrix, inverseBindMatrix)
                .premultiply(inverse);
            for (let j = 0; j < 16; j++) {
                this.bones[(i * 16) + j] = tempMat.elements[j];
            }
        }
        this._dataTextureDirty = true;
    }
    /**
     * will return a texture with the current bone matrices data stored on it.
     */
    get boneTexture() {
        if (this._dataTextureDirty) {
            if (!this._boneTexture) {
                const dimensions = Math.ceil(Math.sqrt((this._skeleton.bones.length * 16) / 4));
                this._boneTexture = Texture.fromBuffer(this._bonesTextureData, dimensions, dimensions);
            }
            this._boneTexture.baseTexture.dirtyId++;
        }
        return this._boneTexture;
    }
}
SkinnedComponent.DEFAULT_NAME = 'skinned';
