import { State } from 'pixi.js';
import { Entity3D } from '../core/Entity3D';
import { BoxGeometry } from '../geometry/BoxGeometry';
import { SkyboxMaterial } from '../materials/skybox/SkyboxMaterial';
export class SkyboxEntity extends Entity3D {
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
    constructor(cubeTexture) {
        const geometry = new BoxGeometry(30, 30, 30);
        const material = new SkyboxMaterial(cubeTexture);
        const state = new State();
        state.blend = false;
        super({ geometry, material, state });
    }
}
