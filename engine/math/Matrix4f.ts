import Util from "../core/Util";
import Vector3f from "./Vector3f";

export default class Matrix4f {

	private m: Array<Array<number>>;

	constructor() {
		this.m = new Array<Array<number>>();
		for(let i: number = 0; i < 4; i++) {
			this.m.push(new Array<number>(4));
		}
	}

	public initIdentity(): Matrix4f {

		this.m[0][0] = 1; this.m[0][1] = 0; this.m[0][2] = 0; this.m[0][3] = 0;
		this.m[1][0] = 0; this.m[1][1] = 1; this.m[1][2] = 0; this.m[1][3] = 0;
		this.m[2][0] = 0; this.m[2][1] = 0; this.m[2][2] = 1; this.m[2][3] = 0;
		this.m[3][0] = 0; this.m[3][1] = 0; this.m[3][2] = 0; this.m[3][3] = 1;

		return this;
	}

	public initTranslation(x: number, y: number, z: number): Matrix4f {
		this.m[0][0] = 1; this.m[0][1] = 0; this.m[0][2] = 0; this.m[0][3] = x;
		this.m[1][0] = 0; this.m[1][1] = 1; this.m[1][2] = 0; this.m[1][3] = y;
		this.m[2][0] = 0; this.m[2][1] = 0; this.m[2][2] = 1; this.m[2][3] = z;
		this.m[3][0] = 0; this.m[3][1] = 0; this.m[3][2] = 0; this.m[3][3] = 1;

		return this;
	}

	public initRotation(x: number, y: number, z: number): Matrix4f {
		const rx: Matrix4f = new Matrix4f();
		const ry: Matrix4f = new Matrix4f();
		const rz: Matrix4f = new Matrix4f();

		x = Util.toRadians(x);
		y = Util.toRadians(y);
		z = Util.toRadians(z);

		rz.m[0][0] = Math.cos(z); rz.m[0][1] = -Math.sin(z); rz.m[0][2] = 0; rz.m[0][3] = 0;
		rz.m[1][0] = Math.sin(z); rz.m[1][1] = Math.cos(z); rz.m[1][2] = 0; rz.m[1][3] = 0;
		rz.m[2][0] = 0; rz.m[2][1] = 0; rz.m[2][2] = 1; rz.m[2][3] = 0;
		rz.m[3][0] = 0; rz.m[3][1] = 0; rz.m[3][2] = 0; rz.m[3][3] = 1;

		rx.m[0][0] = 1; rx.m[0][1] = 0; rx.m[0][2] = 0; rx.m[0][3] = 0;
		rx.m[1][0] = 0; rx.m[1][1] = Math.cos(x); rx.m[1][2] = -Math.sin(x); rx.m[1][3] = 0;
		rx.m[2][0] = 0; rx.m[2][1] = Math.sin(x); rx.m[2][2] = Math.cos(x); rx.m[2][3] = 0;
		rx.m[3][0] = 0; rx.m[3][1] = 0; rx.m[3][2] = 0; rx.m[3][3] = 1;

		ry.m[0][0] = Math.cos(y); ry.m[0][1] = 0; ry.m[0][2] = -Math.sin(y); ry.m[0][3] = 0;
		ry.m[1][0] = 0; ry.m[1][1] = 1; ry.m[1][2] = 0; ry.m[1][3] = 0;
		ry.m[2][0] = Math.sin(y); ry.m[2][1] = 0; ry.m[2][2] = Math.cos(y); ry.m[2][3] = 0;
		ry.m[3][0] = 0; ry.m[3][1] = 0; ry.m[3][2] = 0; ry.m[3][3] = 1;

		this.m = rz.mul(ry.mul(rx)).getM();

		return this;
	}

	public initScale(x: number, y: number, z: number): Matrix4f {
		this.m[0][0] = x; this.m[0][1] = 0; this.m[0][2] = 0; this.m[0][3] = 0;
		this.m[1][0] = 0; this.m[1][1] = y; this.m[1][2] = 0; this.m[1][3] = 0;
		this.m[2][0] = 0; this.m[2][1] = 0; this.m[2][2] = z; this.m[2][3] = 0;
		this.m[3][0] = 0; this.m[3][1] = 0; this.m[3][2] = 0; this.m[3][3] = 1;

		return this;
	}

	public initPerspective(fov: number, aspectRatio: number, zNear: number, zFar: number): Matrix4f {
		const tanHalfFOV: number = Math.tan(fov / 2);
		const zRange: number = zNear - zFar;

		this.m[0][0] = 1.0 / (tanHalfFOV * aspectRatio); this.m[0][1] = 0; this.m[0][2] = 0; this.m[0][3] = 0;
		this.m[1][0] = 0; this.m[1][1] = 1.0 / tanHalfFOV; this.m[1][2] = 0; this.m[1][3] = 0;
		this.m[2][0] = 0; this.m[2][1] = 0; this.m[2][2] = (-zNear - zFar) / zRange; this.m[2][3] = 2 * zFar * zNear / zRange;
		this.m[3][0] = 0; this.m[3][1] = 0; this.m[3][2] = 1; this.m[3][3] = 0;

		return this;
	}

	public initOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4f {
		const width: number = right - left;
		const height: number = top - bottom;
		const depth: number = far - near;

		this.m[0][0] = 2 / width; this.m[0][1] = 0; this.m[0][2] = 0; this.m[0][3] = -(right + left) / width;
		this.m[1][0] = 0; this.m[1][1] = 2 / height; this.m[1][2] = 0; this.m[1][3] = -(top + bottom) / height;
		this.m[2][0] = 0; this.m[2][1] = 0; this.m[2][2] = -2 / depth; this.m[2][3] = -(far + near) / depth;
		this.m[3][0] = 0; this.m[3][1] = 0; this.m[3][2] = 0; this.m[3][3] = 1;

		return this;
	}

	public initRotationFU(forward: Vector3f, up: Vector3f): Matrix4f {
		const f: Vector3f = forward.normalized();

		let r: Vector3f = up.normalized();
		r = r.cross(f);

		const u: Vector3f = f.cross(r);

		return this.initRotationFUR(f, u, r);
	}

	public initRotationFUR(forward: Vector3f, up: Vector3f, right: Vector3f): Matrix4f {
		const f: Vector3f = forward;
		const r: Vector3f = right;
		const u: Vector3f = up;

		this.m[0][0] = r.getX(); this.m[0][1] = r.getY(); this.m[0][2] = r.getZ(); this.m[0][3] = 0;
		this.m[1][0] = u.getX(); this.m[1][1] = u.getY(); this.m[1][2] = u.getZ(); this.m[1][3] = 0;
		this.m[2][0] = f.getX(); this.m[2][1] = f.getY(); this.m[2][2] = f.getZ(); this.m[2][3] = 0;
		this.m[3][0] = 0; this.m[3][1] = 0; this.m[3][2] = 0; this.m[3][3] = 1;

		return this;
	}

	public transform(r: Vector3f): Vector3f {
		return new Vector3f(this.m[0][0] * r.getX() + this.m[0][1] * r.getY() + this.m[0][2] * r.getZ() + this.m[0][3],
			this.m[1][0] * r.getX() + this.m[1][1] * r.getY() + this.m[1][2] * r.getZ() + this.m[1][3],
			this.m[2][0] * r.getX() + this.m[2][1] * r.getY() + this.m[2][2] * r.getZ() + this.m[2][3]);
	}

	public mul(r: Matrix4f): Matrix4f {
		const res: Matrix4f = new Matrix4f();

		for (let i: number = 0; i < 4; i++) {
			for (let j: number = 0; j < 4; j++) {
				res.set(i, j, this.m[i][0] * r.get(0, j) +
					this.m[i][1] * r.get(1, j) +
					this.m[i][2] * r.get(2, j) +
					this.m[i][3] * r.get(3, j));
			}
		}

		return res;
	}

	public getM(): number[][] {
		const res: number[][] = [][4];

		for (let i: number = 0; i < 4; i++)
			for (let j: number = 0; j < 4; j++)
				res[i][j] = this.m[i][j];

		return res;
	}

	public get(x: number, y: number): number {
		return this.m[x][y];
	}

	public setM(m: number[][]): void {
		this.m = m;
	}

	public set(x: number, y: number, value: number): void {
		this.m[x][y] = value;
	}
}