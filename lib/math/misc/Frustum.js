/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { Plane } from '../shapes/Plane';
import { Vector3 } from '../vector/Vector3';
export class Frustum {
    constructor(p0, p1, p2, p3, p4, p5) {
        this._planes = [
            (p0 !== undefined) ? p0 : new Plane(),
            (p1 !== undefined) ? p1 : new Plane(),
            (p2 !== undefined) ? p2 : new Plane(),
            (p3 !== undefined) ? p3 : new Plane(),
            (p4 !== undefined) ? p4 : new Plane(),
            (p5 !== undefined) ? p5 : new Plane(),
        ];
    }
    set(p0, p1, p2, p3, p4, p5) {
        const planes = this._planes;
        planes[0].copy(p0);
        planes[1].copy(p1);
        planes[2].copy(p2);
        planes[3].copy(p3);
        planes[4].copy(p4);
        planes[5].copy(p5);
        return this;
    }
    clone() {
        return new Frustum().copy(this);
    }
    copy(frustum) {
        const planes = this._planes;
        for (let i = 0; i < 6; i++) {
            planes[i].copy(frustum._planes[i]);
        }
        return this;
    }
    setFromMatrix(m) {
        const planes = this._planes;
        const me = m.elements;
        const me0 = me[0];
        const me1 = me[1];
        const me2 = me[2];
        const me3 = me[3];
        const me4 = me[4];
        const me5 = me[5];
        const me6 = me[6];
        const me7 = me[7];
        const me8 = me[8];
        const me9 = me[9];
        const me10 = me[10];
        const me11 = me[11];
        const me12 = me[12];
        const me13 = me[13];
        const me14 = me[14];
        const me15 = me[15];
        planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize();
        planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize();
        planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize();
        planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize();
        planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalize();
        planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalize();
        return this;
    }
    // TODO this needs to be tweaked with odie..
    // intersectsObject(object:Entiy): boolean
    // {
    //     const geometry = object.geometry;
    //     if (geometry.boundingSphere === null)
    //     { geometry.computeBoundingSphere(); }
    //     sphere.copy(geometry.boundingSphere)
    //         .applyMatrix4(object.matrixWorld);
    //     return this.intersectsSphere(sphere);
    // }
    // TODO this needs to be tweaked with odie..
    // intersectsSprite(sprite): boolean
    // {
    //     sphere.center.set(0, 0, 0);
    //     sphere.radius = 0.7071067811865476;
    //     sphere.applyMatrix4(sprite.matrixWorld);
    //     return this.intersectsSphere(sphere);
    // }
    intersectsSphere(sphere) {
        const planes = this._planes;
        const center = sphere.center;
        const negRadius = -sphere.radius;
        for (let i = 0; i < 6; i++) {
            const distance = planes[i].distanceToPoint(center);
            if (distance < negRadius) {
                return false;
            }
        }
        return true;
    }
    intersectsBox(box) {
        const planes = this._planes;
        for (let i = 0; i < 6; i++) {
            const plane = planes[i];
            // corner at max distance
            p.x = plane.normal.x > 0 ? box.max.x : box.min.x;
            p.y = plane.normal.y > 0 ? box.max.y : box.min.y;
            p.z = plane.normal.z > 0 ? box.max.z : box.min.z;
            if (plane.distanceToPoint(p) < 0) {
                return false;
            }
        }
        return true;
    }
    containsPoint(point) {
        const planes = this._planes;
        for (let i = 0; i < 6; i++) {
            if (planes[i].distanceToPoint(point) < 0) {
                return false;
            }
        }
        return true;
    }
}
const p = new Vector3();
