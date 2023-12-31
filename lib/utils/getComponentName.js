// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getComponentName(_class) {
    let name = _class.DEFAULT_NAME;
    if (!name) {
        name = _class.name;
        // DON'T know why... but using terser seems to double up class names
        // lets keep an eye on this and remove when terser plugin updates!
        const split = name.split('_');
        if (split[0] === split[1]) {
            name = split[0];
        }
        name = name[0].toLowerCase() + name.slice(1);
    }
    if (!name) {
        console.warn(`${_class} does not have a name!`);
    }
    return name;
}
