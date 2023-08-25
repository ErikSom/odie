
varying float vDepth;

void main()
{
    vec2 uv;
    float alphaColor = 1.;

    {{MATERIAL}}

    {{MAIN}}

    {{END}}
    
    gl_FragColor = vec4(vDepth, 1., 1., 1.);
}
