#version 300 es
precision mediump float;
// Passed in from the vertex shader.
in vec2 texcoord0;
// in vec4 normal0;
 
// The texture.
uniform vec3 baseColor;
uniform sampler2D sampled;

out vec4 outColor;
 
void main() {

    outColor = texture(sampled, texcoord0) * vec4(baseColor, 1);
}