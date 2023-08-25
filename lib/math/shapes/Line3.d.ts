import type { Matrix4 } from '../matrix/Matrix4';
import { Vector3 } from '../vector/Vector3';
export declare class Line3 {
    start: Vector3;
    end: Vector3;
    constructor(start?: Vector3, end?: Vector3);
    set(start: Vector3, end: Vector3): this;
    clone(): Line3;
    copy(line: Line3): this;
    getCenter(out: Vector3): Vector3;
    delta(out: Vector3): Vector3;
    distanceSq(): number;
    distance(): number;
    at(t: number, out: Vector3): Vector3;
    closestPointToPointParameter(point: Vector3, clampToLine: boolean): number;
    closestPointToPoint(point: Vector3, clampToLine: boolean, out: Vector3): Vector3;
    applyMatrix4(matrix: Matrix4): this;
    equals(line: Line3): boolean;
}
//# sourceMappingURL=Line3.d.ts.map