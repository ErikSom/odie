/**
 * A version of Object.assign that does a deep copy as opposed to a shallow copy
 * Its pretty basic! But seems to do the trick :)
 *
 * @param target - the object to copy too
 * @param copy - the object to copy values to
 */
export function deepCopy(copy) {
    let target = null;
    if (ArrayBuffer.isView(copy)) {
        // eslint-disable-next-line
        return new copy.constructor(copy);
    }
    else if (Array.isArray(copy)) {
        target = [];
    }
    else if (typeof copy === 'object') {
        target = {};
    }
    else {
        return copy;
    }
    deepCopyChildren(copy, target);
    return target;
}
export function deepCopyChildren(copy, target) {
    for (const i in copy) {
        const valueToCopy = copy[i];
        if (ArrayBuffer.isView(valueToCopy)) {
            target[i] = new valueToCopy.constructor(valueToCopy);
        }
        else if (Array.isArray(valueToCopy)) {
            target[i] = [];
            deepCopyChildren(valueToCopy, target[i]);
        }
        else if (typeof valueToCopy === 'object') {
            target[i] = {};
            deepCopyChildren(valueToCopy, target[i]);
        }
        else {
            target[i] = valueToCopy;
        }
    }
}
