import type { CameraEntity } from '../3d';
import { Entity3D } from '../3d/core/Entity3D';
import type { ComponentInterface, Scene } from '../core';
/**
 * The cull component (working with CullingSystem) will hide and show
 * entities based on weather or not they are seen by the camera
 *
 * We automatically generate a bounding sphere for the geometry and then cache it.
 *
 * This can improve performance, but the calculation can be expensive so it won't be a magic bullet for
 * huge scenes!
 *
 * This is best used as a precision final layer of culling after some broad phase culling
 */
export declare class CameraDebugComponent implements ComponentInterface<null, CameraEntity> {
    static DEFAULT_NAME: string;
    frustumView: Entity3D;
    readonly entity: CameraEntity;
    /**
     *
     * @param entity - the entity the component will be added to
     * @param data - options for this component
     */
    constructor(entity: CameraEntity);
    addedToScene(scene: Scene): void;
    removedFromScene(scene: OdieAny): void;
    render(): void;
}
//# sourceMappingURL=CameraDebugComponent.d.ts.map