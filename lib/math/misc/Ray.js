/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { View3DComponent } from '../../3d/core/view/View3DComponent';
import { Matrix4 } from '../matrix/Matrix4';
import { Vector3 } from '../vector/Vector3';
export class Ray {
    constructor(origin, direction) {
        this.origin = origin !== null && origin !== void 0 ? origin : new Vector3();
        this.direction = direction !== null && direction !== void 0 ? direction : new Vector3();
        this._facesHit = [];
    }
    /**
     * Checks if ray intersects triangles
     * @param ray - the ray being used to test with
     * @param a - first point of the triangle in 3d space
     * @param b - second point of the triangle in 3d space
     * @param c - third point of the triangle in 3d space
     * @param backfaceCulling - ignore check if ray origin point is behind face
     * @param out - the intersection point being returned
     * @returns the intersection point
     */
    static intersectTriangle(ray, a, b, c, backfaceCulling, out) {
        edge1.subVectors(b, a);
        edge2.subVectors(c, a);
        normal.crossVectors(edge1, edge2);
        let DdN = ray.direction.dot(normal);
        let sign;
        if (DdN > 0) {
            if (backfaceCulling)
                return null;
            sign = 1;
        }
        else if (DdN < 0) {
            sign = -1;
            DdN = -DdN;
        }
        else {
            return null;
        }
        diff.subVectors(ray.origin, a);
        const DdQxE2 = sign * ray.direction.dot(edge2.crossVectors(diff, edge2));
        // b1 < 0, no intersection
        if (DdQxE2 < 0) {
            return null;
        }
        const DdE1xQ = sign * ray.direction.dot(edge1.cross(diff));
        // b2 < 0, no intersection
        if (DdE1xQ < 0) {
            return null;
        }
        // b1+b2 > 1, no intersection
        if (DdQxE2 + DdE1xQ > DdN) {
            return null;
        }
        // Line intersects triangle, check if ray does.
        const QdN = -sign * diff.dot(normal);
        // t < 0, no intersection
        if (QdN < 0) {
            return null;
        }
        // Ray intersects triangle.
        return ray.at(QdN / DdN, out);
    }
    set(origin, direction) {
        this.origin.copy(origin);
        this.direction.copy(direction);
        return this;
    }
    clone() {
        return new Ray().copy(this);
    }
    copy(ray) {
        this.origin.copy(ray.origin);
        this.direction.copy(ray.direction);
        return this;
    }
    at(t, out) {
        return out.copy(this.direction).multiplyScalar(t).add(this.origin);
    }
    lookAt(v) {
        this.direction.copy(v).sub(this.origin).normalize();
        return this;
    }
    recast(t) {
        this.origin.copy(this.at(t, v1));
        return this;
    }
    closestPointToPoint(point, out) {
        out.subVectors(point, this.origin);
        const directionDistance = out.dot(this.direction);
        if (directionDistance < 0) {
            return out.copy(this.origin);
        }
        return out.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
    }
    distanceToPoint(point) {
        return Math.sqrt(this.distanceSqToPoint(point));
    }
    distanceSqToPoint(point) {
        const directionDistance = v1.subVectors(point, this.origin).dot(this.direction);
        // point behind the ray
        if (directionDistance < 0) {
            return this.origin.distanceToSquared(point);
        }
        v1.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
        return v1.distanceToSquared(point);
    }
    distanceSqToSegment(v0, v1, optionalPointOnRay, optionalPointOnSegment) {
        // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h
        // It returns the min distance between the ray and the segment
        // defined by v0 and v1
        // It can also set two optional targets :
        // - The closest point on the ray
        // - The closest point on the segment
        segCenter.copy(v0).add(v1).multiplyScalar(0.5);
        segDir.copy(v1).sub(v0).normalize();
        diff.copy(this.origin).sub(segCenter);
        const segExtent = v0.distanceTo(v1) * 0.5;
        const a01 = -this.direction.dot(segDir);
        const b0 = diff.dot(this.direction);
        const b1 = -diff.dot(segDir);
        const c = diff.lengthSq();
        const det = Math.abs(1 - (a01 * a01));
        let s0;
        let s1;
        let sqrDist;
        let extDet;
        if (det > 0) {
            // The ray and segment are not parallel.
            s0 = (a01 * b1) - b0;
            s1 = (a01 * b0) - b1;
            extDet = segExtent * det;
            if (s0 >= 0) {
                if (s1 >= -extDet) {
                    if (s1 <= extDet) {
                        // region 0
                        // Minimum at interior points of ray and segment.
                        const invDet = 1 / det;
                        s0 *= invDet;
                        s1 *= invDet;
                        sqrDist = (s0 * (s0 + (a01 * s1) + (2 * b0))) + (s1 * ((a01 * s0) + s1 + (2 * b1))) + c;
                    }
                    else {
                        // region 1
                        s1 = segExtent;
                        s0 = Math.max(0, -((a01 * s1) + b0));
                        sqrDist = (-s0 * s0) + (s1 * (s1 + (2 * b1))) + c;
                    }
                }
                else {
                    // region 5
                    s1 = -segExtent;
                    s0 = Math.max(0, -((a01 * s1) + b0));
                    sqrDist = (-s0 * s0) + (s1 * (s1 + (2 * b1))) + c;
                }
            }
            else if (s1 <= -extDet) {
                // region 4
                s0 = Math.max(0, -((-a01 * segExtent) + b0));
                s1 = (s0 > 0) ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
                sqrDist = (-s0 * s0) + (s1 * (s1 + (2 * b1))) + c;
            }
            else if (s1 <= extDet) {
                // region 3
                s0 = 0;
                s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
                sqrDist = (s1 * (s1 + (2 * b1))) + c;
            }
            else {
                // region 2
                s0 = Math.max(0, -((a01 * segExtent) + b0));
                s1 = (s0 > 0) ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
                sqrDist = (-s0 * s0) + (s1 * (s1 + (2 * b1))) + c;
            }
        }
        else {
            // Ray and segment are parallel.
            s1 = (a01 > 0) ? -segExtent : segExtent;
            s0 = Math.max(0, -((a01 * s1) + b0));
            sqrDist = (-s0 * s0) + (s1 * (s1 + (2 * b1))) + c;
        }
        if (optionalPointOnRay) {
            optionalPointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);
        }
        if (optionalPointOnSegment) {
            optionalPointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter);
        }
        return sqrDist;
    }
    intersectSphere(sphere, out) {
        v1.subVectors(sphere.center, this.origin);
        const tca = v1.dot(this.direction);
        const d2 = v1.dot(v1) - (tca * tca);
        const radius2 = sphere.radius * sphere.radius;
        if (d2 > radius2)
            return null;
        const thc = Math.sqrt(radius2 - d2);
        // t0 = first intersect point - entrance on front of sphere
        const t0 = tca - thc;
        // t1 = second intersect point - exit point on back of sphere
        const t1 = tca + thc;
        // test to see if both t0 and t1 are behind the ray - if so, return null
        if (t0 < 0 && t1 < 0)
            return null;
        // test to see if t0 is behind the ray:
        // if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
        // in order to always return an intersect point that is in front of the ray.
        if (t0 < 0)
            return this.at(t1, out);
        // else t0 is in front of the ray, so return the first collision point scaled by t0
        return this.at(t0, out);
    }
    intersectsSphere(sphere) {
        return this.distanceSqToPoint(sphere.center) <= (sphere.radius * sphere.radius);
    }
    distanceToPlane(plane) {
        const denominator = plane.normal.dot(this.direction);
        if (denominator === 0) {
            // line is coplanar, return origin
            if (plane.distanceToPoint(this.origin) === 0) {
                return 0;
            }
            // Null is preferable to undefined since undefined means.... it is undefined
            return null;
        }
        const t = -(this.origin.dot(plane.normal) + plane.constant) / denominator;
        // Return if the ray never intersects the plane
        return t >= 0 ? t : null;
    }
    intersectPlane(plane, out) {
        const t = this.distanceToPlane(plane);
        if (t === null) {
            return null;
        }
        return this.at(t, out);
    }
    intersectsPlane(plane) {
        // check if the ray lies on the plane first
        const distToPoint = plane.distanceToPoint(this.origin);
        if (distToPoint === 0) {
            return true;
        }
        const denominator = plane.normal.dot(this.direction);
        if (denominator * distToPoint < 0) {
            return true;
        }
        // ray origin is behind the plane (and is pointing behind it)
        return false;
    }
    intersectBox(box, out) {
        let tmin;
        let tmax;
        let tymin;
        let tymax;
        let tzmin;
        let tzmax;
        const invdirx = 1 / this.direction.x;
        const invdiry = 1 / this.direction.y;
        const invdirz = 1 / this.direction.z;
        const origin = this.origin;
        if (invdirx >= 0) {
            tmin = (box.min.x - origin.x) * invdirx;
            tmax = (box.max.x - origin.x) * invdirx;
        }
        else {
            tmin = (box.max.x - origin.x) * invdirx;
            tmax = (box.min.x - origin.x) * invdirx;
        }
        if (invdiry >= 0) {
            tymin = (box.min.y - origin.y) * invdiry;
            tymax = (box.max.y - origin.y) * invdiry;
        }
        else {
            tymin = (box.max.y - origin.y) * invdiry;
            tymax = (box.min.y - origin.y) * invdiry;
        }
        if ((tmin > tymax) || (tymin > tmax))
            return null;
        // These lines also handle the case where tmin or tmax is NaN
        // (result of 0 * Infinity). x !== x returns true if x is NaN
        if (tymin > tmin)
            tmin = tymin;
        if (tymax < tmax)
            tmax = tymax;
        if (invdirz >= 0) {
            tzmin = (box.min.z - origin.z) * invdirz;
            tzmax = (box.max.z - origin.z) * invdirz;
        }
        else {
            tzmin = (box.max.z - origin.z) * invdirz;
            tzmax = (box.min.z - origin.z) * invdirz;
        }
        if ((tmin > tzmax) || (tzmin > tmax))
            return null;
        if (tzmin > tmin)
            tmin = tzmin;
        if (tzmax < tmax)
            tmax = tzmax;
        // return point closest to the ray (positive side)
        if (tmax < 0)
            return null;
        return this.at(tmin >= 0 ? tmin : tmax, out);
    }
    intersectsBox(box) {
        return this.intersectBox(box, v1) !== null;
    }
    /**
     * Checks if the casted ray intersects with any of the faces of an entity
     * @param entity - the entity to test against
     * @returns the vector position of the closest intersection
     */
    intersectsEntity(entity) {
        var _a;
        return (_a = this._intersectsEntity(entity)) === null || _a === void 0 ? void 0 : _a.hit;
    }
    /**
     * Checks if the casted ray intersects with any of the faces of multiple entities
     * @param entities - the entities to test against
     * @param out - an array to return the results
     * @returns an array of objects containing interaction points and the objects they interact with
     */
    intersectsEntities(entities, out = []) {
        out.length = 0;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            let information = this._intersectsEntity(entity);
            information = information !== null && information !== void 0 ? information : { entity: entities[i], hit: null };
            out.push(information);
        }
        return out;
    }
    /**
     * Checks all hits against a ray cast to retrieve the closest one
     * @returns an object containing the closest entity to be hit with the ray as well as the hit position
     */
    getClosestFace() {
        let distance = Infinity;
        let closest = null;
        for (let i = 0; i < this._facesHit.length; i++) {
            const element = this._facesHit[i];
            const object = element.hit;
            const source = this.origin;
            const diffX = Math.pow((object.x - source.x), 2);
            const diffY = Math.pow((object.y - source.y), 2);
            const diffZ = Math.pow((object.z - source.z), 2);
            const tempDist = Math.sqrt(diffX + diffY + diffZ);
            if (tempDist < distance) {
                distance = tempDist;
                closest = element;
            }
        }
        return closest;
    }
    applyMatrix4(matrix4) {
        this.origin.applyMatrix4(matrix4);
        this.direction.transformDirection(matrix4);
        return this;
    }
    equals(ray) {
        return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
    }
    /**
     * Checks if the casted ray intersects with any of the faces of an entity
     * @param entity - the entity to test against
     * @returns an array of objects containing interaction points and the objects they interact with
     */
    _intersectsEntity(entity) {
        const view3d = entity.getComponent(View3DComponent);
        if (!view3d)
            return null;
        let hit;
        // TODO pool? but people may capture this result..
        let tempVec = new Vector3();
        const faces = view3d.getFaces();
        this._facesHit.length = 0;
        const transformedRay = tempRay.copy(this);
        const invertedMatrix = tempMatrix.getInverse(entity.transform.worldTransform);
        transformedRay.applyMatrix4(invertedMatrix);
        for (let j = 0; j < faces.length; j++) {
            const vertices = faces[j].vertices;
            hit = Ray.intersectTriangle(transformedRay, vertices[0], vertices[1], vertices[2], false, tempVec);
            if (hit) {
                hit.applyMatrix4(entity.transform.worldTransform);
                const hitData = { entity, hit };
                this._facesHit.push(hitData);
                tempVec = new Vector3();
            }
        }
        return this.getClosestFace();
    }
}
const v1 = new Vector3();
const segCenter = new Vector3();
const segDir = new Vector3();
const diff = new Vector3();
const edge1 = new Vector3();
const edge2 = new Vector3();
const normal = new Vector3();
const tempMatrix = new Matrix4();
const tempRay = new Ray();
