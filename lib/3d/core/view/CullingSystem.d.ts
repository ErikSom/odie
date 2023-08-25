import type { TransformComponent, View3DComponent } from '../..';
import type { Scene, SystemInterface } from '../../../core';
import type { CameraEntity } from '../../camera/CameraEntity';
import type { Entity3D } from '../Entity3D';
export interface VisualEntity {
    transform: TransformComponent;
    view3d: View3DComponent;
}
/**
 * The CullSystem  (working with Cull) will hide and show
 * entities based on weather or not they are seen by the camera
 *
 * We automatically generate a bounding sphere for the geometry and then cache it.
 *
 * This can improve performance, but the calculation can be expensive so it won't be a magic bullet for
 * huge scenes!
 *
 * This is best used as a precision final layer of culling after some broadphase culling
 */
export declare class CullingSystem implements SystemInterface {
    static DEFAULT_NAME: string;
    readonly scene: Scene;
    cull(renderables: Entity3D[], camera: CameraEntity): Entity3D[];
}
//# sourceMappingURL=CullingSystem.d.ts.map