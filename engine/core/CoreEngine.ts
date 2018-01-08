import { DisplayMode } from "./Display";

export default class CoreEngine {

	private m_isRunning: boolean;
	private m_width: number;
	private m_height: number;
	private m_frameTime: number;

    /**
     * 
     * @param display DisplayMode, object with canvas properties
     * @param framerate number, frame rate for the engine
     */
	constructor(display: DisplayMode, framerate: number) {

		this.m_isRunning = false;
		this.m_width = display.getWidth();
		this.m_height = display.getHeight();
		this.m_frameTime = 1.0 / framerate;
	}

	public createWindow(title: string): void {
	}

	public start(): void {
		if (this.m_isRunning) return;

		this.run();
	}

	public stop(): void {
		if (!this.m_isRunning) return;

		this.m_isRunning = false;
	}

	private run(): void {

		this.m_isRunning = true;

		let frames: number = 0;
		let frameCounter: number = 0;

		let lastTime: number = Date.now();
		let unprocessedTime: number = 0;

		let instance: CoreEngine = this;

		let loop: Function = function (e) {

			let render: boolean = false;

			let startTime: number = Date.now();
			let passedTime: number = startTime - lastTime;
			lastTime = startTime;

			unprocessedTime += (passedTime / 100000);
			frameCounter += passedTime;

			while (unprocessedTime > instance.m_frameTime) {
				
				render = true;
				unprocessedTime -= instance.m_frameTime;

				if (frameCounter >= 1.0) {

					frames = 0;
					frameCounter = 0;
				}
			}

			if (render) {
				frames++;
			}
		}

		let interID: number = window.setInterval(loop, 1);
		this.cleanUp();
	}

	private cleanUp(): void {
	}
}