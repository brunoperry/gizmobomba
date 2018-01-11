import Display from "../Display";

export default class MeshResource {

    private gl:WebGLRenderingContext = Display.gl;
    private m_vbo: WebGLBuffer | null;
    private m_ibo: WebGLBuffer | null;
    private m_size: number;
    private m_refCount: number;

    private m_vao: WebGLVertexArrayObject | null;
    private m_indexCount: number = 0;

    constructor(size: number) {

        this.m_vbo = this.gl.createBuffer();
        this.m_ibo = this.gl.createBuffer();
        this.m_size = size;
        this.m_refCount = 1;
    }

    protected finalize(): void {
        this.gl.deleteBuffer(this.m_vbo);
        this.gl.deleteBuffer(this.m_ibo);
    }

    public addReference(): void {
        this.m_refCount++;
    }

    public removeReference(): boolean {
        this.m_refCount--;
        return this.m_refCount == 0;
    }

    public getVbo(): WebGLBuffer | null { return this.m_vbo; }
    public getIbo(): WebGLBuffer | null { return this.m_ibo; }
    public getSize(): number { return this.m_size; }
}