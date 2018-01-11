import GameComponent from "./GameComponent";
import Vector3f from "../math/Vector3f";
import Vector2f from "../math/Vector2f";
import Display from "../core/Display";
import Util from "../core/Util";
import Input from "../input/Input";
import Keyboard from "../input/Keyboard";

export default class FreeLook extends GameComponent {
    private static Y_AXIS: Vector3f = new Vector3f(0, 1, 0);

    private m_mouseLocked: boolean = false;
    private m_sensitivity: number;
    private m_unlockMouseKey: number;

    constructor(sensitivity: number) {
        super();
        this.init(sensitivity, Keyboard.ESCAPE);
    }

    public init(sensitivity: number, unlockMouseKey: number) {
        this.m_sensitivity = sensitivity;
        this.m_unlockMouseKey = unlockMouseKey;
    }

    // @Override
    public Input(delta: number): void {

        const centerPosition: Vector2f = new Vector2f(Display.getWidth() / 2, Display.getHeight() / 2);

        if (Input.getKey(this.m_unlockMouseKey)) {
            // Input.setCursor(true);
            this.m_mouseLocked = false;
        }
        if (Input.getMouseDown(0)) {
            // Input.SetMousePosition(centerPosition);
            // Input.SetCursor(false);
            this.m_mouseLocked = true;
        }

        if (this.m_mouseLocked) {
            const deltaPos:Vector2f = Input.getMousePosition().subVec(centerPosition);

            const rotY:boolean = deltaPos.getX() != 0;
            const rotX:boolean = deltaPos.getY() != 0;

            if (rotY)
                this.getTransform().rotate(FreeLook.Y_AXIS, Util.toRadians(deltaPos.getX() * this.m_sensitivity));
            if (rotX)
                this.getTransform().rotate(this.getTransform().getRot().getRight(), Util.toRadians(-deltaPos.getY() * this.m_sensitivity));

            // if (rotY || rotX)
            //     Input.SetMousePosition(centerPosition);
        }
    }
}