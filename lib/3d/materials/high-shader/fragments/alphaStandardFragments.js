/**
 * how the alpha of a material is calculated
 * this one just uses the alpha of the diffuse texture
 */
export const alphaStandard = {
    fragment: {
        material: `
            alphaColor = diffuseColor.a;
        `,
    },
};
/**
 * how the alpha of a material is calculated
 * this one just uses the alpha of the diffuse texture
 */
export const alphaMap = {
    fragment: {
        header: `
            uniform sampler2D uAlphaMap;
        `,
        material: `
            alphaColor = texture2D(uAlphaMap, uv).a;
        `,
    },
};
