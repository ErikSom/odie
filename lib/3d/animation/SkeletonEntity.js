import { Matrix4 } from '../../math/matrix/Matrix4';
import { Entity3D } from '../core/Entity3D';
export class SkeletonEntity extends Entity3D {
    constructor(bones) {
        super();
        this.bones = bones.slice(0);
        this.boneInverses = [];
    }
    // on the fly
    calculateInverses() {
        this.boneInverses = [];
        for (let i = 0, il = this.bones.length; i < il; i++) {
            const inverse = new Matrix4();
            if (this.bones[i]) {
                if (this.bones[i].bindMatrix) {
                    inverse.getInverse(this.bones[i].bindMatrix);
                }
                else {
                    throw new Error('no bones!');
                }
            }
            this.boneInverses.push(inverse);
        }
    }
}
