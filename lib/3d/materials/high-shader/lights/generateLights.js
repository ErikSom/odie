/**
 * the cache that stores compiled lights so we can save our selves from processing them each frame.
 */
const cache = {};
/**
 * Similar to `generateLights` but will also compile shadow code too.
 *
 * @param lights - an array of odie light entities to generate code for
 */
export function generateLightsWithShadow(lights) {
    return generateLights(lights, true);
}
/**
 * this will generate a high fragment that will do all the lighting calculations
 * for each light in the scene.
 *
 * @param lights - the in game lights
 */
export function generateLights(lights, receiveShadows = false) {
    const lightSignature = lights.map((light) => light.UID).join('-') + receiveShadows;
    if (cache[lightSignature])
        return cache[lightSignature];
    const vertexHeader = [];
    const fragmentHeader = [];
    const vertex = [];
    const fragment = [];
    fragment.push(`
        float attenuation;
        float amountInLight = 1.;
        float shininessPower = specular;
        float shininessIntensity = gloss;
        float distanceFromLight;
        float inLight;

        float dotFromDirection;

        vec3 lightDirection;
        vec3 lightDirectionNormal;
    `);
    const shadows = receiveShadows && !!lights.find((light) => light.shadow);
    if (shadows) {
        fragment.push(`
            vec4 fragmentDepth;
            float shadowAcneRemover;

            vec2 poissonDisk[4];
            poissonDisk[0] = vec2(-0.94201624, -0.39906216);
            poissonDisk[1] = vec2(0.94558609, -0.76890725);
            poissonDisk[2] = vec2(-0.094184101, -0.92938870);
            poissonDisk[3] = vec2(0.34495938, 0.29387760);
        `);
        vertex.push(`
            const mat4 texUnitConverter = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);
        `);
    }
    lights.forEach((light) => {
        switch (light.light.type) {
            case 0:
                addDirectionalLight(vertexHeader, fragmentHeader, fragment, vertex, light, receiveShadows);
                break;
            case 1:
                addPointLight(vertexHeader, fragmentHeader, fragment, vertex, light, receiveShadows);
                break;
            case 2:
                addSpotLight(vertexHeader, fragmentHeader, fragment, vertex, light, receiveShadows);
                break;
        }
    });
    fragmentHeader.push(`
        #define saturate(a) clamp( a, 0.0, 1.0 )

        float diffuseLighting(vec3 normal, vec3 lightDirection)
        {
            return max(dot(normal, -lightDirection), 0.0);
        }

        float specularLighting(vec3 normal, vec3 eyeToSurfaceDir, vec3 lightDirection, float shininessPower, float shininessIntensity)
        {
            vec3 reflection = normalize(reflect(eyeToSurfaceDir, normal));
            float specularFactor = dot(reflection, -lightDirection);
            specularFactor = max(specularFactor, 0.0);
            specularFactor = pow(specularFactor, shininessPower);

            return specularFactor * shininessIntensity + 0.0001;
        }
    `);
    // add global lighting...
    fragmentHeader.push(`
        uniform vec3 uGlobalAmbient;
    `);
    fragment.push(`
        // fix for android
        specularColor = clamp(specularColor, 0.,1.);

        lightingColor += uGlobalAmbient;
    `);
    const highFragment = {
        vertex: {
            header: vertexHeader.join('\n'),
            lighting: vertex.join('\n'),
        },
        fragment: {
            header: fragmentHeader.join('\n'),
            main: fragment.join('\n'),
        },
    };
    cache[lightSignature] = highFragment;
    return highFragment;
}
/**
 * Adds directional light src code to the lights HightFragment
 *
 * @param vertexHeader - array vertex header code
 * @param fragmentHeader - array fragment header code
 * @param fragments - the array of fragment code
 * @param vertex - the array of vertex code
 * @param light - the directional light entity to generate code for
 * @param receiveShadows - should shadow code be generated?
 */
function addDirectionalLight(vertexHeader, fragmentHeader, fragments, vertex, light, receiveShadows) {
    const lightId = light.light.lightId;
    fragments.push(`
        amountInLight = 1.0;
    `);
    if (receiveShadows && light.shadow) {
        vertexHeader.push(`
            varying vec4 vShadowPosition${lightId};
            uniform mat4 uShadowProjectionView${lightId};
        `);
        // TODO can probably condense these down to uniform arrays!
        fragmentHeader.push(`
            uniform sampler2D uShadowMap${lightId};
            varying vec4 vShadowPosition${lightId};
            uniform vec2 uShadowParams${lightId};
            uniform mat4 uShadowProjectionView${lightId};
        `);
        fragments.push(`
            fragmentDepth = vShadowPosition${lightId};
            shadowAcneRemover = uShadowParams${lightId}[0];
            fragmentDepth.z -= shadowAcneRemover;

            for (int i=0;i<4;i++){
                if ( texture2D( uShadowMap${lightId}, fragmentDepth.xy + poissonDisk[i]/ uShadowParams${lightId}[1] ).x  <  fragmentDepth.z ){
                    amountInLight-=0.25;
                }
            }
        `);
        vertex.push(`
            vShadowPosition${lightId} = texUnitConverter * uShadowProjectionView${lightId} * worldPosition;
        `);
    }
    fragmentHeader.push(`
        uniform vec3 uLightColor${lightId};
        uniform vec3 uLightDirection${lightId};
    `);
    fragments.push(`
        attenuation = 1.;
        attenuation *= diffuseLighting(worldNormal,uLightDirection${lightId}) * amountInLight;
        if(attenuation > 0.0001)
        {
            lightingColor += (attenuation * uLightColor${lightId});
            attenuation *= specularLighting(worldNormal, eyeToSurfaceDir,uLightDirection${lightId}, shininessPower, shininessIntensity);
            specularColor += (attenuation * uLightColor${lightId});
        }
    `);
}
/**
 * Adds point light src code to the lights HightFragment
 *
 * @param vertexHeader - array vertex header code
 * @param fragmentHeader - array fragment header code
 * @param fragments - the array of fragment code
 * @param vertex - the array of vertex code
 * @param light - the directional light entity to generate code for
 * @param receiveShadows - should shadow code be generated?
 */
function addPointLight(_vertexHeader, fragmentHeader, fragments, _vertex, light, receiveShadows) {
    const lightId = light.light.lightId;
    if (receiveShadows && light.shadow) {
        console.warn('point light shadow not implemented just yet!');
    }
    fragmentHeader.push(`
        uniform vec3 uLightColor${lightId};
        uniform vec3 uLightDirection${lightId};
        uniform vec3 uLightPosition${lightId};
        uniform float uLightDistance${lightId};
    `);
    fragments.push(`
        lightDirection = worldPosition - uLightPosition${lightId};
        lightDirectionNormal = normalize(lightDirection);
        distanceFromLight = length(lightDirection);
        attenuation = pow(  saturate(-distanceFromLight / uLightDistance${lightId} + 1.0) , 1. ) * amountInLight;

        if(attenuation > 0.0001)
        {
            attenuation *= diffuseLighting(worldNormal,lightDirectionNormal);
            lightingColor += attenuation * uLightColor${lightId};
            attenuation *= specularLighting(worldNormal,eyeToSurfaceDir,lightDirectionNormal, shininessPower, shininessIntensity);
            specularColor += attenuation * uLightColor${lightId};
        }
    `);
}
/**
 * Adds spot light src code to the lights HightFragment
 *
 * @param vertexHeader - array vertex header code
 * @param fragmentHeader - array fragment header code
 * @param fragments - the array of fragment code
 * @param vertex - the array of vertex code
 * @param light - the directional light entity to generate code for
 * @param receiveShadows - should shadow code be generated?
 */
function addSpotLight(vertexHeader, fragmentHeader, fragments, vertex, light, receiveShadows) {
    const lightId = light.light.lightId;
    fragments.push(`
        amountInLight = 1.0;
    `);
    if (receiveShadows && light.shadow) {
        vertexHeader.push(`
            varying vec4 vShadowPosition${lightId};
            uniform mat4 uShadowProjectionView${lightId};
        `);
        fragmentHeader.push(`
            uniform sampler2D uShadowMap${lightId};
            uniform vec2 uShadowParams${lightId};
            varying vec4 vShadowPosition${lightId};
        `);
        fragments.push(`
            fragmentDepth = vShadowPosition${lightId};
            fragmentDepth.xyz /= fragmentDepth.w;
            shadowAcneRemover = uShadowParams${lightId}[0];
            fragmentDepth.z -= shadowAcneRemover;

            for (int i=0;i<4;i++){
                if ( texture2D( uShadowMap${lightId}, fragmentDepth.xy + poissonDisk[i]/uShadowParams${lightId}[1] ).x  <  fragmentDepth.z ){
                    amountInLight-=0.25;
                }
            }
        `);
        vertex.push(`
            vShadowPosition${lightId} = texUnitConverter * uShadowProjectionView${lightId} * worldPosition;
        `);
    }
    fragmentHeader.push(`
        uniform vec3 uLightColor${lightId};
        uniform vec3 uLightDirection${lightId};
        uniform vec3 uLightPosition${lightId};
        uniform float uLightDistance${lightId};
        uniform vec2 uLimit${lightId};
    `);
    fragments.push(`
        lightDirection = worldPosition - uLightPosition${lightId};
        lightDirectionNormal = normalize(lightDirection);
        distanceFromLight = length(lightDirection);
        dotFromDirection = dot(-normalize(lightDirection), -uLightDirection${lightId});
        inLight = smoothstep(uLimit${lightId}.y, uLimit${lightId}.x, dotFromDirection);

        attenuation = pow(  saturate(-distanceFromLight / uLightDistance${lightId} + 1.0) , 1. ) * amountInLight;

        if(attenuation > 0.0001)
        {
            attenuation *= diffuseLighting(worldNormal,lightDirectionNormal) * inLight;
            lightingColor += attenuation * uLightColor${lightId};
            attenuation *= specularLighting(worldNormal,eyeToSurfaceDir,lightDirectionNormal, shininessPower, shininessIntensity) * inLight;
            specularColor += attenuation * uLightColor${lightId};
        }
    `);
}
