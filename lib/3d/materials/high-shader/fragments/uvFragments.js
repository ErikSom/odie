/**
 * super basic uv calculation - we just pass them to the fragment
 */
export const uvsStandard = {
    vertex: {
        header: `
            attribute vec2 aUv;
            varying vec2 vUv;
        `,
        transform: `     
            vUv = aUv;
        `,
    },
    fragment: {
        header: `
            varying vec2 vUv;
        `,
        material: `
            uv = vUv;
        `,
    },
};
/**
 * uv calculation taking a frame into account.
 * this lets us use a texture in a sprite sheet
 */
export const uvsWithFrameStandard = {
    vertex: {
        header: `
            uniform vec4 uMapFrame;
            attribute vec2 aUv;
            varying vec2 vUv;
        `,
        transform: `     
            vUv = (aUv * uMapFrame.zw ) + uMapFrame.xy;
        `,
    },
    fragment: {
        header: `
            varying vec2 vUv;
        `,
        material: `
            uv = vUv;
        `,
    },
};
