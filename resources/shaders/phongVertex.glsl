#version 300 es
 
in vec3 a_normal;
in vec4 a_position;
in vec2 a_texcoord;

out vec2 texcoord0;
out vec3 normal0;

uniform mat4 worldMatrix;
uniform mat4 mvp;
 
void main() {
    
    gl_Position = mvp * vec4(a_position.xyz, 1.0);

    texcoord0 = a_texcoord;

    normal0 = (worldMatrix * vec4(a_normal, 0.0)).xyz;
}