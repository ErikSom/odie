varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uDelta;

float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

void main() {

	vec4 color=vec4(0.0);
	float total=0.0;
	float offset=random(vec3(12.9898,78.233,151.7182),0.0);
	for(float t=-30.0;t<=30.0;t++){
		float percent=(t+offset-0.5)/30.0;
		float weight=1.0-abs(percent);
		vec4 sample=texture2D(uSampler,vTextureCoord+uDelta*percent);
		sample.rgb*=sample.a;
		color+=sample*weight;
		total+=weight;
	}
	
	gl_FragColor=color/total;
	gl_FragColor.rgb/=gl_FragColor.a+0.00001;
	
}