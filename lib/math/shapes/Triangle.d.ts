import type { Vector2 } from '../vector/Vector2';
import { Vector3 } from '../vector/Vector3';
import type { Plane } from './Plane';
export declare class Triangle {
    a: Vector3;
    b: Vector3;
    c: Vector3;
    constructor(a?: Vector3, b?: Vector3, c?: Vector3);
    static getNormal(a: Vector3, b: Vector3, c: Vector3, out: Vector3): Vector3;
    static getBarycoord(point: Vector3, a: Vector3, b: Vector3, c: Vector3, out: Vector3): Vector3;
    static containsPoint(point: Vector3, a: Vector3, b: Vector3, c: Vector3): boolean;
    static getUV(point: Vector3, p1: Vector3, p2: Vector3, p3: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, out: Vector2): Vector2;
    set(a: Vector3, b: Vector3, c: Vector3): this;
    clone(): Triangle;
    copy(triangle: Triangle): this;
    getArea(): number;
    getMidpoint(out: Vector3): Vector3;
    getNormal(out: Vector3): Vector3;
    getPlane(out: Plane): Plane;
    getBarycoord(point: Vector3, out: Vector3): Vector3;
    containsPoint(point: Vector3): boolean;
    getUV(point: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, out: Vector2): Vector2;
    closestPointToPoint(p: Vector3, out: Vector3): Vector3;
    equals(triangle: Triangle): boolean;
}
//# sourceMappingURL=Triangle.d.ts.map