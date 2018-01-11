import Display, { DisplayMode, RenderMode } from "./Display";
import RenderingEngine from "../rendering/RenderingEngine";
import Game from "./Game";
import Time from "./Time";
import Input from "../input/Input";
import Keyboard from "../input/Keyboard";

export default class CoreEngine {

	private m_isRunning: boolean;
	private m_width: number;
	private m_height: number;
	private m_frameTime: number;
	private m_game: Game;
	private m_renderingEngine: RenderingEngine;

    /**
     * 
     * @param display DisplayMode, object with canvas properties
     * @param framerate number, frame rate for the engine
     */
	constructor(display: DisplayMode, game:Game) {

		this.m_isRunning = false;
		this.m_width = display.getWidth();
		this.m_height = display.getHeight();
        this.m_frameTime = 1.0 / display.getFrameRate();
        this.m_game = game;
		game.setEngine(this);

        this.m_renderingEngine = new RenderingEngine();
	}

	// public setGame(game: Game): void {
    //     console.log(game)
    //     this.m_game = game;
    //     game.setEngine(this);
	// }

	public createRendering(title: string): void {
		
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

        this.m_game.init();

		let instance: CoreEngine = this;

        let lastTime: number = Time.getTime();
        let unprocessedTime: number = 0;

        let loop: Function = function(e) {

            let render: boolean = false;

            let startTime: number = Time.getTime();
            let passedTime: number = startTime - lastTime;
            lastTime = startTime;

            unprocessedTime += (passedTime / Time.SECOND);
			frameCounter += passedTime;


            while(unprocessedTime > instance.m_frameTime) {

                render = true;
                unprocessedTime -= instance.m_frameTime;

                if(!instance.m_isRunning) {
                    window.clearInterval(interID);
                }

                Time.setDelta(instance.m_frameTime);
                
                instance.m_game.input(Time.getDelta());
                Input.update();
                
                instance.m_game.update(Time.getDelta());

                if(Input.getKey(Keyboard.ESCAPE)) {
                    instance.stop();
                }

                if(frameCounter >= Time.SECOND) {

					// console.log(frames);
                    frames = 0;
                    frameCounter = 0;
                }
            }

            if(render) {
                instance.m_game.render(instance.m_renderingEngine);
                frames++;
            }
        }

        let interID: number = window.setInterval(loop, 1);
		// this.cleanUp();
	}

	private cleanUp(): void {
	}

	public getRenderingEngine(): RenderingEngine {
		return this.m_renderingEngine;
	}
}