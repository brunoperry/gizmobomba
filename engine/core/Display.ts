export default class Display {

    public static canvas: HTMLCanvasElement;
    public static gl: WebGL2RenderingContext;

    private static displayMode: DisplayMode;

    public static create(displayMode: DisplayMode): void {

        Display.displayMode = displayMode;

        Display.canvas = document.createElement("canvas");

        Display.canvas.width = Display.displayMode.getWidth();
        Display.canvas.height = Display.displayMode.getHeight();

        document.body.appendChild(Display.canvas);

        switch (displayMode.getRenderMode()) {

            case RenderMode.HARDWARE:
                const gl: WebGL2RenderingContext | null = Display.canvas.getContext("webgl2");
                if (!gl) throw new Error("No suitable WebGL render context available (needs version 2)");
                Display.gl = gl;

                break;
            case RenderMode.SOFTWARE:

                break;
            default:
                throw new Error("No render mode defined");
        }
    }

    public static setTitle(title: string): void {

        document.title = title;
    }

    public static update(): void {

    }

    public static setFullscreen(fullscreen: boolean): void {

    }

    public static getAdapterProperties(): string {

        const gl: WebGLRenderingContext = Display.gl;

        let version: string = ("Version: " + gl.getParameter(gl.VERSION) + "\n");
        version += ("Shader Version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION) + "\n");
        version += ("Vendor: " + gl.getParameter(gl.VENDOR));
        return version;
    }

    public static getWidth():number {
        return Display.getDisplayMode().getWidth();
    }

    public static getHeight():number {
        return Display.getDisplayMode().getHeight();
    }

    public static getAspectRatio():number {
        return Display.getDisplayMode().getWidth() / Display.getDisplayMode().getHeight();
    }

    public static getDisplayMode(): DisplayMode {

        return Display.displayMode;
    }
}

export class DisplayMode {

    private width: number;
    private height: number;
    private renderMode: RenderMode;
    private frameRate: number;

    constructor(width: number, height: number, frameRate: number = 60, renderMode: RenderMode = RenderMode.HARDWARE) {
        this.width = width;
        this.height = height;
        this.frameRate = frameRate;
        this.renderMode = renderMode;
    }

    public isFullscreenCapable(): boolean {
        return Display.canvas.requestFullscreen !== null;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getRenderMode(): RenderMode {
        return this.renderMode;
    }

    public getFrameRate(): number {
        return this.frameRate;
    }
    public setFrameRate(frameRate: number): void {
        this.frameRate = frameRate;
    }
}

export enum RenderMode {
    HARDWARE, SOFTWARE
}