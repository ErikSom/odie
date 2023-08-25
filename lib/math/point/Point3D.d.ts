import type { IPointData } from 'pixi.js';
export interface IPointData3D extends IPointData {
    /**
     * Z coord
     */
    z: number;
}
export interface IPoint3D extends IPointData3D {
    /**
     * Sets the point to a new x and y position.
     * If y/z is omitted, both x, y, z will be set to x.
     * @param x - position of the point on the x axis
     * @param y - position of the point on the y axis
     * @param z - position of the point on the z axis
     */
    set: (x?: number, y?: number, z?: number) => void;
    /**
     * Copies x, y, z from the given point
     * @param p - The point to copy from
     * @returns Returns itself.
     */
    copyFrom: (p: IPointData3D) => this;
    /**
     * Copies x, y, z into the given point
     * @param p - The point to copy.
     * @returns Given point with values updated
     */
    copyTo: (p: IPoint3D) => IPoint3D;
    /**
     * Returns true if the given point is equal to this point
     * @param p - The point to check
     * @returns - Whether the given point equal to this point
     */
    equals: (p: IPointData3D) => boolean;
    /**
     * X coord
     */
    x: number;
    /**
     * Y coord
     */
    y: number;
    /**
     * Z coord
     */
    z: number;
}
export declare class Point3D implements IPoint3D {
    z: number;
    x: number;
    y: number;
    constructor(x?: number, y?: number, z?: number);
    /**
     * Creates a clone of this point
     * @returns - a copy of the point
     */
    clone(): Point3D;
    /**
     * Copies x and y from the given point
     *
     * @param p - The point to copy from
     * @returns Returns itself.
     */
    copyFrom(p: IPointData3D): this;
    /**
     * Copies x and y into the given point
     *
     * @param p - The point to copy.
     * @returns Given point with values updated
     */
    copyTo<T extends IPoint3D>(p: T): T;
    /**
     * Returns true if the given point is equal to this point
     *
     * @param p - The point to check
     * @returns Whether the given point equal to this point
     */
    equals(p: IPointData3D): boolean;
    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @param x - position of the point on the x axis
     * @param y - position of the point on the y axis
     * @param z - position of the point on the z axis
     * @returns Returns itself.
     */
    set(x?: number, y?: number, z?: number): this;
}
//# sourceMappingURL=Point3D.d.ts.map