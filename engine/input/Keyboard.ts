
export default class Keyboard {

    public static LEFT: number = 37;
    public static UP: number = 38;
    public static RIGHT: number = 39;
    public static DOWN: number = 40;
    public static W: number = 87;
    public static A: number = 65;
    public static S: number = 83;
    public static D: number = 68;
    public static SPACE: number = 32;
    public static ESCAPE: number = 27;

    public static NUM_KEYCODES = 9;


    public static keys: Array<boolean> = [];
    
    public static create(): void {

        //KEYBOARD
        window.onkeyup = function(e: KeyboardEvent): void {
            Keyboard.keys[e.keyCode] = false;
        }
        window.onkeydown = function(e: KeyboardEvent): void {
            Keyboard.keys[e.keyCode] = true;
        }
    }

    public static isKeyDown(keyCode: number): boolean {
        return Keyboard.keys[keyCode] === true;
    }
}