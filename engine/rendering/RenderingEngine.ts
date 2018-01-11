import Display from "../core/Display";
import Vector3f from "../math/Vector3f";
import GameObject from "../core/GameObject";
import Transform from "../core/Transform";
import Camera3D from "../components/Camera3D";
import MappedValues from "../core/resourceManagment/MappedValues";
import Shader from "./Shader";

export default class RenderingEngine extends MappedValues {

	private gl:WebGLRenderingContext = Display.gl;

	private m_samplerMap: Map<string, number>;
	// private m_lights: Array<BaseLight>;
	// private m_activeLight: BaseLight;

	private m_ambientShader: Shader;
	private m_mainCamera: Camera3D;

	constructor() {
		super();
		// this.m_lights = new Array<BaseLight>();
		this.m_samplerMap = new Map<string, number>();
		this.m_samplerMap.set("diffuse", 0);
		this.m_samplerMap.set("normalMap", 1);
		this.m_samplerMap.set("dispMap", 2);

		this.addVector3f("ambient", new Vector3f(0.1, 0.1, 0.1));

		this.m_ambientShader = new Shader("ambient");

		this.gl.clearColor(0.0, 0.0, 0.0, 0.0);

		this.gl.frontFace(this.gl.CW);
		this.gl.cullFace(this.gl.BACK);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.enable(this.gl.DEPTH_TEST);

		//
		// glEnable(GL_DEPTH_CLAMP);

		// this.gl.enable(this.gl.TEXTURE_2D);
	}

	// public updateUniformStruct(transform: Transform, material: Material, shader: Shader, uniformName: string, uniformType: string): void {
	// 	throw new Error(uniformType + " is not a supported type in RenderingEngine");
	// }

	public render(object: GameObject): void {
		if (this.getMainCamera() === null) {
			new Error("Error! Main camera not found. This is very very big bug, and game will crash.");
			return;
		}
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		object.renderAll(this.m_ambientShader, this);

		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
		this.gl.depthMask(false);
		this.gl.depthFunc(this.gl.EQUAL);

		// let light: BaseLight;
		// for (let i: number = 0; i < this.m_lights.length; i++) {

		// 	light = this.m_lights[i];
		// 	this.m_activeLight = light;
		// 	object.RenderAll(light.GetShader(), this);
		// }

		// for(BaseLight light : m_lights)
		// {
		// 	m_activeLight = light;
		// 	object.RenderAll(light.GetShader(), this);
		// }

		this.gl.depthFunc(this.gl.LESS);
		this.gl.depthMask(true);
		this.gl.disable(this.gl.BLEND);
	}

	public static getOpenGLVersion(): string {

		const gl = Display.gl;
		return gl.getParameter(gl.VERSION);
	}

	// public addLight(light: BaseLight): void {
	// 	this.m_lights.push(light);
	// }

	public addCamera(camera: Camera3D): void {
		this.m_mainCamera = camera;
	}

	public getSamplerSlot(samplerName: string): number | undefined {
		return this.m_samplerMap.get(samplerName);
	}

	// public getActiveLight(): BaseLight {
	// 	return this.m_activeLight;
	// }

	public getMainCamera(): Camera3D {

		return this.m_mainCamera;
	}

	public setMainCamera(mainCamera: Camera3D): void {
		this.m_mainCamera = mainCamera;
	}
}