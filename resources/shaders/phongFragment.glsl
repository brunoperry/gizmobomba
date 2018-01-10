#version 300 es
precision mediump float;

in vec2 texcoord0;
in vec3 normal0;

out vec4 fragColor;

struct BaseLight {
    vec3 color;
    float intensity;
};
struct DirectionalLight {
    BaseLight base;
    vec3 direction;
};
 
uniform vec3 baseColor;
uniform vec3 ambientLight;
uniform sampler2D sampler;

uniform DirectionalLight directionalLight;

vec4 calcLight(BaseLight base, vec3 direction, vec3 normal) {

    float difuseFactor = dot(normal, -direction);

    vec4 difuseColor = vec4(0,0,0,0);

    if(difuseFactor > 0.0) {
        difuseColor = vec4(base.color, 1.0) * base.intensity * difuseFactor;
    }

    return difuseColor;
}

vec4 calDirectionalLight(DirectionalLight directionalLight, vec3 normal) {
    return calcLight(directionalLight.base, -directionalLight.direction, normal);
}
 
void main() {


    vec4 totalLight = vec4(ambientLight, 1);
    vec4 color = vec4(baseColor, 1);
    vec4 textureColor = texture(sampler, texcoord0);

    if(textureColor != vec4(0,0,0,0)) {
        color *= textureColor;
    }

    vec3 normal = normalize(normal0);

    totalLight += calDirectionalLight(directionalLight, normal);

    fragColor = color * totalLight;
}