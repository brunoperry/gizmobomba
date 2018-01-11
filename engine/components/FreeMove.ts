import GameComponent from "./GameComponent";
import Keyboard from "../input/Keyboard";
import Input from "../input/Input";
import Vector3f from "../math/Vector3f";

export default class FreeMove extends GameComponent {
    private m_speed: number;
    private m_forwardKey: number;
    private m_backKey: number;
    private m_leftKey: number;
    private m_rightKey: number;

    constructor(speed: number) {
        super();
        this.init(speed, Keyboard.W, Keyboard.S, Keyboard.A, Keyboard.D);
    }

    public init(speed: number, forwardKey: number, backKey: number, leftKey: number, rightKey: number) {
        this.m_speed = speed;
        this.m_forwardKey = forwardKey;
        this.m_backKey = backKey;
        this.m_leftKey = leftKey;
        this.m_rightKey = rightKey;
    }

    // @Override
    public input(delta: number): void {
        const movAmt: number = this.m_speed * delta;

        if (Input.getKey(this.m_forwardKey))
            this.move(this.getTransform().getRot().getForward(), movAmt);
        if (Input.getKey(this.m_backKey))
            this.move(this.getTransform().getRot().getForward(), -movAmt);
        if (Input.getKey(this.m_leftKey))
            this.move(this.getTransform().getRot().getLeft(), movAmt);
        if (Input.getKey(this.m_rightKey))
            this.move(this.getTransform().getRot().getRight(), movAmt);
    }

    private move(dir: Vector3f, amt: number): void {
        this.getTransform().setPos(this.getTransform().getPos().addVec(dir.mulNum(amt)));
    }
}