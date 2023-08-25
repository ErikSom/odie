varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uMap;

uniform vec2 uCenter;
uniform float uStrength;
uniform vec2 uResolution;
uniform float uRadius;

float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

void main(){
	vec4 color=vec4(0.0);
	float total=0.0;
    float ratio = 1.-texture2D(uMap,vTextureCoord).r;
	vec2 toCenter=uCenter-vTextureCoord*uResolution;
	float offset=random(vec3(12.9898,78.233,151.7182),0.0);

	for(float t=0.0;t<=20.0;t++){
		float percent=(t+offset)/20.0;
		float weight=4.0*(percent-percent*percent);
		vec4 sample=texture2D(uSampler,vTextureCoord+toCenter*percent*(uStrength * ratio) /uResolution);
		sample.rgb*=sample.a;
		color+=sample*weight;
		total+=weight;
	}

	gl_FragColor= color/total;
}
