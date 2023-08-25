import type { Shader } from 'pixi.js';
import { DRAW_MODES, State } from 'pixi.js';
import type { ComponentInterface } from '../../../core/ComponentInterface';
import { Matrix3 } from '../../../math/matrix/Matrix3';
import { Box3 } from '../../../math/shapes/Box3';
import { Sphere } from '../../../math/shapes/Sphere';
import type { Vector3 } from '../../../math/vector/Vector3';
import type { Geometry3D } from '../../geometry/Geometry3D';
import type { GeometryFragment } from '../../geometry/GeometryFragment';
import type { Entity3D } from '../Entity3D';
import type { RenderParameters } from '.';
import type { Layer } from './Layer';
export interface View3DComponentOptions {
    draw?: DRAW_MODES;
    geometry: Geometry3D | GeometryFragment;
    material: Shader;
    state?: State;
    renderCustom?: (renderParameters: RenderParameters) => void;
    orderBias?: number;
    frustumCull?: boolean;
    layerId?: string;
    /**
     * add a custom shadow material if you want to do something special when casting a shadow!
     */
    shadowMaterial?: Shader;
}
export interface Faces {
    indices: number[];
    vertices: Vector3[];
}
export declare class View3DComponent implements ComponentInterface<View3DComponentOptions, Entity3D> {
    static DEFAULT_NAME: string;
    readonly entity: Entity3D;
    data: View3DComponentOptions;
    zdist: number;
    draw: DRAW_MODES;
    renderable: boolean;
    renderCustom: (renderParameters: RenderParameters) => void;
    orderBias: number;
    group: Entity3D[];
    instanced: boolean;
    id: string;
    onChange: () => void;
    tick: number;
    boundingSphere: Sphere;
    boundingBox: Box3;
    frustumCull: boolean;
    layerId: string;
    shadowMaterial: Shader;
    readonly _cachedNormal: Matrix3;
    transformDirty: number;
    private _geometry;
    private _material;
    private _layer;
    private _state;
    private _dirtyBoundsId;
    constructor(entity: Entity3D, data: View3DComponentOptions);
    getBoundingSphere(): Sphere;
    /** Creates an array of faces based on the entitiy's geometry
     * @returns an array of indices and vertices */
    getFaces(): Faces[];
    protected onBlendChange(): void;
    private _addGeometryBounds;
    private _generateBounds;
    set state(value: State);
    get state(): State;
    set material(value: Shader);
    get material(): Shader;
    set geometry(value: Geometry3D | GeometryFragment);
    get geometry(): Geometry3D | GeometryFragment;
    set layer(value: Layer);
    get layer(): Layer;
}
//# sourceMappingURL=View3DComponent.d.ts.map