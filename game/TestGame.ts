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
import Vector2f from "../engine/math/Vector2f";

export default class TestGame extends Game {

    constructor() {

        super();
    }

    public init():void {

        const cubeMesh: Mesh = new Mesh();
        const cubeMaterial: Material = new Material();

        const cube = new GameObject();
        cube.getTransform().setPos(new Vector3f(0, 0, 20))
        cube.addComponent(new MeshRenderer(cubeMesh, cubeMaterial));

        this.addObject(cube);
    }
}