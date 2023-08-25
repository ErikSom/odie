varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uMap;

uniform vec2 uCenter;
uniform float uTime;
uniform vec2 uResolution;
uniform float uRadius;

float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, // (3.0-sqrt(3.0))/6.0
    0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
    -0.577350269189626, // -1.0 + 2.0 * C.x
    0.024390243902439); // 1.0 / 41.0
    
    // First corner
    vec2 i = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    
    // Other corners
    
    vec2 i1;

    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    
    // Permutations
    
    i = mod289(i); // Avoid truncation effects in permutation
    
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    
    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
    
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    
    // Normalise gradients implicitly by scaling m
    
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    
    // Compute final noise value at P
    
    vec3 g;
    g.x = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

vec2 diffUv(vec2 offset, float power) {
   
   return vTextureCoord + ((offset / uResolution) * power);
}

vec2 pixelate(vec2 coord, vec2 size) {
    return floor( coord / size ) * size;
}

void main() {
    float power = 7.0;
    vec2 uv_r = diffUv(vec2(0, 1), power);
    vec2 uv_g =  diffUv(vec2(1, 0), power);
    vec2 uv_b =  diffUv(vec2(0, 0), power);

	
    float r = texture2D(uSampler, uv_r).r;
    float g = texture2D(uSampler, uv_g).g;
    float b = texture2D(uSampler, uv_b).b;
    vec4 split = vec4(r, g, b, 1.0);

    vec2 pixelated = pixelate(vTextureCoord, vec2(.01) );
    vec4 pixel =  texture2D(uSampler, pixelated);
        
    gl_FragColor = mix(split, pixel, 0.3);
}
