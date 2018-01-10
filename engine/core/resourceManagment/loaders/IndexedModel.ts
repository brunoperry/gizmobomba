import Vector3f from "../../../math/Vector3f";
import Vector2f from "../../../math/Vector2f";

export default class IndexedModel {
    
    private m_positions: Array<Vector3f>;
    private m_texCoords: Array<Vector2f>;
    private m_normals: Array<Vector3f>;
    private m_tangents: Array<Vector3f>;
    private m_indices: Array<number>;

    constructor() {
        this.m_positions = new Array<Vector3f>();
        this.m_texCoords = new Array<Vector2f>();
        this.m_normals = new Array<Vector3f>();
        this.m_tangents = new Array<Vector3f>();
        this.m_indices = new Array<number>();
    }

    public calcNormals(): void {
        for (let i: number = 0; i < this.m_indices.length; i += 3) {
            const i0: number = this.m_indices[i];
            const i1: number = this.m_indices[i + 1];
            const i2: number = this.m_indices[i + 2];

            const v1: Vector3f = this.m_positions[i1].subVec(this.m_positions[i0]);
            const v2: Vector3f = this.m_positions[i2].subVec(this.m_positions[i0]);

            const normal: Vector3f = v1.cross(v2).normalized();

            this.m_normals[i0].setVec(this.m_normals[i0].addVec(normal));
            this.m_normals[i1].setVec(this.m_normals[i1].addVec(normal));
            this.m_normals[i2].setVec(this.m_normals[i2].addVec(normal));
        }

        for (let i: number = 0; i < this.m_normals.length; i++)
            this.m_normals[i].setVec(this.m_normals[i].normalized());
    }

    public calcTangents(): void {
        for (let i: number = 0; i < this.m_indices.length; i += 3) {
            const i0: number = this.m_indices[i];
            const i1: number = this.m_indices[i + 1];
            const i2: number = this.m_indices[i + 2];

            const edge1: Vector3f = this.m_positions[i1].subVec(this.m_positions[i0]);
            const edge2: Vector3f = this.m_positions[i2].subVec(this.m_positions[i0]);

            const deltaU1: number = this.m_texCoords[i1].getX() - this.m_texCoords[i0].getX();
            const deltaV1: number = this.m_texCoords[i1].getY() - this.m_texCoords[i0].getY();
            const deltaU2: number = this.m_texCoords[i2].getX() - this.m_texCoords[i0].getX();
            const deltaV2: number = this.m_texCoords[i2].getY() - this.m_texCoords[i0].getY();

            const dividend: number = (deltaU1 * deltaV2 - deltaU2 * deltaV1);
            //TODO: The first 0.0f may need to be changed to 1.0f here.
            const f: number = dividend == 0 ? 0.0 : 1.0 / dividend;

            const tangent: Vector3f = new Vector3f(0, 0, 0);
            tangent.SetX(f * (deltaV2 * edge1.getX() - deltaV1 * edge2.getX()));
            tangent.SetY(f * (deltaV2 * edge1.getY() - deltaV1 * edge2.getY()));
            tangent.SetZ(f * (deltaV2 * edge1.getZ() - deltaV1 * edge2.getZ()));

            this.m_tangents[i0].setVec(this.m_tangents[i0].addVec(tangent));
            this.m_tangents[i1].setVec(this.m_tangents[i1].addVec(tangent));
            this.m_tangents[i2].setVec(this.m_tangents[i2].addVec(tangent));
        }

        for (let i: number = 0; i < this.m_tangents.length; i++)
            this.m_tangents[i].setVec(this.m_tangents[i].normalized());
    }

    public addPosition(pos:Vector3f): void { this.m_positions.push(pos); }
    public addTexCoords(texCoord: Vector2f): void { this.m_texCoords.push(texCoord); }
    public addNormals(normal: Vector3f): void { this.m_normals.push(normal); }
    public addTangents(tan: Vector3f): void { this.m_tangents.push(tan); }
    public addIndices(index: number): void { this.m_indices.push(index); }

    public getPositions(): Array<Vector3f> { return this.m_positions; }
    public getTexCoords(): Array<Vector2f> { return this.m_texCoords; }
    public getNormals(): Array<Vector3f> { return this.m_normals; }
    public getTangents(): Array<Vector3f> { return this.m_tangents; }
    public getIndices(): Array<number> { return this.m_indices; }
}