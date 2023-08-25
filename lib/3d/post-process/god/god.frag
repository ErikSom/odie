varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uExposure ;
uniform float uWeight;
uniform float uDecay;
uniform float uDensity;
uniform int uNumSamples;
uniform vec3 uGodColor;


vec3 godrays(
    float density,
    float weight,
    float decay,
    float exposure,
    int numSamples,
    sampler2D occlusionTexture,
    vec2 screenSpaceLightPos,
    vec2 uv
    ) {

    vec3 fragColor = vec3(0.0,0.0,0.0);
    
	vec2 deltaTextCoord = vec2( uv - screenSpaceLightPos.xy );

	vec2 textCoo = uv.xy ;
	deltaTextCoord *= (1.0 /  float(numSamples)) * density;
	float illuminationDecay = 1.0;


	for(int i=0; i < 100 ; i++){
        /*
        This makes sure that the loop only runs `numSamples` many times.
        We have to do it this way in WebGL, since you can't have a for loop
        that runs a variable number times in WebGL.
        This little hack gets around that.
        But the drawback of this is that we have to specify an upper bound to the
        number of iterations(but 100 is good enough for almost all cases.)
        */
	    if(numSamples < i) {
            break;
	    }

		textCoo -= deltaTextCoord;
		vec4 samp = texture2D(occlusionTexture, textCoo   );//.xyz;
		vec3 outty = mix(vec4(uGodColor, 1.), vec4(0.), samp.a).xyz;

      outty *= illuminationDecay * weight;
		fragColor += outty;
		illuminationDecay *= decay;
	}

	fragColor *= exposure;

    return fragColor;
}

void main(void)
{
   vec2 uScreenSpaceSunPos = vec2(0.5, 0.9);

   vec3 fragColor = godrays(
    uDensity, uWeight, uDecay, uExposure, uNumSamples, uSampler, uScreenSpaceSunPos, vTextureCoord
   );

   vec4 rays = vec4(fragColor, 1.);
   vec4 color = texture2D(uSampler, vTextureCoord);

   gl_FragColor =  (rays *3.);
}
