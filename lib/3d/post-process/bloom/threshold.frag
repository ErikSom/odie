varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uThreshold;

uniform vec3 uDefaultColor;
uniform float uDefaultOpacity;
uniform float uLuminosityThreshold;
uniform float uSmoothWidth;

void main() 
{
	vec4 texel = texture2D(uSampler, vTextureCoord);
	vec3 luma = vec3( 0.299, 0.587, 0.114 );
	float v = dot( texel.xyz, luma );
	vec4 outputColor = vec4( uDefaultColor.rgb, uDefaultOpacity );
	float alpha = smoothstep( uLuminosityThreshold, uLuminosityThreshold + uSmoothWidth, v );

	gl_FragColor = mix( outputColor, texel, alpha );
	gl_FragColor.rgb *= gl_FragColor.a;
}