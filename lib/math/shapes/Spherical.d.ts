import type { Vector3 } from '../vector/Vector3';
/**
 * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
 *
 * The polar angle (phi) is measured from the positive y-axis. The positive y-axis is up.
 * The azimuthal angle (theta) is measured from the positive z-axiz.
 */
export declare class Spherical {
    radius: number;
    phi: number;
    theta: number;
    constructor(radius?: number, phi?: number, theta?: number);
    set(radius: number, phi: number, theta: number): this;
    clone(): Spherical;
    copy(other: Spherical): this;
    makeSafe(): this;
    setFromVector3(v: Vector3): this;
    setFromCartesianCoords(x: number, y: number, z: number): this;
}
//# sourceMappingURL=Spherical.d.ts.map