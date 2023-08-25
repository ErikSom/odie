import type { Entity, SystemInterface } from '../../core';
import type { Scene3D } from '../core';
import { LightEntity } from './lights';
export interface LightSystemData {
    transform: {
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        position: {
            x: number;
            y: number;
            z: number;
        };
    };
    light: {
        color: number;
        type: 0 | 1 | 2;
        intensity: number;
        softness: number;
        radius: number;
    };
}
export interface AmbientLightData {
    color: number;
    intensity: number;
}
export interface LightSystemOptions {
    totalLights?: number;
    data?: {
        [key: string]: LightSystemData | AmbientLightData;
    };
}
/**
 * light system is a super simple way to manage lights. it accepts a LightData
 * object that let us build out lights for the scene.
 *
 * This LightData object can be generated using the LightEditSystem
 */
export declare class LightSetupSystem implements SystemInterface<LightSystemOptions> {
    readonly lights: LightEntity[];
    readonly scene: Scene3D;
    private readonly _data;
    constructor(_entity: Entity, data?: LightSystemOptions);
    start(): void;
}
//# sourceMappingURL=LightSetupSystem.d.ts.map