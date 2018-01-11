import Display from "../Display";

export default class ShaderResource {
    private m_program: WebGLProgram | null;
    private m_uniforms: Map<string, number>;
    private m_uniformNames: Array<string>;
    private m_uniformTypes: Array<string>;
    private m_refCount: number;

    constructor() {
        this.m_program = Display.gl.createProgram();
        this.m_refCount = 1;

        if (this.m_program == 0) {
            throw new Error("Shader creation failed: Could not find valid memory location in constructor")
        }

        this.m_uniforms = new Map<string, number>();
        this.m_uniformNames = new Array<string>();
        this.m_uniformTypes = new Array<string>();
    }

    // @Override
    protected finalize(): void {
        // glDeleteBuffers(m_program);
    }

    public addReference(): void {
        this.m_refCount++;
    }

    public removeReference(): boolean {
        this.m_refCount--;
        return this.m_refCount == 0;
    }

    public getProgram(): WebGLProgram | null { return this.m_program; }
    public getUniforms(): Map<string, any> { return this.m_uniforms; }
    public getUniformNames(): Array<string> { return this.m_uniformNames; }
    public getUniformTypes(): Array<string> { return this.m_uniformTypes; }
}