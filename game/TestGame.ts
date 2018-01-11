import Game from "../engine/core/Game";
import Mesh from "../engine/rendering/Mesh";
import GameObject from "../engine/core/GameObject";
import MeshResource from "../engine/core/resourceManagment/MeshResource";
import Material from "../engine/rendering/Material";
import TextFileReader from "../engine/core/resourceManagment/loaders/TextFileReader";
import Texture from "../engine/rendering/Texture";
import MeshRenderer from "../engine/components/MeshRenderer";
import Vector3f from "../engine/math/Vector3f";
import Shader from "../engine/rendering/Shader";
import Util from "../engine/core/Util";
import Matrix4f from "../engine/math/Matrix4f";
import Camera3D from "../engine/components/Camera3D";
import Display from "../engine/core/Display";
import FreeLook from "../engine/components/FreeLook";
import FreeMove from "../engine/components/FreeMove";

export default class TestGame extends Game {

    constructor() {

        super();

        const cubeMesh: Mesh = new Mesh("cube.obj");
        const material: Material = new Material(new Texture("UV_Grid.jpg"));
        const shader: Shader = new Shader("basic");
        const meshRenderer: MeshRenderer = new MeshRenderer(
            cubeMesh,
            material,
            shader
        );

        const cubeObject: GameObject = new GameObject("cube").addComponent(meshRenderer);
        cubeObject.getTransform().setPos(new Vector3f(0, 0, 20));

        const cam: Camera3D = new Camera3D(new Matrix4f().initPerspective());
        const cameraObject = new GameObject("camera").addComponent(cam);

        // this.addObject(
        //     //AddObject(
        //     new GameObject().addComponent(new FreeLook(0.5)).addComponent(new FreeMove(10.0))
        //             .addComponent(new Camera3D(new Matrix4f().initPerspective(Util.toRadians(70.0),
        //                     Display.getWidth() / Display.getHeight(), 0.01, 1000.0))));

        this.addObject(cameraObject);
        this.addObject(cubeObject);
    }
}