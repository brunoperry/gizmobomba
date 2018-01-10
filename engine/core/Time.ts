export default class Time {

    public static SECOND: number = 1000;
    private static delta: number = 0;

    public static getTime(): number {
        return Date.now();
    }

    public static getDelta(): number {
        return Time.delta;
    }
    
    public static setDelta(delta: number): void {
        
        Time.delta = delta;
    }
}