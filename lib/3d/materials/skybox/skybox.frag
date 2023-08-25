precision highp float;
varying vec3 vVertex;
uniform samplerCube cubeTexture;
void main() {
    gl_FragColor = textureCube(cubeTexture, vVertex);
}