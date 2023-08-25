import { Geometry } from 'pixi.js';
import type { Box3, Sphere } from '../../math';
import type { Faces } from '../core';
export declare class Geometry3D extends Geometry {
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
    instanceCount: number;
    weights?: number[];
    castToBaseGeometry(): this;
}
//# sourceMappingURL=Geometry3D.d.ts.map