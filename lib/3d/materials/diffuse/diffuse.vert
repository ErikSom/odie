
attribute vec3 aPosition;
    
uniform mat4 uProjectionViewMatrix;

void main() {

    mat4 modelMatrix;
    vec4 worldPosition = vec4(aPosition, 1.0);

    // sets the properties above and then   
    // transform them above locally
    {{TRANSFORM}}
    
    worldPosition = modelMatrix * worldPosition;
     
    // add any plugins to do shader fun
    {{MAIN}}

    gl_Position = uProjectionViewMatrix * worldPosition; 
    
    /// add and final tweaks you want
    {{END}}
}
