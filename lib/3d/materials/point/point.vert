
attribute vec3 position;
attribute vec3 normals;

uniform mat4 model;
uniform sampler2D uDataSampler;

uniform float size;

uniform mat4 projectionView;

void main() {
    gl_PointSize = size;
    gl_Position = projectionView * model * vec4(position, 1.);
}
