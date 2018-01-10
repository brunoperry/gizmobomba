import Vector3f from "../math/Vector3f";
import Vector2f from "../math/Vector2f";

export default class Vertex {

    public static SIZE: number = 11;

    private m_pos: Vector3f;
    private m_texCoord: Vector2f;
    private m_normal: Vector3f;
    private m_tangent: Vector3f;

    constructor(pos: Vector3f = new Vector3f()) {

        this.initP(pos);

    }
    public initP(pos: Vector3f): Vertex {

        return this.initPT(pos, new Vector2f(0, 0));
    }
    public initPT(pos: Vector3f, texCoord: Vector2f): Vertex {
        return this.initPTN(pos, texCoord, new Vector3f(0, 0, 0));
    }

    public initPTN(pos: Vector3f, texCoord: Vector2f, normal: Vector3f): Vertex {
        return this.initPTNT(pos, texCoord, normal, new Vector3f(0, 0, 0));
    }

    public initPTNT(pos: Vector3f, texCoord: Vector2f, normal: Vector3f, tangent: Vector3f): Vertex {
        this.m_pos = pos;
        this.m_texCoord = texCoord;
        this.m_normal = normal;
        this.m_tangent = tangent;

        return this;
    }

    public getTangent(): Vector3f {
        return this.m_tangent;
    }

    public setTangent(tangent: Vector3f): void {
        this.m_tangent = tangent;
    }

    public getPos(): Vector3f {
        return this.m_pos;
    }

    public setPos(pos: Vector3f): void {
        this.m_pos = pos;
    }

    public getTexCoord(): Vector2f {
        return this.m_texCoord;
    }

    public setTexCoord(texCoord: Vector2f): void {
        this.m_texCoord = texCoord;
    }

    public getNormal(): Vector3f {
        return this.m_normal;
    }

    public setNormal(normal: Vector3f): void {
        this.m_normal = normal;
    }
}