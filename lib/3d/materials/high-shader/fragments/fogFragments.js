/**
 * the standard fog implementation. This will
 * make stuff fade out to a color as they get further away
 */
export const fogStandard = {
    vertex: {
        header: `
            varying float vFogDepth;
        `,
        end: `
            vFogDepth = length(worldCameraPosition.xyz);
        `,
    },
    fragment: {
        header: `
            varying float vFogDepth;
            uniform float uFogNear;
            uniform float uFogFar;
            uniform vec3 uFogColor;
        `,
        end: `
            float fogFactor = smoothstep( uFogNear, uFogFar, vFogDepth );
            finalColor.rgb = mix(finalColor.rgb, uFogColor * diffuseColor.a, fogFactor);
        `,
    },
};
/**
 * cheap fog implementation. This will
 * make stuff fade out to a color as they get further away
 */
export const fogCheap = {
    fragment: {
        header: `
            uniform float uFogNear;
            uniform float uFogFar;
            uniform vec3 uFogColor;
        `,
        end: `
            float fogFactor = smoothstep( uFogNear, uFogFar, gl_FragCoord.z );
            finalColor.rgb = mix(finalColor.rgb, uFogColor * diffuseColor.a, fogFactor);
        `,
    },
};
