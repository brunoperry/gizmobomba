import Matrix4f from "../math/Matrix4f";
import GameComponent from "./GameComponent";
import Vector3f from "../math/Vector3f";
import CoreEngine from "../core/CoreEngine";

export default class Camera3D extends GameComponent {
    private m_projection: Matrix4f;
    constructor(projection: Matrix4f) {
        super();
        this.m_projection = projection;
    }

    public getViewProjection(): Matrix4f {
        const cameraRotation: Matrix4f = this.getTransform().getTransformedRot().conjugate().toRotationMatrix();
        const cameraPos: Vector3f = this.getTransform().getTransformedPos().mulNum(-1);

        const cameraTranslation: Matrix4f = new Matrix4f().initTranslation(cameraPos.getX(), cameraPos.getY(), cameraPos.getZ());

        return this.m_projection.mul(cameraRotation.mul(cameraTranslation));
    }

    public addToEngine(engine: CoreEngine): void {
        engine.getRenderingEngine().addCamera(this);
    }
}