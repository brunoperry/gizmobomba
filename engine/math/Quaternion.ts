import Vector3f from "./Vector3f";
import Matrix4f from "./Matrix4f";

export default class Quaternion {

    private m_x: number;
    private m_y: number;
    private m_z: number;
    private m_w: number;

    constructor() {

    }

    public initNum(x:number, y:number, z:number, w:number): Quaternion {
        
        this.m_x = x;
        this.m_y = y;
        this.m_z = z;
        this.m_w = w;

        return this;
    }

    public initVecAngle(axis:Vector3f, angle:number): Quaternion {

        const sinHalfAngle:number = Math.sin(angle / 2);
        const cosHalfAngle:number = Math.cos(angle / 2);

        this.m_x = axis.getX() * sinHalfAngle;
        this.m_y = axis.getY() * sinHalfAngle;
        this.m_z = axis.getZ() * sinHalfAngle;
        this.m_w = cosHalfAngle;

        return this;
    }

    // public Quaternion(Vector3f axis, float angle)
    // {
    // 	float sinHalfAngle = (float)Math.sin(angle / 2);
    // 	float cosHalfAngle = (float)Math.cos(angle / 2);

    // 	this.m_x = axis.getX() * sinHalfAngle;
    // 	this.m_y = axis.getY() * sinHalfAngle;
    // 	this.m_z = axis.getZ() * sinHalfAngle;
    // 	this.m_w = cosHalfAngle;
    // }

    public length(): number {
        return Math.sqrt(this.m_x * this.m_x + this.m_y * this.m_y + this.m_z * this.m_z + this.m_w * this.m_w);
    }

    public normalized(): Quaternion {
        const length: number = this.length();

        return new Quaternion().initNum(this.m_x / length, this.m_y / length, this.m_z / length, this.m_w / length);
    }

    public conjugate(): Quaternion {
        return new Quaternion().initNum(-this.m_x, -this.m_y, -this.m_z, this.m_w);
    }

    public mulNum(r: number): Quaternion {
        return new Quaternion().initNum(this.m_x * r, this.m_y * r, this.m_z * r, this.m_w * r);
    }

    public mulQuat(r: Quaternion): Quaternion {

        const w_ = this.m_w * r.getW() - this.m_x * r.getX() - this.m_y * r.getY() - this.m_z * r.getZ();
        const x_ = this.m_x * r.getW() + this.m_w * r.getX() + this.m_y * r.getZ() - this.m_z * r.getY();
        const y_ = this.m_y * r.getW() + this.m_w * r.getY() + this.m_z * r.getX() - this.m_x * r.getZ();
        const z_ = this.m_z * r.getW() + this.m_w * r.getZ() + this.m_x * r.getY() - this.m_y * r.getX();

        return new Quaternion().initNum(x_, y_, z_, w_);
    }

    public mulVec(r: Vector3f): Quaternion {
        const w_ = -this.m_x * r.getX() - this.m_y * r.getY() - this.m_z * r.getZ();
        const x_ = this.m_w * r.getX() + this.m_y * r.getZ() - this.m_z * r.getY();
        const y_ = this.m_w * r.getY() + this.m_z * r.getX() - this.m_x * r.getZ();
        const z_ = this.m_w * r.getZ() + this.m_x * r.getY() - this.m_y * r.getX();

        return new Quaternion().initNum(x_, y_, z_, w_);
    }

    public  subQuat( r:Quaternion):Quaternion {
        return new Quaternion().initNum(this.m_x - r.getX(), this.m_y - r.getY(), this.m_z - r.getZ(), this.m_w - r.getW());
    }

	public  addQuat( r:Quaternion):Quaternion {
        return new Quaternion().initNum(this.m_x + r.getX(), this.m_y + r.getY(), this.m_z + r.getZ(), this.m_w + r.getW());
    }

	public  toRotationMatrix():Matrix4f {
        const forward:Vector3f = new Vector3f(2.0 * (this.m_x * this.m_z - this.m_w * this.m_y), 2.0 * (this.m_y * this.m_z + this.m_w * this.m_x), 1.0 - 2.0 * (this.m_x * this.m_x + this.m_y * this.m_y));
        const up:Vector3f = new Vector3f(2.0 * (this.m_x * this.m_y + this.m_w * this.m_z), 1.0 - 2.0 * (this.m_x * this.m_x + this.m_z * this.m_z), 2.0 * (this.m_y * this.m_z - this.m_w * this.m_x));
        const right:Vector3f = new Vector3f(1.0 - 2.0 * (this.m_y * this.m_y + this.m_z * this.m_z), 2.0 * (this.m_x * this.m_y - this.m_w * this.m_z), 2.0 * (this.m_x * this.m_z + this.m_w * this.m_y));

        return new Matrix4f().initRotationFUR(forward, up, right);
    }

	public dot( r:Quaternion):number {
        return this.m_x * r.getX() + this.m_y * r.getY() + this.m_z * r.getZ() + this.m_w * r.getW();
    }

	public  NLerp( dest:Quaternion,  lerpFactor:number,  shortest:boolean):Quaternion {
        let correctedDest:Quaternion = dest;

        if (shortest && this.dot(dest) < 0)
            correctedDest = new Quaternion().initNum(-dest.getX(), -dest.getY(), -dest.getZ(), -dest.getW());

        return correctedDest.subQuat(this).mulNum(lerpFactor).addQuat(this).normalized();
    }

	public  SLerp( dest:Quaternion,  lerpFactor:number,  shortest:boolean):Quaternion {
        const EPSILON:number = 1e3;

        let cos:number = this.dot(dest);
        let correctedDest:Quaternion = dest;

        if (shortest && cos < 0) {
            cos = -cos;
            correctedDest = new Quaternion().initNum(-dest.getX(), -dest.getY(), -dest.getZ(), -dest.getW());
        }


        if(Math.abs(cos) >= 1 - EPSILON) {
            return this.NLerp(correctedDest, lerpFactor, false);
        }
            

        const sin:number = Math.sqrt(1.0 - cos * cos);
        const angle = Math.atan2(sin, cos);
        const invSin = 1.0 / sin;

        const srcFactor = Math.sin((1.0 - lerpFactor) * angle) * invSin;
        const destFactor = Math.sin((lerpFactor) * angle) * invSin;

        return this.mulNum(srcFactor).addQuat(correctedDest.mulNum(destFactor));
    }

	//From Ken Shoemake's "Quaternion Calculus and Fast Animation" article
	public initMat( rot:Matrix4f):Quaternion
    {
        const trace:number = rot.get(0, 0) + rot.get(1, 1) + rot.get(2, 2);

        if (trace > 0) {
            const s:number = 0.5 / Math.sqrt(trace + 1.0);
            this.m_w = 0.25 / s;
            this.m_x = (rot.get(1, 2) - rot.get(2, 1)) * s;
            this.m_y = (rot.get(2, 0) - rot.get(0, 2)) * s;
            this.m_z = (rot.get(0, 1) - rot.get(1, 0)) * s;
        }
        else {
            if (rot.get(0, 0) > rot.get(1, 1) && rot.get(0, 0) > rot.get(2, 2)) {
                const s:number = 2.0 * Math.sqrt(1.0 + rot.get(0, 0) - rot.get(1, 1) - rot.get(2, 2));
                this.m_w = (rot.get(1, 2) - rot.get(2, 1)) / s;
                this.m_x = 0.25 * s;
                this.m_y = (rot.get(1, 0) + rot.get(0, 1)) / s;
                this.m_z = (rot.get(2, 0) + rot.get(0, 2)) / s;
            }
            else if (rot.get(1, 1) > rot.get(2, 2)) {
                const s:number = 2.0 * Math.sqrt(1.0 + rot.get(1, 1) - rot.get(0, 0) - rot.get(2, 2));
                this. m_w = (rot.get(2, 0) - rot.get(0, 2)) / s;
                this.m_x = (rot.get(1, 0) + rot.get(0, 1)) / s;
                this.m_y = 0.25 * s;
                this.m_z = (rot.get(2, 1) + rot.get(1, 2)) / s;
            }
            else {
                const s:number = 2.0 * Math.sqrt(1.0 + rot.get(2, 2) - rot.get(0, 0) - rot.get(1, 1));
                this.m_w = (rot.get(0, 1) - rot.get(1, 0)) / s;
                this.m_x = (rot.get(2, 0) + rot.get(0, 2)) / s;
                this.m_y = (rot.get(1, 2) + rot.get(2, 1)) / s;
                this.m_z = 0.25 * s;
            }
        }

        const length:number = Math.sqrt(this.m_x * this.m_x + this.m_y * this.m_y + this.m_z * this.m_z + this.m_w * this.m_w);
        this.m_x /= length;
        this.m_y /= length;
        this. m_z /= length;
        this. m_w /= length;

        return this;
    }

	public  getForward():Vector3f {
        return new Vector3f(0, 0, 1).rotateQuat(this);
    }

	public  getBack():Vector3f {
        return new Vector3f(0, 0, -1).rotateQuat(this);
    }

	public  getUp():Vector3f {
        return new Vector3f(0, 1, 0).rotateQuat(this);
    }

	public  getDown():Vector3f {
        return new Vector3f(0, -1, 0).rotateQuat(this);
    }

	public  getRight():Vector3f {
        return new Vector3f(1, 0, 0).rotateQuat(this);
    }

	public  getLeft():Vector3f {
        return new Vector3f(-1, 0, 0).rotateQuat(this);
    }

	public  setNum( x:number,  y:number,  z:number,  w:number):Quaternion { this.m_x = x; this.m_y = y; this.m_z = z; this.m_w = w; return this; }
	public  setQuat( r:Quaternion):Quaternion { this.setNum(r.getX(), r.getY(), r.getZ(), r.getW()); return this; }

	public  getX():number {
        return this.m_x;
    }

	public  setX( x:number):void {
        this.m_x = x;
    }

	public  getY():number
{
    return this.m_y;
}

	public  setY( m_y:number):void {
        this.m_y = m_y;
    }

	public  getZ():number {
        return this.m_z;
    }

	public  setZ( z:number):void {
        this.m_z = z;
    }

	public  getW():number  {
        return this.m_w;
    }

	public  setW( w:number):void
    {
        this.m_w = w;
    }

	public  equals( r:Quaternion):boolean {
        return this.m_x == r.getX() && this.m_y == r.getY() && this.m_z == r.getZ() && this.m_w == r.getW();
    }
}