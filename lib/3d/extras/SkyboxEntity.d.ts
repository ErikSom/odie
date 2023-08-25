import { Entity3D } from '../core/Entity3D';
export declare class SkyboxEntity extends Entity3D {
    /**
     * @example const skybox = new SkyboxEntity(Texture.from([
            'assets/skybox/TEXTURE_CUBE_MAP_POSITIVE_X.jpg',
            'assets/skybox/TEXTURE_CUBE_MAP_NEGATIVE_X.jpg',
            'assets/skybox/TEXTURE_CUBE_MAP_POSITIVE_Y.jpg',
            'assets/skybox/TEXTURE_CUBE_MAP_NEGATIVE_Y.jpg',
            'assets/skybox/TEXTURE_CUBE_MAP_POSITIVE_Z.jpg',
            'assets/skybox/TEXTURE_CUBE_MAP_NEGATIVE_Z.jpg']));
     * @param cubeTexture - texture array containing six sides of the skybox
     */
    constructor(cubeTexture: any);
}
//# sourceMappingURL=SkyboxEntity.d.ts.map