/**
 * fragment for discarding pixels if the alpha threshold is not met
 */
export const alphaDiscard = {
    fragment: {
        header: `
            uniform float uAlphaTest;
        `,
        main: `
            if(alphaColor < uAlphaTest)
            {
                discard;
            }
        `,
    },
};
