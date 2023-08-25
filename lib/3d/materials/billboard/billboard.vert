attribute vec3 aPosition;
attribute vec2 aUv;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uScale;
uniform vec4 uMapFrame;

varying vec2 vUV;

void main() {

	mat4 wm = uViewMatrix * uModelMatrix;

	wm[0][0] = uScale.x;
	wm[0][1] = 0.;
	wm[0][2] = 0.;

	// Column 1:
	wm[1][0] = 0.;
	wm[1][1] = -uScale.y;
	wm[1][2] = 0.;

    gl_Position = uProjectionMatrix * wm * vec4(aPosition, 1.);

    vUV = (aUv * uMapFrame.zw ) + uMapFrame.xy ;
}
