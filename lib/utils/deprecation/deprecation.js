// A map of warning messages already fired
const warnings = {};
/**
 * Helper for warning developers about deprecated features & settings.
 * A stack track for warnings is given; useful for tracking-down where
 * deprecated methods/properties/classes are being used within the code.
 * @param version - The version where the feature became deprecated
 * @param message - Message should include what is deprecated, where, and the new solution
 * @param ignoreDepth - The number of steps to ignore at the top of the error stack
 * this is mostly to ignore internal deprecation calls.
 */
export function deprecation(version, message, ignoreDepth = 3) {
    // Ignore duplicate
    if (warnings[message]) {
        return;
    }
    /* eslint-disable no-console */
    let stack = new Error().stack;
    // Handle IE < 10 and Safari < 6
    if (typeof stack === 'undefined') {
        console.warn('Odie Deprecation Warning: ', `${message}\nDeprecated since v${version}`);
    }
    else {
        // chop off the stack trace which includes Odie internal calls
        stack = stack.split('\n').splice(ignoreDepth).join('\n');
        if (console.groupCollapsed) {
            console.groupCollapsed('%Odie Deprecation Warning: %c%s', 'color:#614108;background:#fffbe6', 'font-weight:normal;color:#614108;background:#fffbe6', `${message}\nDeprecated since v${version}`);
            console.warn(stack);
            console.groupEnd();
        }
        else {
            console.warn('Odie Deprecation Warning: ', `${message}\nDeprecated since v${version}`);
            console.warn(stack);
        }
    }
    /* eslint-enable no-console */
    warnings[message] = true;
}
