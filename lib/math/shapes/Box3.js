// TODO remove these lint rules when new linter is in place
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { Vector3 } from '../vector/Vector3';
export class Box3 {
    constructor(min, max) {
        this.isBox3 = true;
        this.min = (min !== undefined) ? min : new Vector3(Infinity, Infinity, Infinity);
        this.max = (max !== undefined) ? max : new Vector3(-Infinity, -Infinity, -Infinity);
    }
    set(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    }
    setFromArray(array) {
        let minX = Number(Infinity);
        let minY = Number(Infinity);
        let minZ = Number(Infinity);
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;
        for (let i = 0, l = array.length; i < l; i += 3) {
            const x = array[i];
            const y = array[i + 1];
            const z = array[i + 2];
            if (x < minX)
                minX = x;
            if (y < minY)
                minY = y;
            if (z < minZ)
                minZ = z;
            if (x > maxX)
                maxX = x;
            if (y > maxY)
                maxY = y;
            if (z > maxZ)
                maxZ = z;
        }
        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);
        return this;
    }
    // TODO implement this for odie entities!
    // setFromBufferAttribute(attribute)
    // {
    //     let minX = Number(Infinity);
    //     let minY = Number(Infinity);
    //     let minZ = Number(Infinity);
    //     let maxX = -Infinity;
    //     let maxY = -Infinity;
    //     let maxZ = -Infinity;
    //     for (let i = 0, l = attribute.count; i < l; i++)
    //     {
    //         const x = attribute.getX(i);
    //         const y = attribute.getY(i);
    //         const z = attribute.getZ(i);
    //         if (x < minX) minX = x;
    //         if (y < minY) minY = y;
    //         if (z < minZ) minZ = z;
    //         if (x > maxX) maxX = x;
    //         if (y > maxY) maxY = y;
    //         if (z > maxZ) maxZ = z;
    //     }
    //     this.min.set(minX, minY, minZ);
    //     this.max.set(maxX, maxY, maxZ);
    //     return this;
    // }
    setFromPoints(points) {
        this.makeEmpty();
        for (let i = 0, il = points.length; i < il; i++) {
            this.expandByPoint(points[i]);
        }
        return this;
    }
    setFromCenterAndSize(center, size) {
        const halfSize = v1.copy(size).multiplyScalar(0.5);
        this.min.copy(center).sub(halfSize);
        this.max.copy(center).add(halfSize);
        return this;
    }
    // TODO implement this for odie entities!
    // setFromObject(object: {}): this
    // {
    //     console.warn('mat, write this code..');
    //     // this.makeEmpty();
    //     return this;
    //     // return this.expandByObject(object);
    // }
    clone() {
        return new Box3().copy(this);
    }
    copy(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);
        return this;
    }
    makeEmpty() {
        this.min.x = this.min.y = this.min.z = Number(Infinity);
        this.max.x = this.max.y = this.max.z = -Infinity;
        return this;
    }
    isEmpty() {
        // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    }
    getCenter(out) {
        return this.isEmpty() ? out.set(0, 0, 0) : out.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(out) {
        return this.isEmpty() ? out.set(0, 0, 0) : out.subVectors(this.max, this.min);
    }
    expandByPoint(point) {
        this.min.min(point);
        this.max.max(point);
        return this;
    }
    expandBySphere(sphere) {
        const { center, radius } = sphere;
        v1.x = center.x - radius;
        v1.y = center.y - radius;
        v1.z = center.z - radius;
        this.min.min(v1);
        v1.x = center.x + radius;
        v1.y = center.y + radius;
        v1.z = center.z + radius;
        this.max.max(v1);
        return this;
    }
    expandByVector(vector) {
        this.min.sub(vector);
        this.max.add(vector);
        return this;
    }
    expandByScalar(scalar) {
        this.min.addScalar(-scalar);
        this.max.addScalar(scalar);
        return this;
    }
    expandByObject() {
        // to fill in!
        return this;
    }
    containsPoint(point) {
        return !(point.x < this.min.x || point.x > this.max.x
            || point.y < this.min.y || point.y > this.max.y
            || point.z < this.min.z || point.z > this.max.z);
    }
    containsBox(box) {
        return this.min.x <= box.min.x && box.max.x <= this.max.x
            && this.min.y <= box.min.y && box.max.y <= this.max.y
            && this.min.z <= box.min.z && box.max.z <= this.max.z;
    }
    getParameter(point, out) {
        // This can potentially have a divide by zero if the box
        // has a size dimension of 0.
        return out.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y), (point.z - this.min.z) / (this.max.z - this.min.z));
    }
    intersectsBox(box) {
        // using 6 splitting planes to rule out intersections.
        return !(box.max.x < this.min.x || box.min.x > this.max.x
            || box.max.y < this.min.y || box.min.y > this.max.y
            || box.max.z < this.min.z || box.min.z > this.max.z);
    }
    intersectsSphere(sphere) {
        const closestPoint = new Vector3();
        // Find the point on the AABB closest to the sphere center.
        this.clampPoint(sphere.center, closestPoint);
        // If that point is inside the sphere, the AABB and sphere intersect.
        return closestPoint.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);
    }
    intersectsPlane(plane) {
        // We compute the minimum and maximum dot product values. If those values
        // are on the same side (back or front) of the plane, then there is no intersection.
        let min;
        let max;
        if (plane.normal.x > 0) {
            min = plane.normal.x * this.min.x;
            max = plane.normal.x * this.max.x;
        }
        else {
            min = plane.normal.x * this.max.x;
            max = plane.normal.x * this.min.x;
        }
        if (plane.normal.y > 0) {
            min += plane.normal.y * this.min.y;
            max += plane.normal.y * this.max.y;
        }
        else {
            min += plane.normal.y * this.max.y;
            max += plane.normal.y * this.min.y;
        }
        if (plane.normal.z > 0) {
            min += plane.normal.z * this.min.z;
            max += plane.normal.z * this.max.z;
        }
        else {
            min += plane.normal.z * this.max.z;
            max += plane.normal.z * this.min.z;
        }
        return (min <= -plane.constant && max >= -plane.constant);
    }
    // TODO implement this for odie
    // intersectsTriangle(): void
    // {
    // TODO fix up when we need it..
    // // triangle centered vertices
    // const v0 = new Vector3();
    // const v1 = new Vector3();
    // const v2 = new Vector3();
    // // triangle edge vectors
    // const f0 = new Vector3();
    // const f1 = new Vector3();
    // const f2 = new Vector3();
    // const testAxis = new Vector3();
    // const center = new Vector3();
    // const extents = new Vector3();
    // const triangleNormal = new Vector3();
    // function satForAxes(axes)
    // {
    //     let i; let
    //         j;
    //     for (i = 0, j = axes.length - 3; i <= j; i += 3)
    //     {
    //         testAxis.fromArray(axes, i);
    //         // project the aabb onto the seperating axis
    // eslint-disable-next-line max-len
    //         const r = extents.x * Math.abs(testAxis.x) + extents.y * Math.abs(testAxis.y) + extents.z * Math.abs(testAxis.z);
    //         // project all 3 vertices of the triangle onto the seperating axis
    //         const p0 = v0.dot(testAxis);
    //         const p1 = v1.dot(testAxis);
    //         const p2 = v2.dot(testAxis);
    //         // actual test, basically see if either of the most extreme of the triangle points intersects r
    //         if (Math.max(-Math.max(p0, p1, p2), Math.min(p0, p1, p2)) > r)
    //         {
    //             // points of the projected triangle are outside the projected half-length of the aabb
    //             // the axis is seperating and we can exit
    //             return false;
    //         }
    //     }
    //     return true;
    // }
    // return function intersectsTriangle(triangle)
    // {
    //     if (this.isEmpty())
    //     {
    //         return false;
    //     }
    //     // compute box center and extents
    //     this.getCenter(center);
    //     extents.subVectors(this.max, center);
    //     // translate triangle to aabb origin
    //     v0.subVectors(triangle.a, center);
    //     v1.subVectors(triangle.b, center);
    //     v2.subVectors(triangle.c, center);
    //     // compute edge vectors for triangle
    //     f0.subVectors(v1, v0);
    //     f1.subVectors(v2, v1);
    //     f2.subVectors(v0, v2);
    //     // test against axes that are given by cross product
    //     // combinations of the edges of the triangle and the edges of the aabb
    //     // make an axis testing of each of the 3 sides of the aabb against each of the 3
    //     // sides of the triangle = 9 axis of separation
    //     // axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
    //     let axes = [
    //         0, -f0.z, f0.y, 0, -f1.z, f1.y, 0, -f2.z, f2.y,
    //         f0.z, 0, -f0.x, f1.z, 0, -f1.x, f2.z, 0, -f2.x,
    //         -f0.y, f0.x, 0, -f1.y, f1.x, 0, -f2.y, f2.x, 0,
    //     ];
    //     if (!satForAxes(axes))
    //     {
    //         return false;
    //     }
    //     // test 3 face normals from the aabb
    //     axes = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    //     if (!satForAxes(axes))
    //     {
    //         return false;
    //     }
    //     // finally testing the face normal of the triangle
    //     // use already existing triangle edge vectors here
    //     triangleNormal.crossVectors(f0, f1);
    //     axes = [triangleNormal.x, triangleNormal.y, triangleNormal.z];
    //     return satForAxes(axes);
    // };
    // }
    clampPoint(point, out) {
        return out.copy(point).clamp(this.min, this.max);
    }
    distanceToPoint(point) {
        const clampedPoint = v1.copy(point).clamp(this.min, this.max);
        return clampedPoint.sub(point).length();
    }
    getBoundingSphere(out) {
        this.getCenter(out.center);
        out.radius = this.getSize(v1).length() * 0.5;
        return out;
    }
    intersect(box) {
        this.min.max(box.min);
        this.max.min(box.max);
        // ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf
        // values that will cause subsequence intersects to erroneously return valid values.
        if (this.isEmpty())
            this.makeEmpty();
        return this;
    }
    union(box) {
        this.min.min(box.min);
        this.max.max(box.max);
        return this;
    }
    applyMatrix4(matrix) {
        // transform of empty box is an empty box.
        if (this.isEmpty())
            return this;
        // NOTE: I am using a binary pattern to specify all 2^3 combinations below
        points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
        points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
        points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
        points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
        points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
        points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
        points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
        points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111
        this.setFromPoints(points);
        return this;
    }
    translate(offset) {
        this.min.add(offset);
        this.max.add(offset);
        return this;
    }
    equals(box) {
        return box.min.equals(this.min) && box.max.equals(this.max);
    }
}
const v1 = new Vector3();
const points = [
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
];
