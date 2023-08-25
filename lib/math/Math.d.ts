import type { Bounds, XY } from '../utils';
export declare function clamp(value: number, min: number, max: number): number;
export declare function euclideanModulo(n: number, m: number): number;
export declare function mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;
export declare function lerp(x: number, y: number, t: number): number;
export declare function smoothstep(x: number, min: number, max: number): number;
export declare function smootherstep(x: number, min: number, max: number): number;
/**
 * this is a super cool function for dealing with rotational easing...
 * there is always a problem when we flip from 359 -\> 0 degrees when we have easing on rotations
 * Use this function instead!
 *
 * ```
 *
 * // bad! causes weird flips!
 * spinny.rotation += (spinny.rotation - targetRotation) * 0.3;
 *
 * // good! smooth as butter :D
 * spinny.rotation += smallestAngle(spinny.rotation, targetRotation) * 0.3;
 *
 * ```
 *
 * @param angle - the current angle
 * @param targetAngle - the angle you would like to get to
 */
export declare function smallestAngle(angle: number, targetAngle: number): number;
/**
 * Rounds a number down to a specified number of points.
 * @example
 *
 * ```
 * const rounded = round(20.324234234, 2);
 * rounded // 20.32
 * ```
 * @param value - the number to round
 * @param precision - the number of decimal points to leave on the number
 */
export declare function round(value: number, precision?: number): number;
/**
 * Rotates a point by an angle in radians.
 *
 * @param point - point to rotate
 * @param angle - angle to rotate by
 */
export declare function rotatePoint(point: XY, angle: number): void;
/**
 * Checks if two bounds are overlapping.
 * Bounds are calculated assuming x,y is at the top left corner
 * @param rect1 - bounding box to check
 * @param rect2 - bounding box to check
 */
export declare function aabbIntersect(rect1: Bounds, rect2: Bounds): boolean;
//# sourceMappingURL=Math.d.ts.map