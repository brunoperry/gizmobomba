export default class OBJIndex {
    private m_vertexIndex: number;
    private m_texCoordIndex: number;
    private m_normalIndex: number;

    public getVertexIndex(): number { return this.m_vertexIndex; }
    public getTexCoordIndex(): number { return this.m_texCoordIndex; }
    public getNormalIndex(): number { return this.m_normalIndex; }

    public setVertexIndex(val: number): void { this.m_vertexIndex = val; }
    public setTexCoordIndex(val: number): void { this.m_texCoordIndex = val; }
    public setNormalIndex(val: number): void { this.m_normalIndex = val; }

    public equals(obj: Object): boolean {
        const index: OBJIndex = obj as OBJIndex;

        return this.m_vertexIndex == index.m_vertexIndex
            && this.m_texCoordIndex == index.m_texCoordIndex
            && this.m_normalIndex == index.m_normalIndex;
    }

    public hashCode(): number {
        const BASE: number = 17;
        const MULTIPLIER: number = 31;

        let result: number = BASE;

        result = MULTIPLIER * result + this.m_vertexIndex;
        result = MULTIPLIER * result + this.m_texCoordIndex;
        result = MULTIPLIER * result + this.m_normalIndex;

        return result;
    }
}