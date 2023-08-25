varying vec2 vUV;

uniform sampler2D uMap;
uniform float uOpacity;

void main()
{
    gl_FragColor = texture2D(uMap, vUV) * uOpacity;
}