import GameComponent from "../components/GameComponent";
import CoreEngine from "./CoreEngine";
import Transform from "./Transform";
import { RenderMode } from "./Display";
import RenderingEngine from "../rendering/RenderingEngine";
import Shader from "../rendering/Shader";

export default class GameObject {

	private m_children: Array<GameObject>;
	private m_components: Array<GameComponent>;
	private m_transform: Transform;
	private m_engine: CoreEngine | null;
	public m_name:string;

	constructor(name:string="root") {

		this.m_children = new Array<GameObject>();
		this.m_components = new Array<GameComponent>();
		this.m_transform = new Transform();
		this.m_name = name;
		this.m_engine = null;
	}

	public addChild(child: GameObject): GameObject {
		
		this.m_children.push(child);
		child.setEngine(this.m_engine);
		child.getTransform().setParent(this.m_transform);

		return this;
	}

	public addComponent(component: GameComponent): GameObject {

		this.m_components.push(component);
		component.setParent(this);

		return this;
	}

	public inputAll(delta: number): void {
		this.input(delta);

		for (let i: number = 0; i < this.m_children.length; i++) {
			this.m_children[i].inputAll(delta);
		}
	}

	public updateAll(delta: number): void {
		this.update(delta);

		for (let i: number = 0; i < this.m_children.length; i++) {
			this.m_children[i].updateAll(delta);
		}
	}

	public renderAll(shader: Shader, renderingEngine: RenderingEngine): void {

		this.render(shader, renderingEngine);
		for (let i: number = 0; i < this.m_children.length; i++) {
			this.m_children[i].renderAll(shader, renderingEngine);
		}
	}

	public input(delta: number): void {
		this.m_transform.update();

		for (let i: number = 0; i < this.m_components.length; i++) {
			this.m_components[i].input(delta);
		}
	}

	public update(delta: number): void {

		for (let i: number = 0; i < this.m_components.length; i++) {
			this.m_components[i].update(delta);
		}
	}

	public render(shader: Shader, renderingEngine: RenderingEngine): void {

		for (let i: number = 0; i < this.m_components.length; i++) {
			this.m_components[i].render(shader, renderingEngine);
		}
	}

	public getAllAttached(): Array<GameObject> {
		const result: Array<GameObject> = new Array<GameObject>();

		for (let i: number = 0; i < this.m_children.length; i++) {

			result.concat(this.m_children[i].getAllAttached());
		}

		result.push(this);
		return result;
	}

	public getTransform(): Transform {
		return this.m_transform;
	}

	public setEngine(engine: CoreEngine | null): void {

		// if(engine === null) {
		// 	throw new Error("Error: No valid engine");
		// }
		// console.log("here");

		if (this.m_engine !== engine && engine !== null) {
			this.m_engine = engine;

			for (let i: number = 0; i < this.m_components.length; i++) {
				this.m_components[i].addToEngine(engine);
			}
			for (let i: number = 0; i < this.m_children.length; i++) {
				this.m_children[i].setEngine(engine);
			}
		}
	}
}