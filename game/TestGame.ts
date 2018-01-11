import Game from "../engine/core/Game";
import Mesh from "../engine/rendering/Mesh";
import GameObject from "../engine/core/GameObject";
import Material from "../engine/rendering/Material";
import Texture from "../engine/rendering/Texture";
import MeshRenderer from "../engine/components/MeshRenderer";
import Vector3f from "../engine/math/Vector3f";
import Shader from "../engine/rendering/Shader";
import Matrix4f from "../engine/math/Matrix4f";
import Camera3D from "../engine/components/Camera3D";

export default class TestGame extends Game {

    constructor() {

        super();
    }

    public init():void {

        const cubeMesh: Mesh = new Mesh("cube.obj");
        const material: Material = new Material(new Texture("UV_Grid.jpg"));
        const shader: Shader = new Shader("basic");
        
        const meshRenderer: MeshRenderer = new MeshRenderer(
            cubeMesh,
            material
        );

        const cubeObject: GameObject = new GameObject("cube").addComponent(meshRenderer);

        const cam: Camera3D = new Camera3D(new Matrix4f().initPerspective());
        const cameraObject = new GameObject("camera").addComponent(cam);

        this.addObject(cameraObject);
        this.addObject(cubeObject);
    }
}