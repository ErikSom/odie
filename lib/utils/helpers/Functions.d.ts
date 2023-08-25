export declare function NOOP(): void;
/**
 * Removes an item from an array if it exists
 * @param arr - array to remove from
 * @param item - item to remove
 * @returns an array with the item removed
 */
export declare function removeFromArray<T>(arr: T[], item: T): T[];
/**
 * Removes all items from an array and calls a function for each item
 * @param arr - array to remove from
 * @param callback - a callback per item
 * @returns an empty array
 * @remarks if you just want to clear the array without the callback, use `array.length = 0` instead
 */
export declare function removeAllFromArray<T>(arr: T[], callback?: (item: T) => void): T[];
//# sourceMappingURL=Functions.d.ts.map