import { Entity3D } from '../core/Entity3D';
export class BoneEntity extends Entity3D {
    constructor(bindMatrix) {
        super();
        // TODO: create a debug mode option.
        // super({
        //     geometry: new BoxGeometry(0.1, 0.1, 0.1),
        //     material:  new PhongMaterial({
        //         color: 0xFF0000,
        //         // emissiveColor: 0xFFCC00,
        //     }),
        // });
        this.userData = {};
        this.inverseBindMatrix = bindMatrix;
        this.type = 'Bone';
        this.isBone = true;
    }
}
