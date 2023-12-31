/**
 * a set of GLSL functions that allow us to gamma correct our colors
 */
export const colorGamma = {
    fragment: {
        header: `
            // gamma conversion functions..
            vec3 gammaCorrectInput(vec3 color) {
                return pow(color, vec3(2.2));
            }
            
            float gammaCorrectInput(float color) {
                return pow(color, 2.2);
            }
            
            vec4 gammaCorrectInput(vec4 color) {
                return vec4(pow(color.rgb, vec3(2.2)), color.a);
            }
            
            vec3 gammaCorrectOutput(vec3 color) {
                color += vec3(0.0000001);
                return pow(color, vec3(0.45));
            }
            
            vec4 texture2DSRGB(sampler2D tex, vec2 uv) {
                vec4 rgba = texture2D(tex, uv);
                rgba.rgb = gammaCorrectInput(rgba.rgb);
                return rgba;
            }
            
            vec4 textureCubeSRGB(samplerCube tex, vec3 uvw) {
                vec4 rgba = textureCube(tex, uvw);
                rgba.rgb = gammaCorrectInput(rgba.rgb);
                return rgba;
            }

            vec4 textureCubeSRGB(samplerCube tex, vec3 uvw, float lod) {
                vec4 rgba = textureCube(tex, uvw, lod);
                rgba.rgb = gammaCorrectInput(rgba.rgb);
                return rgba;
            }
        `,
    },
};
export const colorNoGamma = {
    fragment: {
        header: `
            // gamma is disabled!
            vec4 texture2DSRGB(sampler2D tex, vec2 uv) {
                return texture2D(tex, uv);
            }
            
            // gamma is disabled!
            vec4 textureCubeSRGB(samplerCube tex, vec3 uvw) {
                return textureCube(tex, uvw);
            }

            vec3 gammaCorrectOutput(vec3 color) {
                return color;
            }
        `,
    },
};
