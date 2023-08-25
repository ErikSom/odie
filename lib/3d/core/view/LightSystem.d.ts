import { UniformGroup } from 'pixi.js';
import type { LightEntity } from '../..';
import { AmbientLight } from '../..';
import type { Entity } from '../../../core';
import type { SystemInterface } from '../../../core/SystemInterface';
import type { Scene3D } from '../Scene3D';
import type { ViewSubSystemOptions } from '.';
export interface LightData {
    lights: LightEntity[];
    sig: string;
}
/**
 * light system is responsible for building taking all the lights in the world.
 * As lights are added, it will manage them and automatically update the uniforms required to run them
 *
 * PRO Tip - its best to set your lights once and then not change how many there are in the scene.
 * changing the number of lights / type of lights on the fly invalidates the shaders and could cause a jank moments
 * due to new shaders needing to be recompiled.
 *
 * This really would only become a problem if we needed to make a large open world! For now, its best to add the maximum number of lights to the scene
 * at start up and disable / enable them as required.
 */
export declare class LightSystem implements SystemInterface {
    static DEFAULT_NAME: string;
    /**
     * A single ambient light. Always present in the scene.
     */
    ambientLight: AmbientLight;
    /**
     * increments if the lights have changed within the scene (for example one was added / removed)
     */
    lightsDirtyTick: number;
    /**
     * a uniform object that has all the light uniforms. This is attached to the materials uniforms
     * at render time.
     */
    lightUniforms: UniformGroup;
    /**
     * all the current light entities within the scene
     */
    lightEntities: LightEntity[];
    /**
     * if this is true, shaders will not be recalculated after the first time.
     * this means any new lights added / removed from the scene will be ignored.
     */
    freezeLights: boolean;
    /**
     * a unique signature to the current light setup. Can be used to quickly compare if the lights have changed
     */
    lightSig: string;
    scene: Scene3D;
    private readonly _uid;
    private _lightsDirtyTick;
    constructor(_entity: Entity, options: ViewSubSystemOptions);
    renderBegin(): void;
    start(): void;
    entityAddedToScene(entity: Entity): void;
    entityRemovedFromScene(entity: Entity): void;
    empty(): void;
}
//# sourceMappingURL=LightSystem.d.ts.map