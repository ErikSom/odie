/**
 * Helper for warning developers about deprecated features & settings.
 * A stack track for warnings is given; useful for tracking-down where
 * deprecated methods/properties/classes are being used within the code.
 * @param version - The version where the feature became deprecated
 * @param message - Message should include what is deprecated, where, and the new solution
 * @param ignoreDepth - The number of steps to ignore at the top of the error stack
 * this is mostly to ignore internal deprecation calls.
 */
export declare function deprecation(version: string, message: string, ignoreDepth?: number): void;
//# sourceMappingURL=deprecation.d.ts.map