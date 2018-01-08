define("engine/core/Display", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Display {
        static create(displayMode) {
            Display.displayMode = displayMode;
            Display.canvas = document.createElement("canvas");
            Display.canvas.width = Display.displayMode.getWidth();
            Display.canvas.height = Display.displayMode.getHeight();
            const gl = Display.canvas.getContext("webgl2");
            if (!gl) {
                new Error("no webgl render context available");
                return;
            }
            Display.gl = gl;
        }
        static setTitle(title) {
            document.title = title;
        }
        static update() {
        }
        static setFullscreen(fullscreen) {
        }
        static getAdapterProperties() {
            const gl = Display.gl;
            let version = ("Version: " + gl.getParameter(gl.VERSION) + "\n");
            version += ("Shader Version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION) + "\n");
            version += ("Vendor: " + gl.getParameter(gl.VENDOR));
            return version;
        }
        static getDisplayMode() {
            return Display.displayMode;
        }
    }
    exports.default = Display;
    class DisplayMode {
        constructor(width, height, renderMode = RenderMode.HARDWARE) {
            this.width = width;
            this.height = height;
            this.renderMode = renderMode;
        }
        isFullscreenCapable() {
            return Display.canvas.requestFullscreen !== null;
        }
        getWidth() {
            return this.width;
        }
        getHeight() {
            return this.height;
        }
    }
    exports.DisplayMode = DisplayMode;
    var RenderMode;
    (function (RenderMode) {
        RenderMode[RenderMode["HARDWARE"] = 0] = "HARDWARE";
        RenderMode[RenderMode["SOFTWARE"] = 1] = "SOFTWARE";
    })(RenderMode = exports.RenderMode || (exports.RenderMode = {}));
});
define("engine/core/CoreEngine", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CoreEngine {
        constructor(display, framerate) {
            this.m_isRunning = false;
            this.m_width = display.getWidth();
            this.m_height = display.getHeight();
            this.m_frameTime = 1.0 / framerate;
        }
        createWindow(title) {
        }
        start() {
            if (this.m_isRunning)
                return;
            this.run();
        }
        stop() {
            if (!this.m_isRunning)
                return;
            this.m_isRunning = false;
        }
        run() {
            this.m_isRunning = true;
            let frames = 0;
            let frameCounter = 0;
            let lastTime = Date.now();
            let unprocessedTime = 0;
            let instance = this;
            let loop = function (e) {
                let render = false;
                let startTime = Date.now();
                let passedTime = startTime - lastTime;
                lastTime = startTime;
                unprocessedTime += (passedTime / 100000);
                frameCounter += passedTime;
                while (unprocessedTime > instance.m_frameTime) {
                    render = true;
                    unprocessedTime -= instance.m_frameTime;
                    if (frameCounter >= 1.0) {
                        frames = 0;
                        frameCounter = 0;
                    }
                }
                if (render) {
                    frames++;
                }
            };
            let interID = window.setInterval(loop, 1);
            this.cleanUp();
        }
        cleanUp() {
        }
    }
    exports.default = CoreEngine;
});
define("game/Main", ["require", "exports", "engine/core/CoreEngine", "engine/core/Display"], function (require, exports, CoreEngine_1, Display_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Main {
        static init() {
            Display_1.default.create(new Display_1.DisplayMode(800, 600));
            Main.engine = new CoreEngine_1.default(Display_1.default.getDisplayMode(), 60);
            Main.engine.createWindow("Gizmo Bomba");
            return this;
        }
        static start() {
            if (!Main.engine) {
                throw new Error("No engine found!");
            }
            Main.engine.start();
        }
        static stop() {
            if (!Main.engine) {
                throw new Error("No engine found!");
            }
            Main.engine.stop();
        }
    }
    exports.default = Main;
});
//# sourceMappingURL=main.js.map