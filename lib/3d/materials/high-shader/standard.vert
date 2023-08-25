
attribute vec3 aPosition;
attribute vec3 aNormal;
    
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

varying vec3 vWorldNormal;
varying vec4 vWorldPosition;

void main() {

    mat4 projectionMatrix = uProjectionMatrix;
    vec4 worldPosition = vec4(aPosition, 1.0);
    vec3 worldNormal = aNormal;
    mat4 modelMatrix;
    
    // sets the properties above and then   
    // transform them above locally
    {{TRANSFORM}}
    
    worldPosition = modelMatrix * worldPosition;
    
    vec4 worldCameraPosition = uViewMatrix * worldPosition;
    
    // add any plugins to do shader fun
    {{MAIN}}

    // add the lighting inputs
    {{LIGHTING}}
    
    vWorldPosition = worldPosition;
    vWorldNormal = normalize(worldNormal);
    gl_Position = projectionMatrix * worldCameraPosition; 
    
    /// add and final tweaks you want
    {{END}}
}
