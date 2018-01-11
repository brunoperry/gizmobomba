import Vector2f from "../math/Vector2f";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";

export default class Input {

    private static lastKeys : Array<boolean> = new Array<boolean>(Keyboard.NUM_KEYCODES);
    private static lastMouse : Array<boolean> = new Array<boolean>(Mouse.NUM_MOUSE_BUTTONS);

    private static currentDeltaPos: Vector2f = new Vector2f();
    private static previousDeltaPos: Vector2f = new Vector2f();

    public static update(): void {

        for(let i : number = 0; i < Keyboard.NUM_KEYCODES; i++) {
            Input.lastKeys[i] = Input.getKey(i);
        }
        
        for(let i : number = 0; i < Mouse.NUM_MOUSE_BUTTONS; i++) {
            Input.lastMouse[i] = Input.getMouse(i);
        }
    }

    //KEYBOARD STUFF
    public static getKey(keyCode: number): boolean {
        return Keyboard.isKeyDown(keyCode);
    }

    public static getKeyDown(keyCode: number): boolean {
		return Input.getKey(keyCode) && !Input.lastKeys[keyCode];
    }
	
	public static getKeyUp(keyCode: number): boolean {
		return !Input.getKey(keyCode) && Input.lastKeys[keyCode];
	}

    //MOUSE STUFF
    public static getMouse(mouseButton: number): boolean {
        return Mouse.isButtonDown(mouseButton);
    }
    public static getMouseDown(mouseButton: number): boolean {
        return Input.getMouse(mouseButton) && !Input.lastMouse[mouseButton];
    }
    public static getMouseUp(mouseButton: number): boolean {
        return !Input.getMouse(mouseButton) && Input.lastMouse[mouseButton];
    }
    public static getMouseLock(): boolean {
        return Mouse.isLocked;
    }
    public static getMousePosition(): Vector2f {

        let res: Vector2f;

        Input.previousDeltaPos = Input.currentDeltaPos;
        Input.currentDeltaPos = new Vector2f(Mouse.getX(), Mouse.getY());

        if(Input.previousDeltaPos.equals(Input.currentDeltaPos)) {
            res = new Vector2f(0,0);
        } else {
            res = Input.currentDeltaPos;
        }
        return res;
    }
}