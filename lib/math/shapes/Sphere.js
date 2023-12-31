import { Vector3 } from '../vector/Vector3';
import { Box3 } from './Box3';
export class Sphere {
    constructor(center, radius) {
        this.center = (center !== undefined) ? center : new Vector3();
        this.radius = (radius !== undefined) ? radius : 0;
    }
    set(center, radius) {
        this.center.copy(center);
        this.radius = radius;
        return this;
    }
    setFromPoints(points, optionalCenter) {
        const center = this.center;
        if (optionalCenter !== undefined) {
            center.copy(optionalCenter);
        }
        else {
            box.setFromPoints(points).getCenter(center);
        }
        let maxRadiusSq = 0;
        for (let i = 0, il = points.length; i < il; i++) {
            maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
        }
        this.radius = Math.sqrt(maxRadiusSq);
        return this;
    }
    clone() {
        return new Sphere().copy(this);
    }
    copy(sphere) {
        this.center.copy(sphere.center);
        this.radius = sphere.radius;
        return this;
    }
    empty() {
        return (this.radius <= 0);
    }
    containsPoint(point) {
        return (point.distanceToSquared(this.center) <= (this.radius * this.radius));
    }
    distanceToPoint(point) {
        return (point.distanceTo(this.center) - this.radius);
    }
    intersectsSphere(sphere) {
        const radiusSum = this.radius + sphere.radius;
        return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
    }
    intersectsBox(box) {
        return box.intersectsSphere(this);
    }
    intersectsPlane(plane) {
        return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
    }
    clampPoint(point, out) {
        const deltaLengthSq = this.center.distanceToSquared(point);
        out.copy(point);
        if (deltaLengthSq > (this.radius * this.radius)) {
            out.sub(this.center).normalize();
            out.multiplyScalar(this.radius).add(this.center);
        }
        return out;
    }
    getBoundingBox(out) {
        out.set(this.center, this.center);
        out.expandByScalar(this.radius);
        return out;
    }
    applyMatrix4(matrix) {
        this.center.applyMatrix4(matrix);
        this.radius = this.radius * matrix.getMaxScaleOnAxis();
        return this;
    }
    translate(offset) {
        this.center.add(offset);
        return this;
    }
    equals(sphere) {
        return sphere.center.equals(this.center) && (sphere.radius === this.radius);
    }
}
const box = new Box3();
