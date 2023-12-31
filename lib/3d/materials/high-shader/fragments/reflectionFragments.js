/**
 * calculates the environment color using an environment cube texture
 */
export const reflectionStandard = {
    fragment: {
        header: `
            uniform vec2 uMetalRoughnessPower;

            uniform samplerCube uEnvironmentMap;
        `,
        material: `
    
            if(uMetalRoughnessPower[0] > 0.)
            {
                vec3 direction = reflect(eyeToSurfaceDir, worldNormal);
                float mipCount = 9.;

                float lod = clamp(uMetalRoughnessPower[1] * mipCount, 0.0, mipCount);

                vec3 realReflection = textureCubeSRGB(uEnvironmentMap, normalize(direction), lod).rgb;
                reflectionColor = mix(reflectionColor, realReflection, uMetalRoughnessPower[0]);
            }
        `,
    },
};
export const reflectionBoxPerspective = {
    fragment: {
        header: `
            uniform vec3 boxMin;
            uniform vec3 boxMax;
            uniform vec3 boxPosition;

            uniform vec2 uMetalRoughnessPower;
            uniform samplerCube uEnvironmentMap;

            vec3 BoxProjection (
                vec3 direction, 
                vec3 position,
                vec3 cubeMapPosition, 
                vec3 boxMin, 
                vec3 boxMax 
            ) {
                vec3 factors = mix(boxMin, boxMax, step(0., direction));
             
                factors = (factors - position) / direction; 
            
                float scalar = min(min(factors.x, factors.y), factors.z);
                return direction * scalar + (position - cubeMapPosition);
            }
        `,
        material: `
    
            if(uMetalRoughnessPower[0] > 0.)
            {
                vec3 direction = reflect(eyeToSurfaceDir, worldNormal);
                float mipCount = 9.;

                float lod = clamp(uMetalRoughnessPower[1] * mipCount, 0.0, mipCount);

                vec3 realDirection = BoxProjection(
                    normalize(direction),
                    worldPosition,//i.worldPos,
                    boxPosition,//vec3(0.),//unity_SpecCube0_ProbePosition,
                    boxPosition - vec3(40.),//unity_SpecCube0_BoxMin,
                    boxPosition + vec3(40.)// unity_SpecCube0_BoxMax
                );

                vec3 realReflection = textureCubeSRGB(uEnvironmentMap, realDirection, lod).rgb;
                reflectionColor = mix(reflectionColor, realReflection, uMetalRoughnessPower[0]);
            }
        `,
    },
};
export const planeReflectionFragment = {
    fragment: {
        header: `
            uniform sampler2D uEnvironmentMap;
            uniform vec2 uResolution;
        `,
        material: `
            vec2 screenSpace = gl_FragCoord.xy/uResolution;
            
            reflectionColor = texture2DSRGB(uEnvironmentMap, screenSpace).rgb;
        `,
    },
};
