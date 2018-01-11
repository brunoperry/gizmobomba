import CoreEngine from "../engine/core/CoreEngine";
import Display, { DisplayMode } from "../engine/core/Display";
import TestGame from "./TestGame";
import ResourcesLoader from "../engine/core/resourceManagment/loaders/ResourcesLoader";
import Util from "../engine/core/Util";

export default class Main {

    private static engine: CoreEngine;

    public static init(autostart:boolean = true): void {

        Util.loadJSONFile(ResourcesLoader.URL + "resources.json")
        .then((result) => {
            return ResourcesLoader.loadResources(result);
        })
        .then(loaded => {

            Display.create(new DisplayMode(800, 600, 60));
            Display.setTitle("Gizmo Bomba 3D");
            Main.engine = new CoreEngine(Display.getDisplayMode(), new TestGame());
            Main.start();
        });
    }
    public static start(): void {
        if (!Main.engine) {
            throw new Error("No engine found!");
        }
        Main.engine.start();
    }

    public static stop(): void {
        if (!Main.engine) {
            throw new Error("No engine found!");
        }
        Main.engine.stop();
    }
}