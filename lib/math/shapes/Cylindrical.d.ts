import type { Vector3 } from '../vector/Vector3';
/**
 * Ref: https://en.wikipedia.org/wiki/Cylindrical_coordinate_system
 */
export declare class Cylindrical {
    radius: number;
    theta: number;
    y: number;
    constructor(radius?: number, theta?: number, y?: number);
    set(radius: number, theta: number, y: number): this;
    clone(): Cylindrical;
    copy(other: Cylindrical): this;
    setFromVector3(v: Vector3): Cylindrical;
    setFromCartesianCoords(x: number, y: number, z: number): this;
}
//# sourceMappingURL=Cylindrical.d.ts.map