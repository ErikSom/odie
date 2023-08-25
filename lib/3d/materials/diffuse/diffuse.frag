

void main() {

    vec2 uv;

    float alphaColor = 1.;
    vec4 diffuseColor = vec4(1.);
    vec4 finalColor;
    
    {{MATERIAL}}

    {{MAIN}}
    
    finalColor.rgb = diffuseColor.rgb; 
    finalColor.a = 1.;

    finalColor *= alphaColor;

    {{END}}

    gl_FragColor = finalColor;
}