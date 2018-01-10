import Matrix4f from "../math/Matrix4f";
import Vector3f from "../math/Vector3f";
import Quaternion from "../math/Quaternion";

export default class Transform {
	private m_parent: Transform;
	private m_parentMatrix: Matrix4f;

	private m_pos: Vector3f;
	private m_rot: Quaternion;
	private m_scale: Vector3f;

	private m_oldPos: Vector3f;
	private m_oldRot: Quaternion;
	private m_oldScale: Vector3f;

	constructor() {
		this.m_pos = new Vector3f(0, 0, 0);
		this.m_rot = new Quaternion().initNum(0, 0, 0, 1);
		this.m_scale = new Vector3f(1, 1, 1);

		this.m_parentMatrix = new Matrix4f().initIdentity();
	}

	public update(): void {

		if (this.m_oldPos != null) {
			this.m_oldPos.setVec(this.m_pos);
			this.m_oldRot.setQuat(this.m_rot);
			this.m_oldScale.setVec(this.m_scale);
		}
		else {
			this.m_oldPos = new Vector3f(0, 0, 0).setVec(this.m_pos).addNum(1.0);
			this.m_oldRot = new Quaternion().initNum(0, 0, 0, 0).setQuat(this.m_rot).mulNum(0.5);
			this.m_oldScale = new Vector3f(0, 0, 0).setVec(this.m_scale).addNum(1.0);
		}
	}

	public rotate(axis: Vector3f, angle: number): void {
		this.m_rot = new Quaternion().initVecAngle(axis, angle).mulQuat(this.m_rot).normalized();
	}

	public lookAt(point: Vector3f, up: Vector3f): void {
		this.m_rot = this.getLookAtRotation(point, up);
	}

	public getLookAtRotation(point: Vector3f, up: Vector3f): Quaternion {
		return new Quaternion().initMat(new Matrix4f().initRotationFU(point.subVec(this.m_pos).normalized(), up));
	}

	public hasChanged(): boolean {
		if (this.m_parent != null && this.m_parent.hasChanged())
			return true;

		if (!this.m_pos.equals(this.m_oldPos))
			return true;

		if (!this.m_rot.equals(this.m_oldRot))
			return true;

		if (!this.m_scale.equals(this.m_oldScale))
			return true;

		return false;
	}

	public getTransformation(): Matrix4f {
		const translationMatrix: Matrix4f = new Matrix4f().initTranslation(this.m_pos.getX(), this.m_pos.getY(), this.m_pos.getZ());
		const rotationMatrix: Matrix4f = this.m_rot.toRotationMatrix();
		const scaleMatrix: Matrix4f = new Matrix4f().initScale(this.m_scale.getX(), this.m_scale.getY(), this.m_scale.getZ());

		return this.getParentMatrix().mul(translationMatrix.mul(rotationMatrix.mul(scaleMatrix)));
	}

	private getParentMatrix(): Matrix4f {
		if (this.m_parent != null && this.m_parent.hasChanged())
			this.m_parentMatrix = this.m_parent.getTransformation();

		return this.m_parentMatrix;
	}

	public setParent(parent: Transform): void {
		this.m_parent = parent;
	}

	public getTransformedPos(): Vector3f {
		return this.getParentMatrix().transform(this.m_pos);
	}

	public getTransformedRot() {
		let parentRotation: Quaternion = new Quaternion().initNum(0, 0, 0, 1);

		if (this.m_parent != null)
			parentRotation = this.m_parent.getTransformedRot();

		return parentRotation.mulQuat(this.m_rot);
	}

	public getPos(): Vector3f {
		return this.m_pos;
	}

	public setPos(pos: Vector3f): void {
		this.m_pos = pos;
	}

	public getRot(): Quaternion {
		return this.m_rot;
	}

	public setRot(rotation: Quaternion): void {
		this.m_rot = rotation;
	}

	public getScale(): Vector3f {
		return this.m_scale;
	}

	public setScale(scale: Vector3f): void {
		this.m_scale = scale;
	}
}