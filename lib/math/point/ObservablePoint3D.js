/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents
 * the horizontal axis and y represents the vertical axis.
 * An observable point is a point that triggers a callback when the point's position is changed.
 *
 */
export class ObservablePoint3D {
    /**
     * @param cb - callback when changed
     * @param scope - owner of callback
     * @param x - position of the point on the x axis
     * @param y - position of the point on the y axis
     */
    constructor(cb, scope, x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._cb = cb;
        this._scope = scope;
    }
    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @param x - position of the point on the x axis
     * @param y - position of the point on the y axis
     */
    set(x, y, z) {
        const _x = x || 0;
        const _y = y || ((y !== 0) ? _x : 0);
        const _z = z || ((z !== 0) ? _x : 0);
        if (this._x !== _x || this._y !== _y || this._z !== _z) {
            this._x = _x;
            this._y = _y;
            this._z = _z;
            this._cb.call(this._scope);
        }
        return this;
    }
    /**
     * Copies x and y from the given point
     *
     * @param p - The point to copy from.
     * @returns Returns itself.
     */
    copyFrom(p) {
        if (this._x !== p.x || this._y !== p.y || this._z !== p.z) {
            this._x = p.x;
            this._y = p.y;
            this._z = p.z;
            this._cb.call(this._scope);
        }
        return this;
    }
    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     */
    get x() {
        return this._x;
    }
    set x(value) {
        if (this._x !== value) {
            this._x = value;
            this._cb.call(this._scope);
        }
    }
    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     */
    get y() {
        return this._y;
    }
    set y(value) {
        if (this._y !== value) {
            this._y = value;
            this._cb.call(this._scope);
        }
    }
    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     */
    get z() {
        return this._z;
    }
    set z(value) {
        if (this._z !== value) {
            this._z = value;
            this._cb.call(this._scope);
        }
    }
}
