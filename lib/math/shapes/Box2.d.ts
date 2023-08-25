import { Vector2 } from '../vector/Vector2';
export declare class Box2 {
    min: Vector2;
    max: Vector2;
    constructor(min: Vector2, max: Vector2);
    set(min: Vector2, max: Vector2): this;
    setFromPoints(points: Vector2[]): this;
    setFromCenterAndSize(center: Vector2, size: Vector2): this;
    clone(): Box2;
    copy(box: Box2): this;
    makeEmpty(): this;
    isEmpty(): boolean;
    getCenter(out: Vector2): Vector2;
    getSize(out: Vector2): Vector2;
    expandByPoint(point: Vector2): this;
    expandByVector(vector: Vector2): this;
    expandByScalar(scalar: number): this;
    containsPoint(point: Vector2): boolean;
    containsBox(box: Box2): boolean;
    getParameter(point: Vector2, out: Vector2): Vector2;
    intersectsBox(box: Box2): boolean;
    clampPoint(point: Vector2, out: Vector2): Vector2;
    distanceToPoint(point: Vector2): number;
    intersect(box: Box2): this;
    union(box: Box2): this;
    translate(offset: Vector2): this;
    equals(box: Box2): boolean;
}
//# sourceMappingURL=Box2.d.ts.map