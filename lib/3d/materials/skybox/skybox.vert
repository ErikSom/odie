precision mediump float;
// basic.vert 
precision highp float;
attribute vec3 aPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

varying vec3 vVertex;

void main() {

    mat4 modView = uViewMatrix;

    modView[3][0] = 0.;
    modView[3][1] = 0.;
    modView[3][2] = 0.;

     gl_Position = uProjectionMatrix * modView * vec4( aPosition.xyz, 1.0);
    vVertex = aPosition;
}