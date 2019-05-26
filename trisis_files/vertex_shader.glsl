attribute  vec4 vPosition;
attribute  vec4 vColor;
varying vec4 fColor;

uniform mat4 projection;
uniform mat4 modelview;


void main() 
{
    fColor = vColor;
    gl_Position = projection * modelview * vPosition;
} 