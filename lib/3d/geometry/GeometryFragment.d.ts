import type { Box3, Sphere } from '../../math';
import type { Faces } from '../core';
import type { Geometry3D } from './Geometry3D';
export declare class GeometryFragment {
    id: number;
    boundingBox: Box3;
    boundingSphere: Sphere;
    start: number;
    size: number;
    faces: Faces[];
    groups: {
        start: number;
        count: number;
    }[];
    baseGeometry: Geometry3D;
    instanceCount: number;
    constructor(data: {
        id?: number;
        geometry: Geometry3D;
        start: number;
        size: number;
    });
    castToBaseGeometry(): Geometry3D;
}
//# sourceMappingURL=GeometryFragment.d.ts.map