import MappedValues from "../core/resourceManagment/MappedValues";
import Texture from "./Texture";
import Shader from "./Shader";
import Vector3f from "../math/Vector3f";

export default class Material {

    private m_texture: Texture;
    private m_shader: Shader;
    private m_color:Vector3f = new Vector3f(1,1,1);

    constructor(texture: Texture = new Texture("UV_Grid.jpg"), shader: Shader = new Shader("basic")) {

        this.m_texture = texture;
        this.m_shader = shader;
    }

    public getTexture(): Texture {
        return this.m_texture;
    }
    public getShader(): Shader {
        return this.m_shader;
    }
    public getColor(): Vector3f {
        return this.m_color;
    }
}