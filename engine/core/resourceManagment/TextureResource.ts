import Display from "../Display";

export default class TextureResource {
    private m_id: WebGLTexture | null;
    private m_refCount: number;

    constructor() {
        this.m_id = Display.gl.createTexture();
        this.m_refCount = 1;
    }

    protected finalize(): void {
        // glDeleteBuffers(this.m_id);
    }

    public addReference(): void {
        this.m_refCount++;
    }

    public removeReference(): boolean {
        this.m_refCount--;
        return this.m_refCount == 0;
    }

    public getId(): WebGLTexture | null { return this.m_id; }
}