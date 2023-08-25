import type { Shader, State, Texture } from 'pixi.js';
import { Entity3D } from '../../core/Entity3D';
/**
 * a billboard entity is essentially a 3D plane that always faces the camera.
 * (learn all about them here: http://www.opengl-tutorial.org/intermediate-tutorials/billboards-particles/billboards/)
 *
 * ```
 * const billboard = new BillboardEntity(Texture.from('sun.png'));
 * scene.addChild(billboard);
 * ```
 *
 * notes:
 * the size of a texture does not affect the size of the billboard.
 * a billboard is always 1x1 units in width. You can modify the x / y scale of the entity to change its size
 */
export declare class BillboardEntity extends Entity3D {
    /**
     *
     * @param texture - the texture on the billboard
     * @param state - a pixi state to use for this billboard
     * @param material - a material to use instead of the default on if you are feeling creative.
     */
    constructor(texture: Texture, state?: State, material?: Shader);
}
//# sourceMappingURL=BillboardEntity.d.ts.map