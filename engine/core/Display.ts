export default class Display {

    public static canvas: HTMLCanvasElement;
    public static gl: WebGL2RenderingContext;

    private static displayMode: DisplayMode;

    public static create(displayMode: DisplayMode): void {

        Display.displayMode = displayMode;

        Display.canvas = document.createElement("canvas");

        Display.canvas.width = Display.displayMode.getWidth();
        Display.canvas.height = Display.displayMode.getHeight();

        const gl: WebGL2RenderingContext | null = Display.canvas.getContext("webgl2");

        if (!gl) {
            new Error("no webgl render context available");
            return;
        }
        Display.gl = gl;
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

    public static getDisplayMode(): DisplayMode {

        return Display.displayMode;
    }
}

export class DisplayMode {

    private width: number;
    private height: number;
    private renderMode: RenderMode;

    constructor(width: number, height: number, renderMode: RenderMode = RenderMode.HARDWARE) {
        this.width = width;
        this.height = height;
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
}

export enum RenderMode {
    HARDWARE, SOFTWARE
}