/**
 * Returns a random color
 */
export function randomColor() {
    return Math.floor(0xFFFFFF * Math.random());
}
/**
 * Returns a random number within a range
 * @param min - lowest number (inclusive)
 * @param max - highest number (exclusive)
 * @param floor - whether the number should be floored
 */
export function randomRange(min, max, floor = false) {
    const v = min + ((max - min) * Math.random());
    return floor ? Math.floor(v) : v;
}
/**
 * Returns a random item from the ones provided
 * @param args - items to be selected
 */
export function randomPick(...args) {
    return args[Math.floor(Math.random() * args.length)];
}
/**
 * Returns a random value from an object
 * @param obj - object to be selected
 */
export function randomObjItem(obj) {
    const keys = Object.keys(obj);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return obj[key];
}
/**
 * Returns a random item from an array
 * @param arr - array to be selected
 */
export function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
/**
 * Returns a random number within a range.
 *
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (exclusive).
 */
export function randomFloat(min, max) {
    return (Math.random() * (max - min)) + min;
}
/**
 * Returns a random integer within a range.
 *
 * @param min - The minimum value (inclusive).
 * @param max - The minimum value (inclusive).
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Returns a random boolean.
 */
export function randomBool(weight = 0.5) {
    return Math.random() < weight;
}
/**
 * Return -1 or 1.
 */
export function randomSign() {
    return (randomInt(0, 1) * 2) - 1;
}
