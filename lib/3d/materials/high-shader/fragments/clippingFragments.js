/**
 * used for clipping a geometry by using a mathematical lane
 */
export const clipping = {
    vertex: {
        header: `
            uniform vec4 uClippingPlane;
            varying float aClipCheck;
        `,
        main: `
            aClipCheck = dot(worldPosition, uClippingPlane);
        `,
    },
    fragment: {
        header: `
            varying float aClipCheck;
        `,
        material: `
            if (aClipCheck < 0.0)
            {
                discard;
            }
        `,
    },
};
