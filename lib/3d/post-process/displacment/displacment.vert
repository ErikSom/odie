attribute vec2 aVertexPosition;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((aVertexPosition * 2.) - 1., 0., 1.);
    vTextureCoord = aVertexPosition;
}
