import type { ComponentInterface } from '../../../core/ComponentInterface';
import type { Entity3D } from '../../core/Entity3D';
import type { Scene3D } from '../../core/Scene3D';
import type { LightEntity } from '../lights/LightEntity';
export interface ShadowOptions {
    /**
     * affects the edges of the shadow to 'soften them' too low, you get banding, to high its to hard!
     * adjust as required!
     */
    poissonSpread?: number;
    /**
     * a bias is useful to stop shadow dithering (mostly when objects are self shadowing)
     */
    bias?: number;
    /**
     * the light entity that this shadow component will cast from
     */
    light: LightEntity;
    /**
     * the larger the size if of the shadow map, the greater the resolution. Best to keep it po2!
     */
    size?: number;
    /**
     * set to true if you wan to visualize the shadow casting map
     */
    debug?: boolean;
}
/**
 * http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-16-shadow-mapping/
 *
 * Main responsibility of this class is to render shadow maps based on where the light is
 * We need one of these per shadow caster
 *
 * currently you manually need to create on these to have a shadow
 *
 */
export declare class ShadowComponent implements ComponentInterface<ShadowOptions, Entity3D, Scene3D> {
    readonly entity: Entity3D;
    frequency: number;
    refreshRate: number;
    bias: number;
    poissonSpread: number;
    private readonly _shadowMap;
    private readonly _shadowFramebuffer;
    private readonly _light;
    private readonly _shadowMaterial;
    private readonly _shadowMaterialSkinned;
    private readonly _shadowState;
    private readonly _debugSprite;
    private readonly _shadowUniforms;
    private readonly _shadowProjectionMatrix;
    private readonly _bounds;
    private readonly _shadowRenderGroup;
    constructor(entity: Entity3D, opts: ShadowOptions);
    addedToScene(scene: Scene3D): void;
    removedFromScene(scene: Scene3D): void;
    /**
     * renders all items in the renderList to the shadowMap texture
     */
    preDrawScene(): void;
    /**
     * add an entity to the render list. all its children will also be rendered
     * @param entity - entity to add to the render list
     */
    add(entity: Entity3D): void;
    /**
     * add an entity to the ignore list. all its children will also be ignored
     * @param entity - entity to add to the render list
     */
    ignore(entity: Entity3D): void;
}
//# sourceMappingURL=ShadowComponent.d.ts.map