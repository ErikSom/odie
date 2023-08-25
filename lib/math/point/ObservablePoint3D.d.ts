import type { XYZ } from '../../utils';
/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents
 * the horizontal axis and y represents the vertical axis.
 * An observable point is a point that triggers a callback when the point's position is changed.
 *
 */
export declare class ObservablePoint3D {
    private _x;
    private _y;
    private _z;
    private readonly _cb;
    private readonly _scope;
    /**
     * @param cb - callback when changed
     * @param scope - owner of callback
     * @param x - position of the point on the x axis
     * @param y - position of the point on the y axis
     */
    constructor(cb: () => void, scope: unknown, x?: number, y?: number, z?: number);
    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @param x - position of the point on the x axis
     * @param y - position of the point on the y axis
     */
    set(x: number, y?: number, z?: number): this;
    /**
     * Copies x and y from the given point
     *
     * @param p - The point to copy from.
     * @returns Returns itself.
     */
    copyFrom(p: XYZ): this;
    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     */
    get x(): number;
    set x(value: number);
    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     */
    get y(): number;
    set y(value: number);
    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     */
    get z(): number;
    set z(value: number);
}
//# sourceMappingURL=ObservablePoint3D.d.ts.map