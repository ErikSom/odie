
attribute vec3 position;
attribute vec3 color;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

varying vec3 uColor;

void main() {
    gl_PointSize = 10.;
    uColor = color;
    gl_Position = projection * view * model * vec4(position, 1.);
}
