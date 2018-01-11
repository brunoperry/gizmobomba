#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec2 a_texcoord;

out vec2 texcoord0;
out vec4 normal0;

uniform mat4 transform;
 
void main() {
    
    texcoord0 = a_texcoord;
    gl_Position = transform * a_position;
}