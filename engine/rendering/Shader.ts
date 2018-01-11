import ShaderResource from "../core/resourceManagment/ShaderResource";
import Material from "./Material";
import RenderingEngine from "./RenderingEngine";
import Transform from "../core/Transform";
import Matrix4f from "../math/Matrix4f";
import Util from "../core/Util";
import Vector3f from "../math/Vector3f";
import Display from "../core/Display";
import TextFileReader from "../core/resourceManagment/loaders/TextFileReader";
import ResourcesLoader from "../core/resourceManagment/loaders/ResourcesLoader";

export default class Shader {

    private gl: WebGL2RenderingContext = Display.gl;

    private program: WebGLProgram | null;
    protected programInfo: any;
    protected uniforms: Map<string, WebGLUniformLocation>;

    constructor(fileName:string) {

        this.program = this.gl.createProgram();
        this.uniforms = new Map<string, WebGLUniformLocation>();

        if (this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error("Error memory valid location not valid!");
        }

        const vertexShaderData:string | undefined = ResourcesLoader.shadersData.get(fileName + "Vertex.glsl");
        const fragmentShaderData:string | undefined = ResourcesLoader.shadersData.get(fileName + "Fragment.glsl");

        if(!vertexShaderData || !fragmentShaderData) {
            throw new Error("No shader found: " + fileName);
        }
        this.setShaders(vertexShaderData, fragmentShaderData);
    }

    public bind(): void {
        this.gl.useProgram(this.program);
    }

    private setShaders(vertexShader: string, fragShader: string): void {

        const gl: WebGLRenderingContext = this.gl;
        this.addProgram(vertexShader, gl.VERTEX_SHADER);
        this.addProgram(fragShader, gl.FRAGMENT_SHADER);

        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw new Error("Error compile program link status");
        }

        gl.validateProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
            throw new Error("Error compile program validate status");
        }
    }

    protected addUniform(uniformName: string): void {
        this.uniforms.set(uniformName, this.gl.getUniformLocation(this.program, uniformName) as WebGLUniformLocation)
    }

    private addProgram(source: string, type: number): void {

        const gl: WebGLRenderingContext = this.gl;
        const shader: WebGLShader | null = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error("Error compiling shader program: \n" + source);
        }

        gl.attachShader(this.program, shader);
    }

    public update(transform: Transform, material: Material, renderingEngine: RenderingEngine): void {
        this.bind();
    }
    public getProgram(): WebGLProgram | null {
        return this.program;
    }
    //UNIFORMS RELATED
    public setUniformi(uniformName: string, value: number): void {
        this.gl.uniform1i(this.uniforms.get(uniformName) as WebGLUniformLocation, value);
    }
    public setUniformf(uniformName: string, value: number): void {
        this.gl.uniform1f(this.uniforms.get(uniformName) as WebGLUniformLocation, value);
    }
    public setUniformVec(uniformName: string, value: Vector3f): void {
        this.gl.uniform3f(this.uniforms.get(uniformName) as WebGLUniformLocation, value.getX(), value.getY(), value.getZ());
    }
    public setUniform(uniformName: string, value: Matrix4f): void {

        const uniformN = this.uniforms.get(uniformName) as WebGLUniformLocation;
        this.gl.uniformMatrix4fv(uniformN, false, value.getMFloatArray());
    }
}

export enum ShaderType {
    BASIC = "basic",
    PHONG = "phong",
    CUSTOM = "custom"
}



// class GLSLStruct {

//     public name: string;
//     public type: string;
// }