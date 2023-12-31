/**
 * bog standard way to set the diffuse color using a texturee
 */
export const diffuseStandard = {
    fragment: {
        header: `
            uniform sampler2D uDiffuseMap;
        `,
        material: `
            diffuseColor *= texture2DSRGB(uDiffuseMap, uv);
        `,
    },
};
