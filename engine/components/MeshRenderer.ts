import GameComponent from "./GameComponent";
import Mesh from "../rendering/Mesh";
import Material from "../rendering/Material";
import { RenderMode } from "../core/Display";
import RenderingEngine from "../rendering/RenderingEngine";
import Shader from "../rendering/Shader";

export default class MeshRenderer extends GameComponent {
    private m_mesh: Mesh;
    private m_shader: Shader;
    private m_material: Material;

    constructor(mesh: Mesh, material: Material, shader: Shader) {
        super();
        this.m_mesh = mesh;
        this.m_material = material;
        this.m_shader = shader;
    }

    public setShader(shader: Shader):void {
        this.m_shader = shader;
    }

    // @Override
    public render(renderingEngine: RenderingEngine): void {

        super.render(renderingEngine);
        this.m_shader.bind();
        this.m_shader.updateUniforms(this.getTransform(), this.m_material, renderingEngine);
        this.m_mesh.draw();
    }
}