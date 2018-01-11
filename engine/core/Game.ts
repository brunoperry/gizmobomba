import GameObject from "./GameObject";
import CoreEngine from "./CoreEngine";
import { RenderMode } from "./Display";
import RenderingEngine from "../rendering/RenderingEngine";

export default abstract class Game {
	private m_root: GameObject;

	public init(): void { }

	public input(delta: number): void {
		this.getRootObject().inputAll(delta);
	}

	public update(delta: number): void {
		this.getRootObject().updateAll(delta);
	}

	public render(renderingEngine: RenderingEngine): void {

		renderingEngine.render(this.getRootObject());
	}

	public addObject(object: GameObject): void {

		console.log(object.m_name)
		this.getRootObject().addChild(object);
	}

	private getRootObject(): GameObject {
		if (this.m_root == null)
			this.m_root = new GameObject();

		return this.m_root;
	}

	public setEngine(engine: CoreEngine): void { this.getRootObject().setEngine(engine); }
}