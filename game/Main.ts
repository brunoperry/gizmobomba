import CoreEngine from "../engine/core/CoreEngine";
import Display, { DisplayMode } from "../engine/core/Display";

export default class Main {

    private static engine: CoreEngine;

    public static init(): Main {

        Display.create(new DisplayMode(800, 600));
        Main.engine = new CoreEngine(Display.getDisplayMode(), 60);
        Main.engine.createWindow("Gizmo Bomba");

        return this;
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