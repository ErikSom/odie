/**
 * a fragment that just sets the lighting to 1.
 */
export const noLights = {
    fragment: {
        main: `
            lightingColor = vec3(1.);
        `,
    },
};
export function generateNoLights() {
    return noLights;
}
