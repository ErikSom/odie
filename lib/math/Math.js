export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
// compute euclidian modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation
export function euclideanModulo(n, m) {
    return ((n % m) + m) % m;
}
// Linear mapping from range <a1, a2> to range <b1, b2>
export function mapLinear(x, a1, a2, b1, b2) {
    return b1 + ((x - a1) * (b2 - b1) / (a2 - a1));
}
// https://en.wikipedia.org/wiki/Linear_interpolation
export function lerp(x, y, t) {
    return ((1 - t) * x) + (t * y);
}
// http://en.wikipedia.org/wiki/Smoothstep
export function smoothstep(x, min, max) {
    if (x <= min)
        return 0;
    if (x >= max)
        return 1;
    x = (x - min) / (max - min);
    return x * x * (3 - (2 * x));
}
export function smootherstep(x, min, max) {
    if (x <= min)
        return 0;
    if (x >= max)
        return 1;
    x = (x - min) / (max - min);
    return x * x * x * ((x * ((x * 6) - 15)) + 10);
}
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
export function smallestAngle(angle, targetAngle) {
    angle %= Math.PI * 2;
    if (angle < 0)
        angle += Math.PI * 2;
    // STANDARD
    const difference1 = targetAngle - angle;
    // "ROUND THE HORN" CLOCKWISE / POSITIVE
    const difference2 = (targetAngle + (Math.PI * 2)) - angle;
    // "ROUND THE HORN" ANTI-CLOCKWISE / NEGATIVE
    const difference3 = (targetAngle - (Math.PI * 2)) - angle;
    // GET SHORTEST
    const absDifference1 = Math.abs(difference1);
    const absDifference2 = Math.abs(difference2);
    const absDifference3 = Math.abs(difference3);
    let difference = difference1;
    if (absDifference2 < absDifference1 && absDifference2 < absDifference3) {
        difference = difference2;
    }
    else if (absDifference3 < absDifference1 && absDifference3 < absDifference2) {
        difference = difference3;
    }
    return difference;
}
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
export function round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
/**
 * Rotates a point by an angle in radians.
 *
 * @param point - point to rotate
 * @param angle - angle to rotate by
 */
export function rotatePoint(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = (cos * point.x) - (sin * point.y);
    const y = (cos * point.y) + (sin * point.x);
    point.x = x;
    point.y = y;
}
/**
 * Checks if two bounds are overlapping.
 * Bounds are calculated assuming x,y is at the top left corner
 * @param rect1 - bounding box to check
 * @param rect2 - bounding box to check
 */
export function aabbIntersect(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.width
        && rect1.x + rect1.width > rect2.x
        && rect1.y < rect2.y + rect2.height
        && rect1.y + rect1.height > rect2.y);
}
