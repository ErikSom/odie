/**
 * adds GPU morph targets transform to the geometry
 */
export const morphTargetStandard = {
    name: `morph targets transform`,
    vertex: {
        header: `
            attribute vec3 aMorphTargetPosition1;
            attribute vec3 aMorphTargetPosition2;
            attribute vec3 aMorphTargetPosition3;
            attribute vec3 aMorphTargetPosition4;

            uniform float uMorphTargetInfluence[4];
        `,
        transform: `
            worldPosition.xyz += aMorphTargetPosition1 * uMorphTargetInfluence[ 0 ];
            worldPosition.xyz += aMorphTargetPosition2 * uMorphTargetInfluence[ 1 ];
            worldPosition.xyz += aMorphTargetPosition3 * uMorphTargetInfluence[ 2 ];
            worldPosition.xyz += aMorphTargetPosition4 * uMorphTargetInfluence[ 3 ];
        `,
    },
};
/**
 * adds GPU morph targets transform to the geometry
 */
export const morphTargetNormalStandard = {
    name: `morph targets normal transform`,
    vertex: {
        header: `
            attribute vec3 aMorphTargetPosition1;
            attribute vec3 aMorphTargetPosition2;
            attribute vec3 aMorphTargetPosition3;
            attribute vec3 aMorphTargetPosition4;

            attribute vec3 aMorphTargetNormal1;
            attribute vec3 aMorphTargetNormal2;
            attribute vec3 aMorphTargetNormal3;
            attribute vec3 aMorphTargetNormal4;

            uniform float uMorphTargetInfluence[4];
        `,
        transform: `
            worldPosition.xyz += aMorphTargetPosition1 * uMorphTargetInfluence[ 0 ];
            worldPosition.xyz += aMorphTargetPosition2 * uMorphTargetInfluence[ 1 ];
            worldPosition.xyz += aMorphTargetPosition3 * uMorphTargetInfluence[ 2 ];
            worldPosition.xyz += aMorphTargetPosition4 * uMorphTargetInfluence[ 3 ];

            worldNormal.xyz += aMorphTargetNormal1 * uMorphTargetInfluence[ 0 ];
            worldNormal.xyz += aMorphTargetNormal2 * uMorphTargetInfluence[ 1 ];
            worldNormal.xyz += aMorphTargetNormal3 * uMorphTargetInfluence[ 2 ];
            worldNormal.xyz += aMorphTargetNormal4 * uMorphTargetInfluence[ 3 ];
        `,
    },
};
