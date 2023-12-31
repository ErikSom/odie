/**
 * set the the emissive color of the material based on the
 * an emissive texture and an emissive color
 */
export const emissiveStandard = {
    fragment: {
        header: `
            uniform vec3 uEmissiveColor;
            uniform sampler2D uEmissiveMap;
        `,
        material: `
            emissiveColor = uEmissiveColor;
            emissiveColor *= texture2DSRGB(uEmissiveMap, uv).rgb;
        `,
    },
};
