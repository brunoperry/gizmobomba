import GameComponent from "./GameComponent";
import Mesh from "../rendering/Mesh";
import Material from "../rendering/Material";
import { RenderMode } from "../core/Display";
import RenderingEngine from "../rendering/RenderingEngine";
import Shader from "../rendering/Shader";

export default class MeshRenderer extends GameComponent {
    private m_mesh: Mesh;
    private m_material: Material;

    constructor(mesh: Mesh, material:Material) {
        super();
        this.m_mesh = mesh;
        this.m_material = material;

        const program:WebGLProgram | null = this.m_material.getShader().getProgram();
        if(!program) {
            throw new Error("Error get shader program");
        }
        this.m_mesh.init(program);
    }

    // private init(): void {

    //     console.log("init2")
    // }

    // @Override
    public render(shader:Shader, renderingEngine: RenderingEngine): void {

        super.render(shader, renderingEngine);

        this.m_material.getShader().update(this.getTransform(), this.m_material, renderingEngine)

        // this.m_shader.bind();
        // this.m_shader.updateUniforms(this.getTransform(), this.m_material, renderingEngine);
        // this.m_shader.update(this.getTransform(), this.m_material, renderingEngine);
        this.m_mesh.draw();
    }
}