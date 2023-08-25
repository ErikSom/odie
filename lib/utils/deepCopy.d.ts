/**
 * A version of Object.assign that does a deep copy as opposed to a shallow copy
 * Its pretty basic! But seems to do the trick :)
 *
 * @param target - the object to copy too
 * @param copy - the object to copy values to
 */
export declare function deepCopy<T>(copy: T): T;
export declare function deepCopyChildren<T>(copy: T, target: T): void;
//# sourceMappingURL=deepCopy.d.ts.map