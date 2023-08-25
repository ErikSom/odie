/**
 * Returns a random color
 */
export declare function randomColor(): number;
/**
 * Returns a random number within a range
 * @param min - lowest number (inclusive)
 * @param max - highest number (exclusive)
 * @param floor - whether the number should be floored
 */
export declare function randomRange(min: number, max: number, floor?: boolean): number;
/**
 * Returns a random item from the ones provided
 * @param args - items to be selected
 */
export declare function randomPick<T>(...args: T[]): T;
/**
 * Returns a random value from an object
 * @param obj - object to be selected
 */
export declare function randomObjItem<T>(obj: T): T[keyof T];
/**
 * Returns a random item from an array
 * @param arr - array to be selected
 */
export declare function randomItem<T>(arr: T[]): T;
/**
 * Returns a random number within a range.
 *
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (exclusive).
 */
export declare function randomFloat(min: number, max: number): number;
/**
 * Returns a random integer within a range.
 *
 * @param min - The minimum value (inclusive).
 * @param max - The minimum value (inclusive).
 */
export declare function randomInt(min: number, max: number): number;
/**
 * Returns a random boolean.
 */
export declare function randomBool(weight?: number): boolean;
/**
 * Return -1 or 1.
 */
export declare function randomSign(): number;
//# sourceMappingURL=Random.d.ts.map