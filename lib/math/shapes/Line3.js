/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { clamp } from '../Math';
import { Vector3 } from '../vector/Vector3';
export class Line3 {
    constructor(start, end) {
        this.start = (start !== undefined) ? start : new Vector3();
        this.end = (end !== undefined) ? end : new Vector3();
    }
    set(start, end) {
        this.start.copy(start);
        this.end.copy(end);
        return this;
    }
    clone() {
        return new Line3().copy(this);
    }
    copy(line) {
        this.start.copy(line.start);
        this.end.copy(line.end);
        return this;
    }
    getCenter(out) {
        return out.addVectors(this.start, this.end).multiplyScalar(0.5);
    }
    delta(out) {
        return out.subVectors(this.end, this.start);
    }
    distanceSq() {
        return this.start.distanceToSquared(this.end);
    }
    distance() {
        return this.start.distanceTo(this.end);
    }
    at(t, out) {
        return this.delta(out).multiplyScalar(t).add(this.start);
    }
    closestPointToPointParameter(point, clampToLine) {
        startP.subVectors(point, this.start);
        startEnd.subVectors(this.end, this.start);
        const startEnd2 = startEnd.dot(startEnd);
        const startEndStartP = startEnd.dot(startP);
        let t = startEndStartP / startEnd2;
        if (clampToLine) {
            t = clamp(t, 0, 1);
        }
        return t;
    }
    closestPointToPoint(point, clampToLine, out) {
        const t = this.closestPointToPointParameter(point, clampToLine);
        return this.delta(out).multiplyScalar(t).add(this.start);
    }
    applyMatrix4(matrix) {
        this.start.applyMatrix4(matrix);
        this.end.applyMatrix4(matrix);
        return this;
    }
    equals(line) {
        return line.start.equals(this.start) && line.end.equals(this.end);
    }
}
const startP = new Vector3();
const startEnd = new Vector3();
