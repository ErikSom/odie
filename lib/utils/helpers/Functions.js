export function NOOP() {
    // Do nothing
}
/**
 * Removes an item from an array if it exists
 * @param arr - array to remove from
 * @param item - item to remove
 * @returns an array with the item removed
 */
export function removeFromArray(arr, item) {
    ~arr.indexOf(item) && arr.splice(arr.indexOf(item), 1);
    return arr;
}
/**
 * Removes all items from an array and calls a function for each item
 * @param arr - array to remove from
 * @param callback - a callback per item
 * @returns an empty array
 * @remarks if you just want to clear the array without the callback, use `array.length = 0` instead
 */
export function removeAllFromArray(arr, callback) {
    for (let i = arr.length - 1; i >= 0; --i) {
        const item = arr[i];
        callback === null || callback === void 0 ? void 0 : callback(item);
        removeFromArray(arr, item);
    }
    return arr;
}
