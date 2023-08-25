import { UniformGroup } from 'pixi.js';
import type { Entity } from '../../../core/Entity';
import type { SystemInterface } from '../../../core/SystemInterface';
import type { Vector2 } from '../../../math';
import { Vector3 } from '../../../math';
import { CameraEntity } from '../../camera';
import type { Scene3D } from '../Scene3D';
import type { ViewSubSystemOptions } from '.';
interface CameraSystemOptions extends ViewSubSystemOptions {
    fullscreen?: boolean;
    camera?: CameraEntity;
    width?: number;
    height?: number;
}
/**
 * manages the camera uniforms and the current active camera.
 */
export declare class CameraSystem implements SystemInterface<CameraSystemOptions> {
    static DEFAULT_NAME: string;
    scene: Scene3D;
    cameraUniforms: UniformGroup;
    camera: CameraEntity;
    fullscreen: boolean;
    width: number;
    height: number;
    private readonly _view3dSystem;
    constructor(_entity: Entity, opts?: CameraSystemOptions);
    updateCamera(camera: CameraEntity): void;
    setCamera(camera: CameraEntity): void;
    map2dFrom3d(output: Vector2, input: Vector3): Vector2;
    resize(width: number, height: number): void;
}
export {};
//# sourceMappingURL=CameraSystem.d.ts.map