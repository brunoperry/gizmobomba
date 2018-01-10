import Util from "../core/Util";

export default class Vector2f {

	private m_x: number;
	private m_y: number;

	constructor(x: number = 0, y: number = 0) {
		this.m_x = x;
		this.m_y = y;
	}

	public length(): number {
		return Math.sqrt(this.m_x * this.m_x + this.m_y * this.m_y);
	}

	public max(): number {
		return Math.max(this.m_x, this.m_y);
	}

	public dot(r: Vector2f): number {
		return this.m_x * r.getX() + this.m_y * r.getY();
	}

	public Normalized(): Vector2f {
		const length: number = this.length();

		return new Vector2f(this.m_x / length, this.m_y / length);
	}

	public cross(r: Vector2f): number {
		return this.m_x * r.getY() - this.m_y * r.getX();
	}

	public lerp(dest: Vector2f, lerpFactor: number): Vector2f {
		return dest.subVec(this).mulNum(lerpFactor).addVec(this);
	}

	public rotate(angle: number): Vector2f {
		const rad: number = Util.toRadians(angle);
		const cos: number = Math.cos(rad);
		const sin: number = Math.sin(rad);

		return new Vector2f((this.m_x * cos - this.m_y * sin), (this.m_x * sin + this.m_y * cos));
	}

	public addVec(r: Vector2f): Vector2f {
		return new Vector2f(this.m_x + r.getX(), this.m_y + r.getY());
	}

	public addNum(r: number): Vector2f {
		return new Vector2f(this.m_x + r, this.m_y + r);
	}

	public subVec(r: Vector2f): Vector2f {
		return new Vector2f(this.m_x - r.getX(), this.m_y - r.getY());
	}

	public subNum(r: number): Vector2f {
		return new Vector2f(this.m_x - r, this.m_y - r);
	}

	public mulVec(r: Vector2f): Vector2f {
		return new Vector2f(this.m_x * r.getX(), this.m_y * r.getY());
	}

	public mulNum(r: number): Vector2f {
		return new Vector2f(this.m_x * r, this.m_y * r);
	}

	public divVec(r: Vector2f) {
		return new Vector2f(this.m_x / r.getX(), this.m_y / r.getY());
	}

	public divNum(r: number): Vector2f {
		return new Vector2f(this.m_x / r, this.m_y / r);
	}

	public abs(): Vector2f {
		return new Vector2f(Math.abs(this.m_x), Math.abs(this.m_y));
	}

	public toString(): string {
		return "(" + this.m_x + " " + this.m_y + ")";
	}

	public setNum(x: number, y: number): Vector2f { this.m_x = x; this.m_y = y; return this; }
	public setVec(r: Vector2f): Vector2f { this.setNum(r.getX(), r.getY()); return this; }

	public getX(): number {
		return this.m_x;
	}

	public setX(x: number): void {
		this.m_x = x;
	}

	public getY(): number {
		return this.m_y;
	}

	public setY(y: number): void {
		this.m_y = y;
	}

	public equals(r: Vector2f): boolean {
		return this.m_x == r.getX() && this.m_y == r.getY();
	}
}