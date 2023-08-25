import type { Entity } from '../../../core/Entity';
import type { SystemInterface } from '../../../core/SystemInterface';
import type { Entity3D } from '../Entity3D';
import type { Scene3D } from '../Scene3D';
import type { RenderParameters, ViewSubSystemOptions } from '.';
export declare class EntityRendererSystem implements SystemInterface<ViewSubSystemOptions> {
    static DEFAULT_NAME: string;
    scene: Scene3D;
    private readonly _view3dSystem;
    private _lastMaterial;
    constructor(_entity: Entity, opts?: ViewSubSystemOptions);
    flush(): void;
    /**
     * renders and draws an entity to the screen
     *
     * @param entity - the entity to render
     * @param renderSession - the current render session
     */
    renderEntity(entity: Entity3D, renderSession: RenderParameters): void;
}
//# sourceMappingURL=EntityRendererSystem.d.ts.map