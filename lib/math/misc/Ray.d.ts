import type { Entity3D } from '../../3d/core/Entity3D';
import { Matrix4 } from '../matrix/Matrix4';
import type { Box3 } from '../shapes/Box3';
import type { Plane } from '../shapes/Plane';
import type { Sphere } from '../shapes/Sphere';
import { Vector3 } from '../vector/Vector3';
/** An object containing an entity hit with the ray as well as the hit position */
export interface IntersectionInformation {
    /** The entity hit */
    entity: Entity3D;
    /** The vector position of the intersect position between one of the entity's faces and the ray */
    hit?: Vector3;
}
export declare class Ray {
    origin: Vector3;
    direction: Vector3;
    /** An array containing all the entities intersected and their intersection points */
    private _facesHit;
    constructor(origin?: Vector3, direction?: Vector3);
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
    static intersectTriangle(ray: Ray, a: Vector3, b: Vector3, c: Vector3, backfaceCulling: boolean, out: Vector3): Vector3;
    set(origin: Vector3, direction: Vector3): this;
    clone(): Ray;
    copy(ray: Ray): this;
    at(t: number, out: Vector3): Vector3;
    lookAt(v: Vector3): this;
    recast(t: number): this;
    closestPointToPoint(point: Vector3, out: Vector3): Vector3;
    distanceToPoint(point: Vector3): number;
    distanceSqToPoint(point: Vector3): number;
    distanceSqToSegment(v0: Vector3, v1: Vector3, optionalPointOnRay?: Vector3, optionalPointOnSegment?: Vector3): number;
    intersectSphere(sphere: Sphere, out: Vector3): Vector3;
    intersectsSphere(sphere: Sphere): boolean;
    distanceToPlane(plane: Plane): number;
    intersectPlane(plane: Plane, out: Vector3): Vector3;
    intersectsPlane(plane: Plane): boolean;
    intersectBox(box: Box3, out: Vector3): Vector3;
    intersectsBox(box: Box3): boolean;
    /**
     * Checks if the casted ray intersects with any of the faces of an entity
     * @param entity - the entity to test against
     * @returns the vector position of the closest intersection
     */
    intersectsEntity(entity: Entity3D): Vector3;
    /**
     * Checks if the casted ray intersects with any of the faces of multiple entities
     * @param entities - the entities to test against
     * @param out - an array to return the results
     * @returns an array of objects containing interaction points and the objects they interact with
     */
    intersectsEntities(entities: Entity3D[], out?: IntersectionInformation[]): IntersectionInformation[];
    /**
     * Checks all hits against a ray cast to retrieve the closest one
     * @returns an object containing the closest entity to be hit with the ray as well as the hit position
     */
    getClosestFace(): IntersectionInformation;
    applyMatrix4(matrix4: Matrix4): this;
    equals(ray: Ray): boolean;
    /**
     * Checks if the casted ray intersects with any of the faces of an entity
     * @param entity - the entity to test against
     * @returns an array of objects containing interaction points and the objects they interact with
     */
    private _intersectsEntity;
}
//# sourceMappingURL=Ray.d.ts.map