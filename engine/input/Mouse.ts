import Vector2f from "../math/Vector2f";
import Display from "../core/Display";


export default class Mouse {

    public static FIRE: number = 0;
    public static MIDDLE: number = 1;
    public static RIGHT: number = 2;

    public static NUM_MOUSE_BUTTONS = 3;

    private static currentPosition: Vector2f = new Vector2f();
    private static previousPosition: Vector2f = new Vector2f();

    private static buttons: Array<boolean> = [];

    public static sensitivity: number = 0.3;

    public static isLocked: boolean = false;
    
    public static create(): void {

        Display.canvas.onmousedown = function(e: MouseEvent): void {
            Mouse.buttons[e.button] = true;
        }
        Display.canvas.onmouseup = function(e: MouseEvent): void {
            Mouse.buttons[e.button] = false;
        }
    }

    private static moveCallback(e: MouseEvent) {

        let x: number = Mouse.currentPosition.getX();
        let y: number = Mouse.currentPosition.getY();

        let x1: number = -e.movementX;
        let y1: number = -e.movementY;

        if(x === x1 && y === y1) {
            Mouse.currentPosition.setX(0);
            Mouse.currentPosition.setY(0);

        } else {
            Mouse.currentPosition.setX(x1);
            Mouse.currentPosition.setY(y1);
        }
    }

    public static isButtonDown(buttonCode: number): boolean {
        return Mouse.buttons[buttonCode] === true;
    }

    public static getX(): number {
        return Mouse.currentPosition.getX();
    }
    public static getY(): number {
        return Mouse.currentPosition.getY();
    }

    public static setMouseLock(lock: boolean): void {

        Mouse.isLocked = lock;

        if(!lock) {
            Display.canvas.removeEventListener("mousemove", Mouse.moveCallback);
        } else {
            Display.canvas.addEventListener("mousemove", Mouse.moveCallback);
        }
    }
}