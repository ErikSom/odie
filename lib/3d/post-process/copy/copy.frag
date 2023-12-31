varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uAlpha;

void main() {
	gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}