import GameObject from "../core/GameObject";
import CoreEngine from "../core/CoreEngine";
import Transform from "../core/Transform";
import { RenderMode } from "../core/Display";
import RenderingEngine from "../rendering/RenderingEngine";
import Shader from "../rendering/Shader";

export default abstract class GameComponent {

    private m_parent: GameObject;

    public input(delta: number): void { }
    public update(delta: number): void { }
    public render(shader: Shader, renderingEngine: RenderingEngine): void { }

    public setParent(parent: GameObject): void {
        this.m_parent = parent;
    }

    public getTransform(): Transform {
        return this.m_parent.getTransform();
    }
    public addToEngine(engine: CoreEngine): void { }
}