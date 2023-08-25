varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uMap;

uniform vec2 power;
uniform vec2 scale;

void main() {

     vec4 nudge = texture2D(uMap, vTextureCoord * scale);

     gl_FragColor = texture2D(uSampler, vTextureCoord + (nudge.xy * power));
}
