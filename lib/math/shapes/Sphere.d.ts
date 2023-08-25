import type { Matrix4 } from '../matrix/Matrix4';
import { Vector3 } from '../vector/Vector3';
import { Box3 } from './Box3';
import type { Plane } from './Plane';
export declare class Sphere {
    center: Vector3;
    radius: number;
    constructor(center?: Vector3, radius?: number);
    set(center: Vector3, radius: number): this;
    setFromPoints(points: Vector3[], optionalCenter?: Vector3): this;
    clone(): Sphere;
    copy(sphere: Sphere): this;
    empty(): boolean;
    containsPoint(point: Vector3): boolean;
    distanceToPoint(point: Vector3): number;
    intersectsSphere(sphere: Sphere): boolean;
    intersectsBox(box: Box3): boolean;
    intersectsPlane(plane: Plane): boolean;
    clampPoint(point: Vector3, out: Vector3): Vector3;
    getBoundingBox(out: Box3): Box3;
    applyMatrix4(matrix: Matrix4): this;
    translate(offset: Vector3): this;
    equals(sphere: Sphere): boolean;
}
//# sourceMappingURL=Sphere.d.ts.map