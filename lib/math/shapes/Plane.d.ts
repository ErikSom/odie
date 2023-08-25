import { Matrix3 } from '../matrix/Matrix3';
import type { Matrix4 } from '../matrix/Matrix4';
import { Vector3 } from '../vector/Vector3';
import type { Box3 } from './Box3';
import type { Line3 } from './Line3';
import type { Sphere } from './Sphere';
export declare class Plane {
    normal: Vector3;
    constant: number;
    constructor(normal?: Vector3, constant?: number);
    set(normal: Vector3, constant: number): this;
    setComponents(x: number, y: number, z: number, w: number): this;
    setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): this;
    setFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): this;
    clone(): Plane;
    copy(plane: Plane): this;
    normalize(): this;
    negate(): this;
    distanceToPoint(point: Vector3): number;
    distanceToSphere(sphere: Sphere): number;
    projectPoint(point: Vector3, out: Vector3): Vector3;
    intersectLine(line: Line3, out: Vector3): Vector3;
    intersectsLine(line: Line3): boolean;
    intersectsBox(box: Box3): boolean;
    intersectsSphere(sphere: Sphere): boolean;
    coplanarPoint(out: Vector3): Vector3;
    applyMatrix4(matrix: Matrix4, optionalNormalMatrix?: Matrix3): this;
    translate(offset: Vector3): this;
    equals(plane: Plane): boolean;
}
//# sourceMappingURL=Plane.d.ts.map