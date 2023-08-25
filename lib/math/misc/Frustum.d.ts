import type { Matrix4 } from '../matrix/Matrix4';
import type { Box3 } from '../shapes/Box3';
import { Plane } from '../shapes/Plane';
import type { Sphere } from '../shapes/Sphere';
import { Vector3 } from '../vector/Vector3';
export declare class Frustum {
    private readonly _planes;
    constructor(p0?: Plane, p1?: Plane, p2?: Plane, p3?: Plane, p4?: Plane, p5?: Plane);
    set(p0: Plane, p1: Plane, p2: Plane, p3: Plane, p4: Plane, p5: Plane): this;
    clone(): Frustum;
    copy(frustum: Frustum): this;
    setFromMatrix(m: Matrix4): this;
    intersectsSphere(sphere: Sphere): boolean;
    intersectsBox(box: Box3): boolean;
    containsPoint(point: Vector3): boolean;
}
//# sourceMappingURL=Frustum.d.ts.map