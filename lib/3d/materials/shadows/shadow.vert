


attribute vec3 aPosition;

uniform mat4 uShadowProjectionView;
varying float vDepth;

void main() {

    vec4 worldPosition = vec4(aPosition, 1.0);
    mat4 modelMatrix;

    {{TRANSFORM}}

    {{MAIN}}

    gl_Position = uShadowProjectionView * uModelMatrix * worldPosition;
    
    vDepth = ((gl_Position.z/gl_Position.w)  * 0.5 + 0.5);

    {{END}}
}
