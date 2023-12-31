export class Point3D {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * Creates a clone of this point
     * @returns - a copy of the point
     */
    clone() {
        return new Point3D(this.x, this.y, this.z);
    }
    /**
     * Copies x and y from the given point
     *
     * @param p - The point to copy from
     * @returns Returns itself.
     */
    copyFrom(p) {
        this.set(p.x, p.y, p.z);
        return this;
    }
    /**
     * Copies x and y into the given point
     *
     * @param p - The point to copy.
     * @returns Given point with values updated
     */
    copyTo(p) {
        p.set(this.x, this.y, this.z);
        return p;
    }
    /**
     * Returns true if the given point is equal to this point
     *
     * @param p - The point to check
     * @returns Whether the given point equal to this point
     */
    equals(p) {
        return (p.x === this.x) && (p.y === this.y) && (p.z === this.z);
    }
    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @param x - position of the point on the x axis
     * @param y - position of the point on the y axis
     * @param z - position of the point on the z axis
     * @returns Returns itself.
     */
    set(x = 0, y = x, z = x) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
}
