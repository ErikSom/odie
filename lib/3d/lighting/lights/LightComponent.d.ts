import type { ComponentInterface } from '../../../core/ComponentInterface';
import { Vector3 } from '../../../math/vector/Vector3';
import { Entity3D } from '../../core/Entity3D';
export declare enum LIGHT_TYPE {
    DIRECTIONAL = 0,
    POINT = 1,
    SPOTLIGHT = 2
}
export interface LightOptions {
    /** the distance the light can travel (used for point lights and spotlights) */
    distance?: number;
    /** set to true to have a debug sphere added to the scene.
     * Useful to see where you light actually is! */
    debug?: boolean | Entity3D;
    /** the hex color of the light. defaults to white! */
    color?: number;
    /** 0 the light type (0 = directional, 1 = point, 2 = spotlight) */
    type?: LIGHT_TYPE;
    /** the lights intensity 1 = max brightness, 0 no brightness (off!) */
    intensity?: number;
    /** The softness of the spotlight (0 = hard edged, 1 = soft edged) */
    softness?: number;
    /** the radius of the spotlight. Bigger will widen the cone! Measured in radians. */
    radius?: number;
}
/**
 *
 */
export declare class LightComponent implements ComponentInterface<LightOptions> {
    static DEFAULT_NAME: string;
    readonly type: LIGHT_TYPE;
    readonly lightId: string;
    dirty: boolean;
    output: Float32Array;
    distance: number;
    readonly entity: Entity3D;
    readonly limit: Float32Array;
    readonly position: Vector3;
    direction: Vector3;
    private _dirtyTransformId;
    private _radius;
    private _softness;
    private _intensity;
    private readonly _color;
    private _hexColor;
    private readonly _rotationMatrix;
    /**
     * @param entity - the entity to add the light component to
     * @param data - the light properties to set
     */
    constructor(entity: Entity3D, data: LightOptions);
    render(): void;
    extractData(): LightOptions;
    init(data: LightOptions): void;
    set radius(value: number);
    get radius(): number;
    set softness(value: number);
    get softness(): number;
    set color(value: number);
    get color(): number;
    set intensity(value: number);
    get intensity(): number;
}
//# sourceMappingURL=LightComponent.d.ts.map