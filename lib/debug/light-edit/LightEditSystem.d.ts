import type { LightEntity, Scene3D } from '../../3d';
import type { Entity, SystemInterface } from '../../core';
/**
 * a light editing system build to complement the LightSystem interface
 * this will generate a json lights file that can then be used with the LightSystem
 * add this to you scene and then a dat gui will appear for each light you add to the scene.
 *
 * play around with the settings, then hit copy.
 * A json will be copied to the clipboard
 *
 */
export declare class LightEditSystem implements SystemInterface<{}, LightEntity> {
    scene: Scene3D;
    private readonly _activeLights;
    private _ambientLight;
    private readonly _gui;
    constructor();
    start(): void;
    entityAddedToScene(entity: Entity): void;
    /**
     * internal function to allow as to use gui color picker
     */
    set ambientLightColor(value: number | string);
    /**
     * internal function to allow as to use gui color picker
     */
    get ambientLightColor(): number | string;
}
//# sourceMappingURL=LightEditSystem.d.ts.map