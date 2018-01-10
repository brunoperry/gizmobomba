import Game from "../engine/core/Game";
import Mesh from "../engine/rendering/Mesh";

export default class TestGame extends Game {

     constructor() {
         super();

         const mesh: Mesh = new Mesh("cube.obj");
     }
}