
uniform vec4 uDiffuseColor;
uniform vec3 uEyePosition;

varying vec4 vWorldPosition;
varying vec3 vWorldNormal;
uniform vec3 uSpecularColor;

void main() {

    vec2 uv;
    
    vec3 worldPosition = vWorldPosition.xyz;
    vec3 eyePosition = uEyePosition;
    vec3 eyeToSurfaceDir = normalize(worldPosition - eyePosition);
    
    // key variables, idea is to override what makes these..
    vec3 worldNormal;

    float specular = 0.;
    float gloss = 0.;

    vec3 emissiveColor = vec3(0.);
    vec3 reflectionColor = vec3(1.);
    vec4 diffuseColor = uDiffuseColor;
    float alphaColor = 1.;

    // calculated by the lighting model..
    vec3 specularColor = vec3(0.);
    vec3 lightingColor = vec3(0.);
    
    
    vec4 finalColor;
    
    {{MATERIAL}}

    {{MAIN}}
    
    finalColor.rgb = (diffuseColor.rgb * lightingColor * reflectionColor) + specularColor + emissiveColor;  
    
    finalColor.a = 1.;
    finalColor *= alphaColor;

    {{END}}

    finalColor.rgb = gammaCorrectOutput(finalColor.rgb);

    gl_FragColor = finalColor;
}