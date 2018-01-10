import Vector2f from "./Vector2f";
import Quaternion from "./Quaternion";

export default class Vector3f {
    private m_x: number;
    private m_y: number;
    private m_z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.m_x = x;
        this.m_y = y;
        this.m_z = z;
    }

    public length(): number {
        return Math.sqrt(this.m_x * this.m_x + this.m_y * this.m_y + this.m_z * this.m_z);
    }

    public max(): number {
        return Math.max(this.m_x, Math.max(this.m_y, this.m_z));
    }

    public dot(r: Vector3f): number {
        return this.m_x * r.getX() + this.m_y * r.getY() + this.m_z * r.getZ();
    }

    public cross(r: Vector3f): Vector3f {
        const x_ = this.m_y * r.getZ() - this.m_z * r.getY();
        const y_ = this.m_z * r.getX() - this.m_x * r.getZ();
        const z_ = this.m_x * r.getY() - this.m_y * r.getX();

        return new Vector3f(x_, y_, z_);
    }

    public normalized(): Vector3f {

        const length: number = this.length();

        return new Vector3f(this.m_x / length, this.m_y / length, this.m_z / length);
    }

    public rotateAngle(axis: Vector3f, angle: number): Vector3f {
        const sinAngle: number = Math.sin(-angle);
        const cosAngle: number = Math.cos(-angle);

        return this.cross(axis.mulNum(sinAngle)).addVec(           //Rotation on local X
            (this.mulNum(cosAngle)).addVec(                     //Rotation on local Z
                axis.mulNum(this.dot(axis.mulNum(1 - cosAngle))))); //Rotation on local Y
    }

    public rotateQuat(rotation: Quaternion): Vector3f {
        const conjugate: Quaternion = rotation.conjugate();

        const w: Quaternion = rotation.mulVec(this).mulQuat(conjugate);

        return new Vector3f(w.getX(), w.getY(), w.getZ());
    }

    public lerp(dest: Vector3f, lerpFactor: number): Vector3f {
        return dest.subVec(this).mulNum(lerpFactor).addVec(this);
    }

    public addVec(r: Vector3f): Vector3f {
        return new Vector3f(this.m_x + r.getX(), this.m_y + r.getY(), this.m_z + r.getZ());
    }

    public  addNum( r:number):Vector3f {
        return new Vector3f(this.m_x + r, this.m_y + r, this.m_z + r);
    }
	
	public  subVec( r:Vector3f):Vector3f {
        return new Vector3f(this.m_x - r.getX(), this.m_y - r.getY(), this.m_z - r.getZ());
    }
	
	public  subNum( r:number):Vector3f
{
    return new Vector3f(this.m_x - r, this.m_y - r, this.m_z - r);
}
	
	public  mulVec( r:Vector3f):Vector3f {
        return new Vector3f(this.m_x * r.getX(), this.m_y * r.getY(), this.m_z * r.getZ());
    }
	
	public  mulNum( r:number):Vector3f {
        return new Vector3f(this.m_x * r, this.m_y * r, this.m_z * r);
    }
	
	public  divVec( r:Vector3f):Vector3f {
        return new Vector3f(this.m_x / r.getX(), this.m_y / r.getY(), this.m_z / r.getZ());
    }
	
	public  divNum( r:number):Vector3f {
        return new Vector3f(this.m_x / r, this.m_y / r, this.m_z / r);
    }
	
	public  abs():Vector3f {
        return new Vector3f(Math.abs(this.m_x), Math.abs(this.m_y), Math.abs(this.m_z));
    }
	
	public  toString():String {
        return "(" + this.m_x + " " + this.m_y + " " + this.m_z + ")";
    }

	public getXY(): Vector2f { return new Vector2f(this.m_x, this.m_y); }
	public getYZ(): Vector2f { return new Vector2f(this.m_y, this.m_z); }
	public getZX(): Vector2f { return new Vector2f(this.m_z, this.m_x); }

	public getYX(): Vector2f { return new Vector2f(this.m_y, this.m_x); }
	public getZY(): Vector2f { return new Vector2f(this.m_z, this.m_y); }
	public getXZ(): Vector2f { return new Vector2f(this.m_x, this.m_z); }

	public  setNum( x:number,  y:number,  z:number):Vector3f { this.m_x = x; this.m_y = y; this.m_z = z; return this; }
	public  setVec( r:Vector3f):Vector3f { this.setNum(r.getX(), r.getY(), r.getZ()); return this; }

	public getX(): number {
        return this.m_x;
    }

	public SetX(x: number): void {
        this.m_x = x;
    }

	public getY(): number{
        return this.m_y;
    }

	public SetY( y: number): void {
        this.m_y = y;
    }

	public getZ(): number {
        return this.m_z;
    }

	public SetZ( z: number): void {
        this.m_z = z;
    }

	public  equals( r:Vector3f):boolean {
        return this.m_x == r.getX() && this.m_y == r.getY() && this.m_z == r.getZ();
    }
}