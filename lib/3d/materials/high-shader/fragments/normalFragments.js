/**
 * calculates the world normal for the material
 */
export const normalStandard = {
    vertex: {
        main: `
            worldNormal = normalize(uNormalMatrix * worldNormal); 
        `,
    },
    fragment: {
        material: `
            worldNormal = normalize(vWorldNormal);
        `,
    },
};
/**
 * calculates the world normal for the material and takes into account
 * a normal map. Using tangents if available
 */
export const normalMapTangentStandard = {
    vertex: {
        header: `
            attribute vec4 aTangent;
            varying vec3 vTangentW;
            varying vec3 vBitangentW;
        `,
        main: `
            worldNormal = normalize(uNormalMatrix * worldNormal);
                    
            vTangentW = normalize(vec3(modelMatrix * vec4(aTangent.xyz, 0.0)));
            vBitangentW = cross(worldNormal, vTangentW) * aTangent.w;   
        `,
    },
    fragment: {
        header: `
            uniform sampler2D uNormalMap;
            uniform float uNormalScale;
            varying vec3 vTangentW;
            varying vec3 vBitangentW;
        `,
        material: `
            mat3 tbn = mat3(vTangentW, vTangentW, vWorldNormal);
            vec3 n = texture2D(uNormalMap, uv).rgb;
        
            worldNormal = normalize(tbn * ((2.0 * n - 1.0) * vec3(uNormalScale, uNormalScale, 1.0)));
        `,
    },
};
/**
 * calculates the world normal for the material and takes into account
 * a normal map. Uses standard derivatives, no tangents required
 */
export const normalMapStandard = {
    vertex: {
        main: `
            worldNormal = normalize(uNormalMatrix * worldNormal);
        `,
    },
    fragment: {
        header: `
            #extension GL_OES_standard_derivatives : enable
            
            uniform sampler2D uNormalMap;
            uniform float uNormalScale;
            
           
            #ifdef GL_OES_standard_derivatives

                vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, vec2 uvs ) {
                    vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
                    vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
                    vec2 st0 = dFdx( uvs.st );
                    vec2 st1 = dFdy( uvs.st );
                    float scale = sign( st1.t * st0.s - st0.t * st1.s );
                    vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
                    vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );
                    vec3 N = normalize( surf_norm );
                    mat3 tsn = mat3( S, T, N );
                    mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );
                    return normalize( tsn * mapN );
                }
        
            #endif
            `,
        material: `     
            vec3 n = texture2D(uNormalMap, vUv).rgb;
            vec3 mapN = (2.0 * n - 1.0) * vec3(uNormalScale, uNormalScale, 1.);
    
            mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );

            #ifdef GL_OES_standard_derivatives
                worldNormal = perturbNormal2Arb( vWorldPosition.rgb, vWorldNormal, mapN, vUv );
            #endif
        `,
    },
    fragment2: {
        header: `  
            uniform sampler2D uNormalMap;
            uniform float uNormalScale;
            
            vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, vec2 uvs ) { 
                vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
                vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
                vec2 st0 = dFdx( uvs.st );
                vec2 st1 = dFdy( uvs.st );
                float scale = sign( st1.t * st0.s - st0.t * st1.s );
                vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
                vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );
                vec3 N = normalize( surf_norm );
                mat3 tsn = mat3( S, T, N );
                mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );
                return normalize( tsn * mapN );
            }

            `,
        material: `     
            vec3 n = texture2D(uNormalMap, vUv).rgb;
            vec3 mapN = (2.0 * n - 1.0) * vec3(uNormalScale, uNormalScale, 1.);
    
            mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );

            worldNormal = perturbNormal2Arb( vWorldPosition.rgb, vWorldNormal, mapN, vUv );
        `,
    },
};
