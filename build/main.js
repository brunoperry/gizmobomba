var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("engine/math/Vector2f", ["require", "exports", "engine/core/Util"], function (require, exports, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Vector2f {
        constructor(x = 0, y = 0) {
            this.m_x = x;
            this.m_y = y;
        }
        length() {
            return Math.sqrt(this.m_x * this.m_x + this.m_y * this.m_y);
        }
        max() {
            return Math.max(this.m_x, this.m_y);
        }
        dot(r) {
            return this.m_x * r.getX() + this.m_y * r.getY();
        }
        Normalized() {
            const length = this.length();
            return new Vector2f(this.m_x / length, this.m_y / length);
        }
        cross(r) {
            return this.m_x * r.getY() - this.m_y * r.getX();
        }
        lerp(dest, lerpFactor) {
            return dest.subVec(this).mulNum(lerpFactor).addVec(this);
        }
        rotate(angle) {
            const rad = Util_1.default.toRadians(angle);
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            return new Vector2f((this.m_x * cos - this.m_y * sin), (this.m_x * sin + this.m_y * cos));
        }
        addVec(r) {
            return new Vector2f(this.m_x + r.getX(), this.m_y + r.getY());
        }
        addNum(r) {
            return new Vector2f(this.m_x + r, this.m_y + r);
        }
        subVec(r) {
            return new Vector2f(this.m_x - r.getX(), this.m_y - r.getY());
        }
        subNum(r) {
            return new Vector2f(this.m_x - r, this.m_y - r);
        }
        mulVec(r) {
            return new Vector2f(this.m_x * r.getX(), this.m_y * r.getY());
        }
        mulNum(r) {
            return new Vector2f(this.m_x * r, this.m_y * r);
        }
        divVec(r) {
            return new Vector2f(this.m_x / r.getX(), this.m_y / r.getY());
        }
        divNum(r) {
            return new Vector2f(this.m_x / r, this.m_y / r);
        }
        abs() {
            return new Vector2f(Math.abs(this.m_x), Math.abs(this.m_y));
        }
        toString() {
            return "(" + this.m_x + " " + this.m_y + ")";
        }
        setNum(x, y) { this.m_x = x; this.m_y = y; return this; }
        setVec(r) { this.setNum(r.getX(), r.getY()); return this; }
        getX() {
            return this.m_x;
        }
        setX(x) {
            this.m_x = x;
        }
        getY() {
            return this.m_y;
        }
        setY(y) {
            this.m_y = y;
        }
        equals(r) {
            return this.m_x == r.getX() && this.m_y == r.getY();
        }
    }
    exports.default = Vector2f;
});
define("engine/math/Quaternion", ["require", "exports", "engine/math/Vector3f", "engine/math/Matrix4f"], function (require, exports, Vector3f_1, Matrix4f_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Quaternion {
        constructor() {
        }
        initNum(x, y, z, w) {
            this.m_x = x;
            this.m_y = y;
            this.m_z = z;
            this.m_w = w;
            return this;
        }
        initVecAngle(axis, angle) {
            const sinHalfAngle = Math.sin(angle / 2);
            const cosHalfAngle = Math.cos(angle / 2);
            this.m_x = axis.getX() * sinHalfAngle;
            this.m_y = axis.getY() * sinHalfAngle;
            this.m_z = axis.getZ() * sinHalfAngle;
            this.m_w = cosHalfAngle;
            return this;
        }
        length() {
            return Math.sqrt(this.m_x * this.m_x + this.m_y * this.m_y + this.m_z * this.m_z + this.m_w * this.m_w);
        }
        normalized() {
            const length = this.length();
            return new Quaternion().initNum(this.m_x / length, this.m_y / length, this.m_z / length, this.m_w / length);
        }
        conjugate() {
            return new Quaternion().initNum(-this.m_x, -this.m_y, -this.m_z, this.m_w);
        }
        mulNum(r) {
            return new Quaternion().initNum(this.m_x * r, this.m_y * r, this.m_z * r, this.m_w * r);
        }
        mulQuat(r) {
            const w_ = this.m_w * r.getW() - this.m_x * r.getX() - this.m_y * r.getY() - this.m_z * r.getZ();
            const x_ = this.m_x * r.getW() + this.m_w * r.getX() + this.m_y * r.getZ() - this.m_z * r.getY();
            const y_ = this.m_y * r.getW() + this.m_w * r.getY() + this.m_z * r.getX() - this.m_x * r.getZ();
            const z_ = this.m_z * r.getW() + this.m_w * r.getZ() + this.m_x * r.getY() - this.m_y * r.getX();
            return new Quaternion().initNum(x_, y_, z_, w_);
        }
        mulVec(r) {
            const w_ = -this.m_x * r.getX() - this.m_y * r.getY() - this.m_z * r.getZ();
            const x_ = this.m_w * r.getX() + this.m_y * r.getZ() - this.m_z * r.getY();
            const y_ = this.m_w * r.getY() + this.m_z * r.getX() - this.m_x * r.getZ();
            const z_ = this.m_w * r.getZ() + this.m_x * r.getY() - this.m_y * r.getX();
            return new Quaternion().initNum(x_, y_, z_, w_);
        }
        subQuat(r) {
            return new Quaternion().initNum(this.m_x - r.getX(), this.m_y - r.getY(), this.m_z - r.getZ(), this.m_w - r.getW());
        }
        addQuat(r) {
            return new Quaternion().initNum(this.m_x + r.getX(), this.m_y + r.getY(), this.m_z + r.getZ(), this.m_w + r.getW());
        }
        toRotationMatrix() {
            const forward = new Vector3f_1.default(2.0 * (this.m_x * this.m_z - this.m_w * this.m_y), 2.0 * (this.m_y * this.m_z + this.m_w * this.m_x), 1.0 - 2.0 * (this.m_x * this.m_x + this.m_y * this.m_y));
            const up = new Vector3f_1.default(2.0 * (this.m_x * this.m_y + this.m_w * this.m_z), 1.0 - 2.0 * (this.m_x * this.m_x + this.m_z * this.m_z), 2.0 * (this.m_y * this.m_z - this.m_w * this.m_x));
            const right = new Vector3f_1.default(1.0 - 2.0 * (this.m_y * this.m_y + this.m_z * this.m_z), 2.0 * (this.m_x * this.m_y - this.m_w * this.m_z), 2.0 * (this.m_x * this.m_z + this.m_w * this.m_y));
            return new Matrix4f_1.default().initRotationFUR(forward, up, right);
        }
        dot(r) {
            return this.m_x * r.getX() + this.m_y * r.getY() + this.m_z * r.getZ() + this.m_w * r.getW();
        }
        NLerp(dest, lerpFactor, shortest) {
            let correctedDest = dest;
            if (shortest && this.dot(dest) < 0)
                correctedDest = new Quaternion().initNum(-dest.getX(), -dest.getY(), -dest.getZ(), -dest.getW());
            return correctedDest.subQuat(this).mulNum(lerpFactor).addQuat(this).normalized();
        }
        SLerp(dest, lerpFactor, shortest) {
            const EPSILON = 1e3;
            let cos = this.dot(dest);
            let correctedDest = dest;
            if (shortest && cos < 0) {
                cos = -cos;
                correctedDest = new Quaternion().initNum(-dest.getX(), -dest.getY(), -dest.getZ(), -dest.getW());
            }
            if (Math.abs(cos) >= 1 - EPSILON) {
                return this.NLerp(correctedDest, lerpFactor, false);
            }
            const sin = Math.sqrt(1.0 - cos * cos);
            const angle = Math.atan2(sin, cos);
            const invSin = 1.0 / sin;
            const srcFactor = Math.sin((1.0 - lerpFactor) * angle) * invSin;
            const destFactor = Math.sin((lerpFactor) * angle) * invSin;
            return this.mulNum(srcFactor).addQuat(correctedDest.mulNum(destFactor));
        }
        initMat(rot) {
            const trace = rot.get(0, 0) + rot.get(1, 1) + rot.get(2, 2);
            if (trace > 0) {
                const s = 0.5 / Math.sqrt(trace + 1.0);
                this.m_w = 0.25 / s;
                this.m_x = (rot.get(1, 2) - rot.get(2, 1)) * s;
                this.m_y = (rot.get(2, 0) - rot.get(0, 2)) * s;
                this.m_z = (rot.get(0, 1) - rot.get(1, 0)) * s;
            }
            else {
                if (rot.get(0, 0) > rot.get(1, 1) && rot.get(0, 0) > rot.get(2, 2)) {
                    const s = 2.0 * Math.sqrt(1.0 + rot.get(0, 0) - rot.get(1, 1) - rot.get(2, 2));
                    this.m_w = (rot.get(1, 2) - rot.get(2, 1)) / s;
                    this.m_x = 0.25 * s;
                    this.m_y = (rot.get(1, 0) + rot.get(0, 1)) / s;
                    this.m_z = (rot.get(2, 0) + rot.get(0, 2)) / s;
                }
                else if (rot.get(1, 1) > rot.get(2, 2)) {
                    const s = 2.0 * Math.sqrt(1.0 + rot.get(1, 1) - rot.get(0, 0) - rot.get(2, 2));
                    this.m_w = (rot.get(2, 0) - rot.get(0, 2)) / s;
                    this.m_x = (rot.get(1, 0) + rot.get(0, 1)) / s;
                    this.m_y = 0.25 * s;
                    this.m_z = (rot.get(2, 1) + rot.get(1, 2)) / s;
                }
                else {
                    const s = 2.0 * Math.sqrt(1.0 + rot.get(2, 2) - rot.get(0, 0) - rot.get(1, 1));
                    this.m_w = (rot.get(0, 1) - rot.get(1, 0)) / s;
                    this.m_x = (rot.get(2, 0) + rot.get(0, 2)) / s;
                    this.m_y = (rot.get(1, 2) + rot.get(2, 1)) / s;
                    this.m_z = 0.25 * s;
                }
            }
            const length = Math.sqrt(this.m_x * this.m_x + this.m_y * this.m_y + this.m_z * this.m_z + this.m_w * this.m_w);
            this.m_x /= length;
            this.m_y /= length;
            this.m_z /= length;
            this.m_w /= length;
            return this;
        }
        getForward() {
            return new Vector3f_1.default(0, 0, 1).rotateQuat(this);
        }
        getBack() {
            return new Vector3f_1.default(0, 0, -1).rotateQuat(this);
        }
        getUp() {
            return new Vector3f_1.default(0, 1, 0).rotateQuat(this);
        }
        getDown() {
            return new Vector3f_1.default(0, -1, 0).rotateQuat(this);
        }
        getRight() {
            return new Vector3f_1.default(1, 0, 0).rotateQuat(this);
        }
        getLeft() {
            return new Vector3f_1.default(-1, 0, 0).rotateQuat(this);
        }
        setNum(x, y, z, w) { this.m_x = x; this.m_y = y; this.m_z = z; this.m_w = w; return this; }
        setQuat(r) { this.setNum(r.getX(), r.getY(), r.getZ(), r.getW()); return this; }
        getX() {
            return this.m_x;
        }
        setX(x) {
            this.m_x = x;
        }
        getY() {
            return this.m_y;
        }
        setY(m_y) {
            this.m_y = m_y;
        }
        getZ() {
            return this.m_z;
        }
        setZ(z) {
            this.m_z = z;
        }
        getW() {
            return this.m_w;
        }
        setW(w) {
            this.m_w = w;
        }
        equals(r) {
            return this.m_x == r.getX() && this.m_y == r.getY() && this.m_z == r.getZ() && this.m_w == r.getW();
        }
    }
    exports.default = Quaternion;
});
define("engine/math/Vector3f", ["require", "exports", "engine/math/Vector2f"], function (require, exports, Vector2f_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Vector3f {
        constructor(x = 0, y = 0, z = 0) {
            this.m_x = x;
            this.m_y = y;
            this.m_z = z;
        }
        length() {
            return Math.sqrt(this.m_x * this.m_x + this.m_y * this.m_y + this.m_z * this.m_z);
        }
        max() {
            return Math.max(this.m_x, Math.max(this.m_y, this.m_z));
        }
        dot(r) {
            return this.m_x * r.getX() + this.m_y * r.getY() + this.m_z * r.getZ();
        }
        cross(r) {
            const x_ = this.m_y * r.getZ() - this.m_z * r.getY();
            const y_ = this.m_z * r.getX() - this.m_x * r.getZ();
            const z_ = this.m_x * r.getY() - this.m_y * r.getX();
            return new Vector3f(x_, y_, z_);
        }
        normalized() {
            const length = this.length();
            return new Vector3f(this.m_x / length, this.m_y / length, this.m_z / length);
        }
        rotateAngle(axis, angle) {
            const sinAngle = Math.sin(-angle);
            const cosAngle = Math.cos(-angle);
            return this.cross(axis.mulNum(sinAngle)).addVec((this.mulNum(cosAngle)).addVec(axis.mulNum(this.dot(axis.mulNum(1 - cosAngle)))));
        }
        rotateQuat(rotation) {
            const conjugate = rotation.conjugate();
            const w = rotation.mulVec(this).mulQuat(conjugate);
            return new Vector3f(w.getX(), w.getY(), w.getZ());
        }
        lerp(dest, lerpFactor) {
            return dest.subVec(this).mulNum(lerpFactor).addVec(this);
        }
        addVec(r) {
            return new Vector3f(this.m_x + r.getX(), this.m_y + r.getY(), this.m_z + r.getZ());
        }
        addNum(r) {
            return new Vector3f(this.m_x + r, this.m_y + r, this.m_z + r);
        }
        subVec(r) {
            return new Vector3f(this.m_x - r.getX(), this.m_y - r.getY(), this.m_z - r.getZ());
        }
        subNum(r) {
            return new Vector3f(this.m_x - r, this.m_y - r, this.m_z - r);
        }
        mulVec(r) {
            return new Vector3f(this.m_x * r.getX(), this.m_y * r.getY(), this.m_z * r.getZ());
        }
        mulNum(r) {
            return new Vector3f(this.m_x * r, this.m_y * r, this.m_z * r);
        }
        divVec(r) {
            return new Vector3f(this.m_x / r.getX(), this.m_y / r.getY(), this.m_z / r.getZ());
        }
        divNum(r) {
            return new Vector3f(this.m_x / r, this.m_y / r, this.m_z / r);
        }
        abs() {
            return new Vector3f(Math.abs(this.m_x), Math.abs(this.m_y), Math.abs(this.m_z));
        }
        toString() {
            return "(" + this.m_x + " " + this.m_y + " " + this.m_z + ")";
        }
        getXY() { return new Vector2f_1.default(this.m_x, this.m_y); }
        getYZ() { return new Vector2f_1.default(this.m_y, this.m_z); }
        getZX() { return new Vector2f_1.default(this.m_z, this.m_x); }
        getYX() { return new Vector2f_1.default(this.m_y, this.m_x); }
        getZY() { return new Vector2f_1.default(this.m_z, this.m_y); }
        getXZ() { return new Vector2f_1.default(this.m_x, this.m_z); }
        setNum(x, y, z) { this.m_x = x; this.m_y = y; this.m_z = z; return this; }
        setVec(r) { this.setNum(r.getX(), r.getY(), r.getZ()); return this; }
        getX() {
            return this.m_x;
        }
        SetX(x) {
            this.m_x = x;
        }
        getY() {
            return this.m_y;
        }
        SetY(y) {
            this.m_y = y;
        }
        getZ() {
            return this.m_z;
        }
        SetZ(z) {
            this.m_z = z;
        }
        equals(r) {
            return this.m_x == r.getX() && this.m_y == r.getY() && this.m_z == r.getZ();
        }
    }
    exports.default = Vector3f;
});
define("engine/core/Vertex", ["require", "exports", "engine/math/Vector3f", "engine/math/Vector2f"], function (require, exports, Vector3f_2, Vector2f_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Vertex {
        constructor(pos = new Vector3f_2.default()) {
            this.initP(pos);
        }
        initP(pos) {
            return this.initPT(pos, new Vector2f_2.default(0, 0));
        }
        initPT(pos, texCoord) {
            return this.initPTN(pos, texCoord, new Vector3f_2.default(0, 0, 0));
        }
        initPTN(pos, texCoord, normal) {
            return this.initPTNT(pos, texCoord, normal, new Vector3f_2.default(0, 0, 0));
        }
        initPTNT(pos, texCoord, normal, tangent) {
            this.m_pos = pos;
            this.m_texCoord = texCoord;
            this.m_normal = normal;
            this.m_tangent = tangent;
            return this;
        }
        getTangent() {
            return this.m_tangent;
        }
        setTangent(tangent) {
            this.m_tangent = tangent;
        }
        getPos() {
            return this.m_pos;
        }
        setPos(pos) {
            this.m_pos = pos;
        }
        getTexCoord() {
            return this.m_texCoord;
        }
        setTexCoord(texCoord) {
            this.m_texCoord = texCoord;
        }
        getNormal() {
            return this.m_normal;
        }
        setNormal(normal) {
            this.m_normal = normal;
        }
    }
    Vertex.SIZE = 11;
    exports.default = Vertex;
});
define("engine/core/Util", ["require", "exports", "engine/core/Vertex"], function (require, exports, Vertex_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Util {
        static toRadians(degrees) {
            return degrees * Math.PI / 180;
        }
        static isWhitespace(char) {
            return /\S/.test(char);
        }
        static loadJSONFile(url) {
            return __awaiter(this, void 0, void 0, function* () {
                let response = yield fetch(url);
                return yield response.json();
            });
        }
        static CreateFlippedIntBuffer(values) {
            const buffer = new Int16Array(values.length);
            buffer.set(values);
            buffer.reverse();
            return buffer;
        }
        static CreateFlippedVertexBuffer(vertices) {
            const values = new Array();
            for (let i = 0; i < vertices.length; i++) {
                values.push(vertices[i].getPos().getX());
                values.push(vertices[i].getPos().getY());
                values.push(vertices[i].getPos().getZ());
                values.push(vertices[i].getTexCoord().getX());
                values.push(vertices[i].getTexCoord().getY());
                values.push(vertices[i].getNormal().getX());
                values.push(vertices[i].getNormal().getY());
                values.push(vertices[i].getNormal().getZ());
                values.push(vertices[i].getTangent().getX());
                values.push(vertices[i].getTangent().getY());
                values.push(vertices[i].getTangent().getZ());
            }
            const buffer = new Float32Array(vertices.length * Vertex_1.default.SIZE);
            buffer.set(values);
            buffer.reverse();
            return buffer;
        }
        static CreateFlippedMatrixBuffer(value) {
            const buffer = new Float32Array(4 * 4);
            let v;
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    v = value.get(i, j);
                    buffer.set([], v);
                }
            }
            buffer.reverse();
            return buffer;
        }
        static RemoveEmptyStrings(data) {
            const result = new Array();
            for (let i = 0; i < data.length; i++)
                if (!(data[i] === ""))
                    result.push(data[i]);
            return result;
        }
        static ToIntArrayBuffer(data) {
            let res = new Int16Array(data.length);
            for (let i = 0; i < data.length; i++) {
                res[i] = data[i];
            }
            return res;
        }
    }
    exports.default = Util;
});
define("engine/core/Display", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Display {
        static create(displayMode) {
            Display.displayMode = displayMode;
            Display.canvas = document.createElement("canvas");
            Display.canvas.width = Display.displayMode.getWidth();
            Display.canvas.height = Display.displayMode.getHeight();
            document.body.appendChild(Display.canvas);
            switch (displayMode.getRenderMode()) {
                case RenderMode.HARDWARE:
                    const gl = Display.canvas.getContext("webgl2");
                    if (!gl)
                        throw new Error("No suitable WebGL render context available (needs version 2)");
                    Display.gl = gl;
                    break;
                case RenderMode.SOFTWARE:
                    break;
                default:
                    throw new Error("No render mode defined");
            }
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
        static getWidth() {
            return Display.getDisplayMode().getWidth();
        }
        static getHeight() {
            return Display.getDisplayMode().getHeight();
        }
        static getAspectRatio() {
            return Display.getDisplayMode().getWidth() / Display.getDisplayMode().getHeight();
        }
        static getDisplayMode() {
            return Display.displayMode;
        }
    }
    exports.default = Display;
    class DisplayMode {
        constructor(width, height, frameRate = 60, renderMode = RenderMode.HARDWARE) {
            this.width = width;
            this.height = height;
            this.frameRate = frameRate;
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
        getRenderMode() {
            return this.renderMode;
        }
        getFrameRate() {
            return this.frameRate;
        }
        setFrameRate(frameRate) {
            this.frameRate = frameRate;
        }
    }
    exports.DisplayMode = DisplayMode;
    var RenderMode;
    (function (RenderMode) {
        RenderMode[RenderMode["HARDWARE"] = 0] = "HARDWARE";
        RenderMode[RenderMode["SOFTWARE"] = 1] = "SOFTWARE";
    })(RenderMode = exports.RenderMode || (exports.RenderMode = {}));
});
define("engine/math/Matrix4f", ["require", "exports", "engine/core/Util", "engine/math/Vector3f", "engine/core/Display"], function (require, exports, Util_2, Vector3f_3, Display_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Matrix4f {
        constructor() {
            this.m = new Array();
            for (let i = 0; i < 4; i++) {
                this.m.push(new Array(4));
            }
        }
        initIdentity() {
            this.m[0][0] = 1;
            this.m[0][1] = 0;
            this.m[0][2] = 0;
            this.m[0][3] = 0;
            this.m[1][0] = 0;
            this.m[1][1] = 1;
            this.m[1][2] = 0;
            this.m[1][3] = 0;
            this.m[2][0] = 0;
            this.m[2][1] = 0;
            this.m[2][2] = 1;
            this.m[2][3] = 0;
            this.m[3][0] = 0;
            this.m[3][1] = 0;
            this.m[3][2] = 0;
            this.m[3][3] = 1;
            return this;
        }
        initTranslation(x, y, z) {
            this.m[0][0] = 1;
            this.m[0][1] = 0;
            this.m[0][2] = 0;
            this.m[0][3] = x;
            this.m[1][0] = 0;
            this.m[1][1] = 1;
            this.m[1][2] = 0;
            this.m[1][3] = y;
            this.m[2][0] = 0;
            this.m[2][1] = 0;
            this.m[2][2] = 1;
            this.m[2][3] = z;
            this.m[3][0] = 0;
            this.m[3][1] = 0;
            this.m[3][2] = 0;
            this.m[3][3] = 1;
            return this;
        }
        initRotation(x, y, z) {
            const rx = new Matrix4f();
            const ry = new Matrix4f();
            const rz = new Matrix4f();
            x = Util_2.default.toRadians(x);
            y = Util_2.default.toRadians(y);
            z = Util_2.default.toRadians(z);
            rz.m[0][0] = Math.cos(z);
            rz.m[0][1] = -Math.sin(z);
            rz.m[0][2] = 0;
            rz.m[0][3] = 0;
            rz.m[1][0] = Math.sin(z);
            rz.m[1][1] = Math.cos(z);
            rz.m[1][2] = 0;
            rz.m[1][3] = 0;
            rz.m[2][0] = 0;
            rz.m[2][1] = 0;
            rz.m[2][2] = 1;
            rz.m[2][3] = 0;
            rz.m[3][0] = 0;
            rz.m[3][1] = 0;
            rz.m[3][2] = 0;
            rz.m[3][3] = 1;
            rx.m[0][0] = 1;
            rx.m[0][1] = 0;
            rx.m[0][2] = 0;
            rx.m[0][3] = 0;
            rx.m[1][0] = 0;
            rx.m[1][1] = Math.cos(x);
            rx.m[1][2] = -Math.sin(x);
            rx.m[1][3] = 0;
            rx.m[2][0] = 0;
            rx.m[2][1] = Math.sin(x);
            rx.m[2][2] = Math.cos(x);
            rx.m[2][3] = 0;
            rx.m[3][0] = 0;
            rx.m[3][1] = 0;
            rx.m[3][2] = 0;
            rx.m[3][3] = 1;
            ry.m[0][0] = Math.cos(y);
            ry.m[0][1] = 0;
            ry.m[0][2] = -Math.sin(y);
            ry.m[0][3] = 0;
            ry.m[1][0] = 0;
            ry.m[1][1] = 1;
            ry.m[1][2] = 0;
            ry.m[1][3] = 0;
            ry.m[2][0] = Math.sin(y);
            ry.m[2][1] = 0;
            ry.m[2][2] = Math.cos(y);
            ry.m[2][3] = 0;
            ry.m[3][0] = 0;
            ry.m[3][1] = 0;
            ry.m[3][2] = 0;
            ry.m[3][3] = 1;
            this.m = rz.mul(ry.mul(rx)).getM();
            return this;
        }
        initScale(x, y, z) {
            this.m[0][0] = x;
            this.m[0][1] = 0;
            this.m[0][2] = 0;
            this.m[0][3] = 0;
            this.m[1][0] = 0;
            this.m[1][1] = y;
            this.m[1][2] = 0;
            this.m[1][3] = 0;
            this.m[2][0] = 0;
            this.m[2][1] = 0;
            this.m[2][2] = z;
            this.m[2][3] = 0;
            this.m[3][0] = 0;
            this.m[3][1] = 0;
            this.m[3][2] = 0;
            this.m[3][3] = 1;
            return this;
        }
        initPerspective(fov = 70, aspectRatio = Display_1.default.getAspectRatio(), zNear = 0.1, zFar = 1000) {
            const tanHalfFOV = Math.tan(fov / 2);
            const zRange = zNear - zFar;
            this.m[0][0] = 1.0 / (tanHalfFOV * aspectRatio);
            this.m[0][1] = 0;
            this.m[0][2] = 0;
            this.m[0][3] = 0;
            this.m[1][0] = 0;
            this.m[1][1] = 1.0 / tanHalfFOV;
            this.m[1][2] = 0;
            this.m[1][3] = 0;
            this.m[2][0] = 0;
            this.m[2][1] = 0;
            this.m[2][2] = (-zNear - zFar) / zRange;
            this.m[2][3] = 2 * zFar * zNear / zRange;
            this.m[3][0] = 0;
            this.m[3][1] = 0;
            this.m[3][2] = 1;
            this.m[3][3] = 0;
            return this;
        }
        initOrthographic(left, right, bottom, top, near, far) {
            const width = right - left;
            const height = top - bottom;
            const depth = far - near;
            this.m[0][0] = 2 / width;
            this.m[0][1] = 0;
            this.m[0][2] = 0;
            this.m[0][3] = -(right + left) / width;
            this.m[1][0] = 0;
            this.m[1][1] = 2 / height;
            this.m[1][2] = 0;
            this.m[1][3] = -(top + bottom) / height;
            this.m[2][0] = 0;
            this.m[2][1] = 0;
            this.m[2][2] = -2 / depth;
            this.m[2][3] = -(far + near) / depth;
            this.m[3][0] = 0;
            this.m[3][1] = 0;
            this.m[3][2] = 0;
            this.m[3][3] = 1;
            return this;
        }
        initRotationFU(forward, up) {
            const f = forward.normalized();
            let r = up.normalized();
            r = r.cross(f);
            const u = f.cross(r);
            return this.initRotationFUR(f, u, r);
        }
        initRotationFUR(forward, up, right) {
            const f = forward;
            const r = right;
            const u = up;
            this.m[0][0] = r.getX();
            this.m[0][1] = r.getY();
            this.m[0][2] = r.getZ();
            this.m[0][3] = 0;
            this.m[1][0] = u.getX();
            this.m[1][1] = u.getY();
            this.m[1][2] = u.getZ();
            this.m[1][3] = 0;
            this.m[2][0] = f.getX();
            this.m[2][1] = f.getY();
            this.m[2][2] = f.getZ();
            this.m[2][3] = 0;
            this.m[3][0] = 0;
            this.m[3][1] = 0;
            this.m[3][2] = 0;
            this.m[3][3] = 1;
            return this;
        }
        transform(r) {
            return new Vector3f_3.default(this.m[0][0] * r.getX() + this.m[0][1] * r.getY() + this.m[0][2] * r.getZ() + this.m[0][3], this.m[1][0] * r.getX() + this.m[1][1] * r.getY() + this.m[1][2] * r.getZ() + this.m[1][3], this.m[2][0] * r.getX() + this.m[2][1] * r.getY() + this.m[2][2] * r.getZ() + this.m[2][3]);
        }
        mul(r) {
            const res = new Matrix4f();
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    res.set(i, j, this.m[i][0] * r.get(0, j) +
                        this.m[i][1] * r.get(1, j) +
                        this.m[i][2] * r.get(2, j) +
                        this.m[i][3] * r.get(3, j));
                }
            }
            return res;
        }
        getMFloatArray() {
            const result = new Array();
            for (let i = 0; i < 4; i++)
                for (let j = 0; j < 4; j++)
                    result.push(this.m[i][j]);
            return new Float32Array(result);
        }
        getM() {
            const res = [][4];
            for (let i = 0; i < 4; i++)
                for (let j = 0; j < 4; j++)
                    res[i][j] = this.m[i][j];
            return res;
        }
        get(x, y) {
            return this.m[x][y];
        }
        setM(m) {
            this.m = m;
        }
        set(x, y, value) {
            this.m[x][y] = value;
        }
    }
    exports.default = Matrix4f;
});
define("engine/core/Transform", ["require", "exports", "engine/math/Matrix4f", "engine/math/Vector3f", "engine/math/Quaternion"], function (require, exports, Matrix4f_2, Vector3f_4, Quaternion_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Transform {
        constructor() {
            this.m_pos = new Vector3f_4.default(0, 0, 0);
            this.m_rot = new Quaternion_1.default().initNum(0, 0, 0, 1);
            this.m_scale = new Vector3f_4.default(1, 1, 1);
            this.m_parentMatrix = new Matrix4f_2.default().initIdentity();
        }
        update() {
            if (this.m_oldPos != null) {
                this.m_oldPos.setVec(this.m_pos);
                this.m_oldRot.setQuat(this.m_rot);
                this.m_oldScale.setVec(this.m_scale);
            }
            else {
                this.m_oldPos = new Vector3f_4.default(0, 0, 0).setVec(this.m_pos).addNum(1.0);
                this.m_oldRot = new Quaternion_1.default().initNum(0, 0, 0, 0).setQuat(this.m_rot).mulNum(0.5);
                this.m_oldScale = new Vector3f_4.default(0, 0, 0).setVec(this.m_scale).addNum(1.0);
            }
        }
        rotate(axis, angle) {
            this.m_rot = new Quaternion_1.default().initVecAngle(axis, angle).mulQuat(this.m_rot).normalized();
        }
        lookAt(point, up) {
            this.m_rot = this.getLookAtRotation(point, up);
        }
        getLookAtRotation(point, up) {
            return new Quaternion_1.default().initMat(new Matrix4f_2.default().initRotationFU(point.subVec(this.m_pos).normalized(), up));
        }
        hasChanged() {
            if (this.m_parent != null && this.m_parent.hasChanged())
                return true;
            if (!this.m_pos.equals(this.m_oldPos))
                return true;
            if (!this.m_rot.equals(this.m_oldRot))
                return true;
            if (!this.m_scale.equals(this.m_oldScale))
                return true;
            return false;
        }
        getTransformation() {
            const translationMatrix = new Matrix4f_2.default().initTranslation(this.m_pos.getX(), this.m_pos.getY(), this.m_pos.getZ());
            const rotationMatrix = this.m_rot.toRotationMatrix();
            const scaleMatrix = new Matrix4f_2.default().initScale(this.m_scale.getX(), this.m_scale.getY(), this.m_scale.getZ());
            return this.getParentMatrix().mul(translationMatrix.mul(rotationMatrix.mul(scaleMatrix)));
        }
        getParentMatrix() {
            if (this.m_parent != null && this.m_parent.hasChanged())
                this.m_parentMatrix = this.m_parent.getTransformation();
            return this.m_parentMatrix;
        }
        setParent(parent) {
            this.m_parent = parent;
        }
        getTransformedPos() {
            return this.getParentMatrix().transform(this.m_pos);
        }
        getTransformedRot() {
            let parentRotation = new Quaternion_1.default().initNum(0, 0, 0, 1);
            if (this.m_parent != null)
                parentRotation = this.m_parent.getTransformedRot();
            return parentRotation.mulQuat(this.m_rot);
        }
        getPos() {
            return this.m_pos;
        }
        setPos(pos) {
            this.m_pos = pos;
        }
        getRot() {
            return this.m_rot;
        }
        setRot(rotation) {
            this.m_rot = rotation;
        }
        getScale() {
            return this.m_scale;
        }
        setScale(scale) {
            this.m_scale = scale;
        }
    }
    exports.default = Transform;
});
define("engine/core/resourceManagment/MappedValues", ["require", "exports", "engine/math/Vector3f"], function (require, exports, Vector3f_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MappedValues {
        constructor() {
            this.m_vector3fHashMap = new Map();
            this.m_floatHashMap = new Map();
        }
        addVector3f(name, vector3f) { this.m_vector3fHashMap.set(name, vector3f); }
        addFloat(name, floatValue) { this.m_floatHashMap.set(name, floatValue); }
        getVector3f(name) {
            const result = this.m_vector3fHashMap.get(name);
            if (result != undefined)
                return result;
            return new Vector3f_5.default(0, 0, 0);
        }
        getFloat(name) {
            const result = this.m_floatHashMap.get(name);
            if (result != undefined)
                return result;
            return 0;
        }
    }
    exports.default = MappedValues;
});
define("engine/core/resourceManagment/ShaderResource", ["require", "exports", "engine/core/Display"], function (require, exports, Display_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ShaderResource {
        constructor() {
            this.m_program = Display_2.default.gl.createProgram();
            this.m_refCount = 1;
            if (this.m_program == 0) {
                throw new Error("Shader creation failed: Could not find valid memory location in constructor");
            }
            this.m_uniforms = new Map();
            this.m_uniformNames = new Array();
            this.m_uniformTypes = new Array();
        }
        finalize() {
        }
        addReference() {
            this.m_refCount++;
        }
        removeReference() {
            this.m_refCount--;
            return this.m_refCount == 0;
        }
        getProgram() { return this.m_program; }
        getUniforms() { return this.m_uniforms; }
        getUniformNames() { return this.m_uniformNames; }
        getUniformTypes() { return this.m_uniformTypes; }
    }
    exports.default = ShaderResource;
});
define("engine/core/resourceManagment/TextureResource", ["require", "exports", "engine/core/Display"], function (require, exports, Display_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TextureResource {
        constructor() {
            this.m_id = Display_3.default.gl.createTexture();
            this.m_refCount = 1;
        }
        finalize() {
        }
        addReference() {
            this.m_refCount++;
        }
        removeReference() {
            this.m_refCount--;
            return this.m_refCount == 0;
        }
        getId() { return this.m_id; }
    }
    exports.default = TextureResource;
});
define("engine/core/resourceManagment/loaders/ResourcesLoader", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ResourcesLoader {
        static loadModels(models) {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.all(models.map(url => fetch(ResourcesLoader.URL + url).then(resp => resp.text()))).then((mData) => {
                    let key;
                    for (let i = 0; i < mData.length; i++) {
                        key = models[i].split("/")[1];
                        ResourcesLoader.modelsData.set(key, mData[i]);
                    }
                    return true;
                })
                    .catch(error => {
                    return false;
                });
            });
        }
        static loadShaders(shaders) {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.all(shaders.map(url => fetch(ResourcesLoader.URL + url).then(resp => resp.text()))).then(sData => {
                    let key;
                    for (let i = 0; i < sData.length; i++) {
                        key = shaders[i].split("/")[1];
                        ResourcesLoader.shadersData.set(key, sData[i]);
                    }
                    return true;
                })
                    .catch(error => {
                    return false;
                });
            });
        }
        static loadTextures(textures) {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.all(textures.map(url => fetch(ResourcesLoader.URL + url).then(resp => resp.blob()))).then(tData => {
                    let key;
                    for (let i = 0; i < tData.length; i++) {
                        key = textures[i].split("/")[1];
                        ResourcesLoader.texturesData.set(key, tData[i]);
                    }
                    return true;
                });
            });
        }
        static loadResources(json) {
            return __awaiter(this, void 0, void 0, function* () {
                let models = Array();
                let shaders = Array();
                let textures = Array();
                for (let i = 0; i < json.models.files.length; i++) {
                    models.push(json.models.path + json.models.files[i]);
                }
                for (let i = 0; i < json.shaders.files.length; i++) {
                    shaders.push(json.shaders.path + json.shaders.files[i]);
                }
                for (let i = 0; i < json.textures.files.length; i++) {
                    textures.push(json.textures.path + json.textures.files[i]);
                }
                return ResourcesLoader.loadModels(models)
                    .then((res) => {
                    return ResourcesLoader.loadShaders(shaders);
                })
                    .then(res => {
                    return ResourcesLoader.loadTextures(textures);
                });
            });
        }
    }
    ResourcesLoader.URL = "resources/";
    ResourcesLoader.modelsData = new Map();
    ResourcesLoader.shadersData = new Map();
    ResourcesLoader.texturesData = new Map();
    exports.default = ResourcesLoader;
});
define("engine/rendering/Texture", ["require", "exports", "engine/core/resourceManagment/TextureResource", "engine/core/resourceManagment/loaders/ResourcesLoader", "engine/core/Display"], function (require, exports, TextureResource_1, ResourcesLoader_1, Display_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Texture {
        constructor(fileName) {
            this.gl = Display_4.default.gl;
            this.m_fileName = fileName;
            const oldResource = Texture.s_loadedTextures.get(fileName);
            if (oldResource !== undefined) {
                this.m_resource = oldResource;
                this.m_resource.addReference();
            }
            else {
                this.m_resource = this.getTexture(fileName);
                if (this.m_resource === undefined) {
                    throw new Error("Error no texture found: " + fileName);
                }
                Texture.s_loadedTextures.set(fileName, this.m_resource);
            }
        }
        finalize() {
            if (this.m_resource === undefined)
                return;
            if (this.m_resource.removeReference() && this.m_fileName !== "") {
                Texture.s_loadedTextures.delete(this.m_fileName);
            }
        }
        bind() {
            this.bindNum(0);
        }
        bindNum(samplerSlot) {
        }
        getID() {
            if (this.m_resource === undefined)
                return null;
            return this.m_resource.getId();
        }
        getTexture(fileName) {
            const textureData = ResourcesLoader_1.default.texturesData.get(fileName);
            const imgElem = document.createElement("img");
            imgElem.src = window.URL.createObjectURL(textureData);
            let canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");
            if (context === null) {
                throw new Error("Error generating image data");
            }
            context.drawImage(imgElem, 0, 0);
            const imageData = context.getImageData(0, 0, 512, 512);
            const resource = new TextureResource_1.default();
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, resource.getId());
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageData);
            return resource;
        }
    }
    Texture.s_loadedTextures = new Map();
    exports.default = Texture;
});
define("engine/rendering/Material", ["require", "exports", "engine/rendering/Texture", "engine/rendering/Shader", "engine/math/Vector3f"], function (require, exports, Texture_1, Shader_1, Vector3f_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Material {
        constructor(texture = new Texture_1.default("UV_Grid.jpg"), shader = new Shader_1.default("basic")) {
            this.m_color = new Vector3f_6.default(1, 1, 1);
            this.m_texture = texture;
            this.m_shader = shader;
        }
        getTexture() {
            return this.m_texture;
        }
        getShader() {
            return this.m_shader;
        }
        getColor() {
            return this.m_color;
        }
    }
    exports.default = Material;
});
define("engine/core/resourceManagment/loaders/TextFileReader", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TextFileReader {
        constructor(textFile) {
            this.lineCounter = -1;
            this.lines = textFile.split("\n");
        }
        readLine() {
            if (this.lineCounter >= this.lines.length - 1) {
                return false;
            }
            else {
                this.lineCounter++;
                return true;
            }
        }
        getLine() {
            return this.lines[this.lineCounter];
        }
    }
    exports.default = TextFileReader;
});
define("engine/rendering/Shader", ["require", "exports", "engine/core/Display", "engine/core/resourceManagment/loaders/ResourcesLoader"], function (require, exports, Display_5, ResourcesLoader_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Shader {
        constructor(fileName) {
            this.gl = Display_5.default.gl;
            this.program = this.gl.createProgram();
            this.uniforms = new Map();
            if (this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
                throw new Error("Error memory valid location not valid!");
            }
            const vertexShaderData = ResourcesLoader_2.default.shadersData.get(fileName + "Vertex.glsl");
            const fragmentShaderData = ResourcesLoader_2.default.shadersData.get(fileName + "Fragment.glsl");
            if (!vertexShaderData || !fragmentShaderData) {
                throw new Error("No shader found: " + fileName);
            }
            this.loadShaders(vertexShaderData, fragmentShaderData);
            this.addUniform("worldMatrix");
            this.addUniform("baseColor");
            this.addUniform("sampled");
        }
        bind() {
            this.gl.useProgram(this.program);
        }
        loadShaders(vertexShader, fragShader) {
            const gl = this.gl;
            this.addProgram(vertexShader, gl.VERTEX_SHADER);
            this.addProgram(fragShader, gl.FRAGMENT_SHADER);
            gl.linkProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                throw new Error("Error compile program link status");
            }
            gl.validateProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
                throw new Error("Error compile program validate status");
            }
        }
        addUniform(uniformName) {
            this.uniforms.set(uniformName, this.gl.getUniformLocation(this.program, uniformName));
        }
        addProgram(source, type) {
            const gl = this.gl;
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error("Error compiling shader program: \n" + source);
            }
            gl.attachShader(this.program, shader);
        }
        update(transform, material, renderingEngine) {
            this.setUniform("worldMatrix", transform.getTransformation());
            this.setUniformVec("baseColor", material.getColor());
            this.bind();
        }
        getProgram() {
            return this.program;
        }
        setUniformi(uniformName, value) {
            this.gl.uniform1i(this.uniforms.get(uniformName), value);
        }
        setUniformf(uniformName, value) {
            this.gl.uniform1f(this.uniforms.get(uniformName), value);
        }
        setUniformVec(uniformName, value) {
            this.gl.uniform3f(this.uniforms.get(uniformName), value.getX(), value.getY(), value.getZ());
        }
        setUniform(uniformName, value) {
            const uniformN = this.uniforms.get(uniformName);
            this.gl.uniformMatrix4fv(uniformN, false, value.getMFloatArray());
        }
    }
    exports.default = Shader;
    var ShaderType;
    (function (ShaderType) {
        ShaderType["BASIC"] = "basic";
        ShaderType["PHONG"] = "phong";
        ShaderType["CUSTOM"] = "custom";
    })(ShaderType = exports.ShaderType || (exports.ShaderType = {}));
});
define("engine/rendering/RenderingEngine", ["require", "exports", "engine/core/Display", "engine/math/Vector3f", "engine/core/resourceManagment/MappedValues", "engine/rendering/Shader"], function (require, exports, Display_6, Vector3f_7, MappedValues_1, Shader_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RenderingEngine extends MappedValues_1.default {
        constructor() {
            super();
            this.gl = Display_6.default.gl;
            this.m_samplerMap = new Map();
            this.m_samplerMap.set("diffuse", 0);
            this.m_samplerMap.set("normalMap", 1);
            this.m_samplerMap.set("dispMap", 2);
            this.addVector3f("ambient", new Vector3f_7.default(0.1, 0.1, 0.1));
            this.m_ambientShader = new Shader_2.default("ambient");
            this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
            this.gl.frontFace(this.gl.CW);
            this.gl.cullFace(this.gl.BACK);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.enable(this.gl.DEPTH_TEST);
        }
        render(object) {
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
            this.gl.depthFunc(this.gl.LESS);
            this.gl.depthMask(true);
            this.gl.disable(this.gl.BLEND);
        }
        static getOpenGLVersion() {
            const gl = Display_6.default.gl;
            return gl.getParameter(gl.VERSION);
        }
        addCamera(camera) {
            this.m_mainCamera = camera;
        }
        getSamplerSlot(samplerName) {
            return this.m_samplerMap.get(samplerName);
        }
        getMainCamera() {
            return this.m_mainCamera;
        }
        setMainCamera(mainCamera) {
            this.m_mainCamera = mainCamera;
        }
    }
    exports.default = RenderingEngine;
});
define("engine/core/Game", ["require", "exports", "engine/core/GameObject"], function (require, exports, GameObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        init() { console.log("inisf"); }
        input(delta) {
            this.getRootObject().inputAll(delta);
        }
        update(delta) {
            this.getRootObject().updateAll(delta);
        }
        render(renderingEngine) {
            renderingEngine.render(this.getRootObject());
        }
        addObject(object) {
            this.getRootObject().addChild(object);
        }
        getRootObject() {
            if (this.m_root == null)
                this.m_root = new GameObject_1.default();
            return this.m_root;
        }
        setEngine(engine) { this.getRootObject().setEngine(engine); }
    }
    exports.default = Game;
});
define("engine/core/Time", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Time {
        static getTime() {
            return Date.now();
        }
        static getDelta() {
            return Time.delta;
        }
        static setDelta(delta) {
            Time.delta = delta;
        }
    }
    Time.SECOND = 1000;
    Time.delta = 0;
    exports.default = Time;
});
define("engine/input/Keyboard", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Keyboard {
        static create() {
            window.onkeyup = function (e) {
                Keyboard.keys[e.keyCode] = false;
            };
            window.onkeydown = function (e) {
                Keyboard.keys[e.keyCode] = true;
            };
        }
        static isKeyDown(keyCode) {
            return Keyboard.keys[keyCode] === true;
        }
    }
    Keyboard.LEFT = 37;
    Keyboard.UP = 38;
    Keyboard.RIGHT = 39;
    Keyboard.DOWN = 40;
    Keyboard.W = 87;
    Keyboard.A = 65;
    Keyboard.S = 83;
    Keyboard.D = 68;
    Keyboard.SPACE = 32;
    Keyboard.ESCAPE = 27;
    Keyboard.NUM_KEYCODES = 9;
    Keyboard.keys = [];
    exports.default = Keyboard;
});
define("engine/input/Mouse", ["require", "exports", "engine/math/Vector2f", "engine/core/Display"], function (require, exports, Vector2f_3, Display_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mouse {
        static create() {
            Display_7.default.canvas.onmousedown = function (e) {
                Mouse.buttons[e.button] = true;
            };
            Display_7.default.canvas.onmouseup = function (e) {
                Mouse.buttons[e.button] = false;
            };
        }
        static moveCallback(e) {
            let x = Mouse.currentPosition.getX();
            let y = Mouse.currentPosition.getY();
            let x1 = -e.movementX;
            let y1 = -e.movementY;
            if (x === x1 && y === y1) {
                Mouse.currentPosition.setX(0);
                Mouse.currentPosition.setY(0);
            }
            else {
                Mouse.currentPosition.setX(x1);
                Mouse.currentPosition.setY(y1);
            }
        }
        static isButtonDown(buttonCode) {
            return Mouse.buttons[buttonCode] === true;
        }
        static getX() {
            return Mouse.currentPosition.getX();
        }
        static getY() {
            return Mouse.currentPosition.getY();
        }
        static setMouseLock(lock) {
            Mouse.isLocked = lock;
            if (!lock) {
                Display_7.default.canvas.removeEventListener("mousemove", Mouse.moveCallback);
            }
            else {
                Display_7.default.canvas.addEventListener("mousemove", Mouse.moveCallback);
            }
        }
    }
    Mouse.FIRE = 0;
    Mouse.MIDDLE = 1;
    Mouse.RIGHT = 2;
    Mouse.NUM_MOUSE_BUTTONS = 3;
    Mouse.currentPosition = new Vector2f_3.default();
    Mouse.previousPosition = new Vector2f_3.default();
    Mouse.buttons = [];
    Mouse.sensitivity = 0.3;
    Mouse.isLocked = false;
    exports.default = Mouse;
});
define("engine/input/Input", ["require", "exports", "engine/math/Vector2f", "engine/input/Keyboard", "engine/input/Mouse"], function (require, exports, Vector2f_4, Keyboard_1, Mouse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Input {
        static update() {
            for (let i = 0; i < Keyboard_1.default.NUM_KEYCODES; i++) {
                Input.lastKeys[i] = Input.getKey(i);
            }
            for (let i = 0; i < Mouse_1.default.NUM_MOUSE_BUTTONS; i++) {
                Input.lastMouse[i] = Input.getMouse(i);
            }
        }
        static getKey(keyCode) {
            return Keyboard_1.default.isKeyDown(keyCode);
        }
        static getKeyDown(keyCode) {
            return Input.getKey(keyCode) && !Input.lastKeys[keyCode];
        }
        static getKeyUp(keyCode) {
            return !Input.getKey(keyCode) && Input.lastKeys[keyCode];
        }
        static getMouse(mouseButton) {
            return Mouse_1.default.isButtonDown(mouseButton);
        }
        static getMouseDown(mouseButton) {
            return Input.getMouse(mouseButton) && !Input.lastMouse[mouseButton];
        }
        static getMouseUp(mouseButton) {
            return !Input.getMouse(mouseButton) && Input.lastMouse[mouseButton];
        }
        static getMouseLock() {
            return Mouse_1.default.isLocked;
        }
        static getMousePosition() {
            let res;
            Input.previousDeltaPos = Input.currentDeltaPos;
            Input.currentDeltaPos = new Vector2f_4.default(Mouse_1.default.getX(), Mouse_1.default.getY());
            if (Input.previousDeltaPos.equals(Input.currentDeltaPos)) {
                res = new Vector2f_4.default(0, 0);
            }
            else {
                res = Input.currentDeltaPos;
            }
            return res;
        }
    }
    Input.lastKeys = new Array(Keyboard_1.default.NUM_KEYCODES);
    Input.lastMouse = new Array(Mouse_1.default.NUM_MOUSE_BUTTONS);
    Input.currentDeltaPos = new Vector2f_4.default();
    Input.previousDeltaPos = new Vector2f_4.default();
    exports.default = Input;
});
define("engine/core/CoreEngine", ["require", "exports", "engine/rendering/RenderingEngine", "engine/core/Time", "engine/input/Input", "engine/input/Keyboard"], function (require, exports, RenderingEngine_1, Time_1, Input_1, Keyboard_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CoreEngine {
        constructor(display, game) {
            this.m_isRunning = false;
            this.m_width = display.getWidth();
            this.m_height = display.getHeight();
            this.m_frameTime = 1.0 / display.getFrameRate();
            this.m_game = game;
            game.setEngine(this);
            this.m_renderingEngine = new RenderingEngine_1.default();
        }
        createRendering(title) {
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
            this.m_game.init();
            let instance = this;
            let lastTime = Time_1.default.getTime();
            let unprocessedTime = 0;
            let loop = function (e) {
                let render = false;
                let startTime = Time_1.default.getTime();
                let passedTime = startTime - lastTime;
                lastTime = startTime;
                unprocessedTime += (passedTime / Time_1.default.SECOND);
                frameCounter += passedTime;
                while (unprocessedTime > instance.m_frameTime) {
                    render = true;
                    unprocessedTime -= instance.m_frameTime;
                    if (!instance.m_isRunning) {
                        window.clearInterval(interID);
                    }
                    Time_1.default.setDelta(instance.m_frameTime);
                    instance.m_game.input(Time_1.default.getDelta());
                    Input_1.default.update();
                    instance.m_game.update(Time_1.default.getDelta());
                    if (Input_1.default.getKey(Keyboard_2.default.ESCAPE)) {
                        instance.stop();
                    }
                    if (frameCounter >= Time_1.default.SECOND) {
                        frames = 0;
                        frameCounter = 0;
                    }
                }
                if (render) {
                    instance.m_game.render(instance.m_renderingEngine);
                    frames++;
                }
            };
            let interID = window.setInterval(loop, 1);
        }
        cleanUp() {
        }
        getRenderingEngine() {
            return this.m_renderingEngine;
        }
    }
    exports.default = CoreEngine;
});
define("engine/core/GameObject", ["require", "exports", "engine/core/Transform"], function (require, exports, Transform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GameObject {
        constructor(name = "root") {
            this.m_children = new Array();
            this.m_components = new Array();
            this.m_transform = new Transform_1.default();
            this.m_name = name;
            this.m_engine = null;
        }
        addChild(child) {
            this.m_children.push(child);
            child.setEngine(this.m_engine);
            child.getTransform().setParent(this.m_transform);
            return this;
        }
        addComponent(component) {
            this.m_components.push(component);
            component.setParent(this);
            return this;
        }
        inputAll(delta) {
            this.input(delta);
            for (let i = 0; i < this.m_children.length; i++) {
                this.m_children[i].inputAll(delta);
            }
        }
        updateAll(delta) {
            this.update(delta);
            for (let i = 0; i < this.m_children.length; i++) {
                this.m_children[i].updateAll(delta);
            }
        }
        renderAll(shader, renderingEngine) {
            this.render(shader, renderingEngine);
            for (let i = 0; i < this.m_children.length; i++) {
                this.m_children[i].renderAll(shader, renderingEngine);
            }
        }
        input(delta) {
            this.m_transform.update();
            for (let i = 0; i < this.m_components.length; i++) {
                this.m_components[i].input(delta);
            }
        }
        update(delta) {
            for (let i = 0; i < this.m_components.length; i++) {
                this.m_components[i].update(delta);
            }
        }
        render(shader, renderingEngine) {
            for (let i = 0; i < this.m_components.length; i++) {
                this.m_components[i].render(shader, renderingEngine);
            }
        }
        getAllAttached() {
            const result = new Array();
            for (let i = 0; i < this.m_children.length; i++) {
                result.concat(this.m_children[i].getAllAttached());
            }
            result.push(this);
            return result;
        }
        getTransform() {
            return this.m_transform;
        }
        setEngine(engine) {
            if (this.m_engine !== engine && engine !== null) {
                this.m_engine = engine;
                for (let i = 0; i < this.m_components.length; i++) {
                    this.m_components[i].addToEngine(engine);
                }
                for (let i = 0; i < this.m_children.length; i++) {
                    this.m_children[i].setEngine(engine);
                }
            }
        }
    }
    exports.default = GameObject;
});
define("engine/components/GameComponent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GameComponent {
        input(delta) { }
        update(delta) { }
        render(shader, renderingEngine) { }
        setParent(parent) {
            this.m_parent = parent;
        }
        getTransform() {
            return this.m_parent.getTransform();
        }
        addToEngine(engine) { }
    }
    exports.default = GameComponent;
});
define("engine/components/Camera3D", ["require", "exports", "engine/math/Matrix4f", "engine/components/GameComponent"], function (require, exports, Matrix4f_3, GameComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Camera3D extends GameComponent_1.default {
        constructor(projection) {
            super();
            this.m_projection = projection;
        }
        getViewProjection() {
            const cameraRotation = this.getTransform().getTransformedRot().conjugate().toRotationMatrix();
            const cameraPos = this.getTransform().getTransformedPos().mulNum(-1);
            const cameraTranslation = new Matrix4f_3.default().initTranslation(cameraPos.getX(), cameraPos.getY(), cameraPos.getZ());
            console.log("perps");
            return this.m_projection.mul(cameraRotation.mul(cameraTranslation));
        }
        addToEngine(engine) {
            engine.getRenderingEngine().addCamera(this);
        }
    }
    exports.default = Camera3D;
});
define("engine/components/FreeLook", ["require", "exports", "engine/components/GameComponent", "engine/math/Vector3f", "engine/math/Vector2f", "engine/core/Display", "engine/core/Util", "engine/input/Input", "engine/input/Keyboard"], function (require, exports, GameComponent_2, Vector3f_8, Vector2f_5, Display_8, Util_3, Input_2, Keyboard_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FreeLook extends GameComponent_2.default {
        constructor(sensitivity) {
            super();
            this.m_mouseLocked = false;
            this.init(sensitivity, Keyboard_3.default.ESCAPE);
        }
        init(sensitivity, unlockMouseKey) {
            this.m_sensitivity = sensitivity;
            this.m_unlockMouseKey = unlockMouseKey;
        }
        Input(delta) {
            const centerPosition = new Vector2f_5.default(Display_8.default.getWidth() / 2, Display_8.default.getHeight() / 2);
            if (Input_2.default.getKey(this.m_unlockMouseKey)) {
                this.m_mouseLocked = false;
            }
            if (Input_2.default.getMouseDown(0)) {
                this.m_mouseLocked = true;
            }
            if (this.m_mouseLocked) {
                const deltaPos = Input_2.default.getMousePosition().subVec(centerPosition);
                const rotY = deltaPos.getX() != 0;
                const rotX = deltaPos.getY() != 0;
                if (rotY)
                    this.getTransform().rotate(FreeLook.Y_AXIS, Util_3.default.toRadians(deltaPos.getX() * this.m_sensitivity));
                if (rotX)
                    this.getTransform().rotate(this.getTransform().getRot().getRight(), Util_3.default.toRadians(-deltaPos.getY() * this.m_sensitivity));
            }
        }
    }
    FreeLook.Y_AXIS = new Vector3f_8.default(0, 1, 0);
    exports.default = FreeLook;
});
define("engine/components/FreeMove", ["require", "exports", "engine/components/GameComponent", "engine/input/Keyboard", "engine/input/Input"], function (require, exports, GameComponent_3, Keyboard_4, Input_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FreeMove extends GameComponent_3.default {
        constructor(speed) {
            super();
            this.init(speed, Keyboard_4.default.W, Keyboard_4.default.S, Keyboard_4.default.A, Keyboard_4.default.D);
        }
        init(speed, forwardKey, backKey, leftKey, rightKey) {
            this.m_speed = speed;
            this.m_forwardKey = forwardKey;
            this.m_backKey = backKey;
            this.m_leftKey = leftKey;
            this.m_rightKey = rightKey;
        }
        input(delta) {
            const movAmt = this.m_speed * delta;
            if (Input_3.default.getKey(this.m_forwardKey))
                this.move(this.getTransform().getRot().getForward(), movAmt);
            if (Input_3.default.getKey(this.m_backKey))
                this.move(this.getTransform().getRot().getForward(), -movAmt);
            if (Input_3.default.getKey(this.m_leftKey))
                this.move(this.getTransform().getRot().getLeft(), movAmt);
            if (Input_3.default.getKey(this.m_rightKey))
                this.move(this.getTransform().getRot().getRight(), movAmt);
        }
        move(dir, amt) {
            this.getTransform().setPos(this.getTransform().getPos().addVec(dir.mulNum(amt)));
        }
    }
    exports.default = FreeMove;
});
define("engine/core/resourceManagment/MeshResource", ["require", "exports", "engine/core/Display"], function (require, exports, Display_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MeshResource {
        constructor(size) {
            this.gl = Display_9.default.gl;
            this.m_indexCount = 0;
            this.m_vbo = this.gl.createBuffer();
            this.m_ibo = this.gl.createBuffer();
            this.m_size = size;
            this.m_refCount = 1;
        }
        finalize() {
            this.gl.deleteBuffer(this.m_vbo);
            this.gl.deleteBuffer(this.m_ibo);
        }
        addReference() {
            this.m_refCount++;
        }
        removeReference() {
            this.m_refCount--;
            return this.m_refCount == 0;
        }
        getVbo() { return this.m_vbo; }
        getIbo() { return this.m_ibo; }
        getSize() { return this.m_size; }
    }
    exports.default = MeshResource;
});
define("engine/core/resourceManagment/loaders/OBJIndex", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OBJIndex {
        getVertexIndex() { return this.m_vertexIndex; }
        getTexCoordIndex() { return this.m_texCoordIndex; }
        getNormalIndex() { return this.m_normalIndex; }
        setVertexIndex(val) { this.m_vertexIndex = val; }
        setTexCoordIndex(val) { this.m_texCoordIndex = val; }
        setNormalIndex(val) { this.m_normalIndex = val; }
        equals(obj) {
            const index = obj;
            return this.m_vertexIndex == index.m_vertexIndex
                && this.m_texCoordIndex == index.m_texCoordIndex
                && this.m_normalIndex == index.m_normalIndex;
        }
        hashCode() {
            const BASE = 17;
            const MULTIPLIER = 31;
            let result = BASE;
            result = MULTIPLIER * result + this.m_vertexIndex;
            result = MULTIPLIER * result + this.m_texCoordIndex;
            result = MULTIPLIER * result + this.m_normalIndex;
            return result;
        }
    }
    exports.default = OBJIndex;
});
define("engine/core/resourceManagment/loaders/IndexedModel", ["require", "exports", "engine/math/Vector3f"], function (require, exports, Vector3f_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IndexedModel {
        constructor() {
            this.m_positions = new Array();
            this.m_texCoords = new Array();
            this.m_normals = new Array();
            this.m_tangents = new Array();
            this.m_indices = new Array();
        }
        calcNormals() {
            for (let i = 0; i < this.m_indices.length; i += 3) {
                const i0 = this.m_indices[i];
                const i1 = this.m_indices[i + 1];
                const i2 = this.m_indices[i + 2];
                const v1 = this.m_positions[i1].subVec(this.m_positions[i0]);
                const v2 = this.m_positions[i2].subVec(this.m_positions[i0]);
                const normal = v1.cross(v2).normalized();
                this.m_normals[i0].setVec(this.m_normals[i0].addVec(normal));
                this.m_normals[i1].setVec(this.m_normals[i1].addVec(normal));
                this.m_normals[i2].setVec(this.m_normals[i2].addVec(normal));
            }
            for (let i = 0; i < this.m_normals.length; i++)
                this.m_normals[i].setVec(this.m_normals[i].normalized());
        }
        calcTangents() {
            for (let i = 0; i < this.m_indices.length; i += 3) {
                const i0 = this.m_indices[i];
                const i1 = this.m_indices[i + 1];
                const i2 = this.m_indices[i + 2];
                const edge1 = this.m_positions[i1].subVec(this.m_positions[i0]);
                const edge2 = this.m_positions[i2].subVec(this.m_positions[i0]);
                const deltaU1 = this.m_texCoords[i1].getX() - this.m_texCoords[i0].getX();
                const deltaV1 = this.m_texCoords[i1].getY() - this.m_texCoords[i0].getY();
                const deltaU2 = this.m_texCoords[i2].getX() - this.m_texCoords[i0].getX();
                const deltaV2 = this.m_texCoords[i2].getY() - this.m_texCoords[i0].getY();
                const dividend = (deltaU1 * deltaV2 - deltaU2 * deltaV1);
                const f = dividend == 0 ? 0.0 : 1.0 / dividend;
                const tangent = new Vector3f_9.default(0, 0, 0);
                tangent.SetX(f * (deltaV2 * edge1.getX() - deltaV1 * edge2.getX()));
                tangent.SetY(f * (deltaV2 * edge1.getY() - deltaV1 * edge2.getY()));
                tangent.SetZ(f * (deltaV2 * edge1.getZ() - deltaV1 * edge2.getZ()));
                this.m_tangents[i0].setVec(this.m_tangents[i0].addVec(tangent));
                this.m_tangents[i1].setVec(this.m_tangents[i1].addVec(tangent));
                this.m_tangents[i2].setVec(this.m_tangents[i2].addVec(tangent));
            }
            for (let i = 0; i < this.m_tangents.length; i++)
                this.m_tangents[i].setVec(this.m_tangents[i].normalized());
        }
        addPosition(pos) { this.m_positions.push(pos); }
        addTexCoords(texCoord) { this.m_texCoords.push(texCoord); }
        addNormals(normal) { this.m_normals.push(normal); }
        addTangents(tan) { this.m_tangents.push(tan); }
        addIndices(index) { this.m_indices.push(index); }
        getPositions() { return this.m_positions; }
        getTexCoords() { return this.m_texCoords; }
        getNormals() { return this.m_normals; }
        getTangents() { return this.m_tangents; }
        getIndices() { return this.m_indices; }
    }
    exports.default = IndexedModel;
});
define("engine/core/resourceManagment/loaders/OBJModel", ["require", "exports", "engine/math/Vector3f", "engine/math/Vector2f", "engine/core/resourceManagment/loaders/OBJIndex", "engine/core/resourceManagment/loaders/TextFileReader", "engine/core/Util", "engine/core/resourceManagment/loaders/IndexedModel", "engine/core/resourceManagment/loaders/ResourcesLoader"], function (require, exports, Vector3f_10, Vector2f_6, OBJIndex_1, TextFileReader_1, Util_4, IndexedModel_1, ResourcesLoader_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OBJModel {
        constructor(fileName) {
            this.m_positions = new Array();
            this.m_texCoords = new Array();
            this.m_normals = new Array();
            this.m_indices = new Array();
            this.m_hasTexCoords = false;
            this.m_hasNormals = false;
            const modelData = ResourcesLoader_3.default.modelsData.get(fileName);
            if (modelData === undefined) {
                throw new Error("No file found: " + fileName);
            }
            let meshReader = new TextFileReader_1.default(modelData);
            while (meshReader.readLine()) {
                let line = meshReader.getLine();
                let tokens = line.split(" ");
                tokens = Util_4.default.RemoveEmptyStrings(tokens);
                if (tokens.length == 0 || tokens[0] === "#")
                    continue;
                else if (tokens[0] === OBJModel.OBJProperties.VERTEX) {
                    this.m_positions.push(new Vector3f_10.default(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])));
                }
                else if (tokens[0] === OBJModel.OBJProperties.UV) {
                    this.m_texCoords.push(new Vector2f_6.default(parseFloat(tokens[1]), 1.0 - parseFloat(tokens[2])));
                }
                else if (tokens[0] === OBJModel.OBJProperties.NORMAL) {
                    this.m_normals.push(new Vector3f_10.default(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])));
                }
                else if (tokens[0] === OBJModel.OBJProperties.FACE) {
                    for (let i = 0; i < tokens.length - 3; i++) {
                        this.m_indices.push(this.parseOBJIndex(tokens[1]));
                        this.m_indices.push(this.parseOBJIndex(tokens[2 + i]));
                        this.m_indices.push(this.parseOBJIndex(tokens[3 + i]));
                    }
                }
            }
        }
        toIndexedModel() {
            const result = new IndexedModel_1.default();
            const normalModel = new IndexedModel_1.default();
            const resultIndexMap = new Map();
            const normalIndexMap = new Map();
            const indexMap = new Map();
            for (let i = 0; i < this.m_indices.length; i++) {
                const currentIndex = this.m_indices[i];
                const currentPosition = this.m_positions[currentIndex.getVertexIndex()];
                let currentTexCoord;
                let currentNormal;
                if (this.m_hasTexCoords)
                    currentTexCoord = this.m_texCoords[currentIndex.getTexCoordIndex()];
                else
                    currentTexCoord = new Vector2f_6.default(0, 0);
                if (this.m_hasNormals)
                    currentNormal = this.m_normals[currentIndex.getNormalIndex()];
                else
                    currentNormal = new Vector3f_10.default(0, 0, 0);
                let modelVertexIndex = resultIndexMap.get(currentIndex);
                if (modelVertexIndex === undefined) {
                    modelVertexIndex = result.getPositions().length;
                    resultIndexMap.set(currentIndex, modelVertexIndex);
                    result.getPositions().push(currentPosition);
                    result.getTexCoords().push(currentTexCoord);
                    if (this.m_hasNormals)
                        result.getNormals().push(currentNormal);
                }
                let normalModelIndex = normalIndexMap[currentIndex.getVertexIndex()];
                if (normalModelIndex === undefined) {
                    normalModelIndex = normalModel.getPositions().length;
                    normalIndexMap.set(currentIndex.getVertexIndex(), normalModelIndex);
                    normalModel.getPositions().push(currentPosition);
                    normalModel.getTexCoords().push(currentTexCoord);
                    normalModel.getNormals().push(currentNormal);
                    normalModel.getTangents().push(new Vector3f_10.default(0, 0, 0));
                }
                indexMap.set(modelVertexIndex, normalModelIndex);
                result.getIndices().push(modelVertexIndex);
                normalModel.getIndices().push(normalModelIndex);
                indexMap.set(modelVertexIndex, normalModelIndex);
            }
            if (!this.m_hasNormals) {
                normalModel.calcNormals();
                for (let i = 0; i < result.getPositions().length; i++)
                    result.getNormals().push(normalModel.getNormals()[indexMap[i]]);
            }
            normalModel.calcTangents();
            for (let i = 0; i < result.getPositions().length; i++) {
                const res = normalModel.getTangents()[indexMap.get(i)];
                result.getTangents().push(res);
            }
            return result;
        }
        parseOBJIndex(token) {
            const values = token.split("/");
            const result = new OBJIndex_1.default();
            result.setVertexIndex(parseInt(values[0]) - 1);
            if (values.length > 1) {
                if (!(values[1] === "")) {
                    this.m_hasTexCoords = true;
                    result.setTexCoordIndex(parseInt(values[1]) - 1);
                }
                if (values.length > 2) {
                    this.m_hasNormals = true;
                    result.setNormalIndex(parseInt(values[2]) - 1);
                }
            }
            return result;
        }
    }
    OBJModel.OBJProperties = {
        VERTEX: "v",
        UV: "vt",
        NORMAL: "vn",
        FACE: "f",
        SMOOTH: "s",
        GROUP: "g",
        MAT: "usemtl"
    };
    exports.default = OBJModel;
});
define("engine/rendering/Mesh", ["require", "exports", "engine/core/Display", "engine/core/Vertex", "engine/core/resourceManagment/loaders/OBJModel"], function (require, exports, Display_10, Vertex_2, OBJModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mesh {
        constructor(fileName = "cube.obj") {
            this.gl = Display_10.default.gl;
            this.m_indexCount = 0;
            this.loadMesh(fileName);
        }
        init(program) {
            const vertexAttributeLocation = this.gl.getAttribLocation(program, "a_position");
            const texCoordAttributeLocation = this.gl.getAttribLocation(program, "a_texcoord");
            const normalAttributeLocation = this.gl.getAttribLocation(program, "a_normal");
            const ibo = this.gl.createBuffer();
            this.m_indexCount = this.m_indices.length;
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.m_indices, this.gl.STATIC_DRAW);
            const vbo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.m_vertices, this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(vertexAttributeLocation);
            this.gl.vertexAttribPointer(vertexAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
            const UVbo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, UVbo);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.m_uvs, this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(texCoordAttributeLocation);
            this.gl.vertexAttribPointer(texCoordAttributeLocation, 2, this.gl.FLOAT, true, 0, 0);
            console.log(normalAttributeLocation);
            const nbo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, nbo);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.m_normals, this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(normalAttributeLocation);
            this.gl.vertexAttribPointer(normalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
            this.m_vao = this.gl.createVertexArray();
            this.gl.bindVertexArray(this.m_vao);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
            this.gl.enableVertexAttribArray(vertexAttributeLocation);
            this.gl.vertexAttribPointer(vertexAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, UVbo);
            this.gl.enableVertexAttribArray(texCoordAttributeLocation);
            this.gl.vertexAttribPointer(texCoordAttributeLocation, 2, this.gl.FLOAT, true, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, nbo);
            this.gl.enableVertexAttribArray(normalAttributeLocation);
            this.gl.vertexAttribPointer(normalAttributeLocation, 3, this.gl.HALF_FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
            this.gl.bindVertexArray(null);
        }
        addVertices(vertices, indices, calcNormals) {
            if (calcNormals) {
                this.calcNormals(vertices, indices);
            }
            const verts = new Array();
            const norms = new Array();
            const uvs = new Array();
            const tans = new Array();
            let vrt;
            for (let i = 0; i < indices.length; i++) {
                vrt = vertices[indices[i]];
                verts.push(vrt.getPos().getX());
                verts.push(vrt.getPos().getY());
                verts.push(vrt.getPos().getZ());
                norms.push(vrt.getNormal().getX());
                norms.push(vrt.getNormal().getY());
                norms.push(vrt.getNormal().getZ());
                uvs.push(vrt.getTexCoord().getX());
                uvs.push(vrt.getTexCoord().getY());
                tans.push(vrt.getTangent().getX());
                tans.push(vrt.getTangent().getY());
                tans.push(vrt.getTangent().getZ());
            }
            this.m_indices = new Int16Array(indices);
            this.m_vertices = new Float32Array(verts);
            this.m_uvs = new Float32Array(uvs);
            this.m_normals = new Float32Array(norms);
            this.m_tangents = new Float32Array(tans);
        }
        draw() {
            this.gl.bindVertexArray(this.m_vao);
            this.gl.drawElementsInstanced(this.gl.TRIANGLES, this.m_indexCount, this.gl.UNSIGNED_SHORT, 0, 1);
        }
        calcNormals(vertices, indices) {
            for (let i = 0; i < indices.length; i += 3) {
                const i0 = indices[i];
                const i1 = indices[i + 1];
                const i2 = indices[i + 2];
                const v1 = vertices[i1].getPos().subVec(vertices[i0].getPos());
                const v2 = vertices[i2].getPos().subVec(vertices[i0].getPos());
                const normal = v1.cross(v2).normalized();
                vertices[i0].setNormal(vertices[i0].getNormal().addVec(normal));
                vertices[i1].setNormal(vertices[i1].getNormal().addVec(normal));
                vertices[i2].setNormal(vertices[i2].getNormal().addVec(normal));
            }
            for (let i = 0; i < vertices.length; i++)
                vertices[i].setNormal(vertices[i].getNormal().normalized());
        }
        loadMesh(fileName) {
            const splitArray = fileName.split(".");
            let ext = splitArray[splitArray.length - 1];
            if (ext !== "obj") {
                throw new Error("Error: '" + ext + "' file format not supported for mesh data.");
            }
            const test = new OBJModel_1.default(fileName);
            const model = test.toIndexedModel();
            const vertices = new Array();
            for (let i = 0; i < model.getPositions().length; i++) {
                vertices.push(new Vertex_2.default().initPTNT(model.getPositions()[i], model.getTexCoords()[i], model.getNormals()[i], model.getTangents()[i]));
            }
            const indexData = model.getIndices();
            this.addVertices(vertices, indexData, false);
            return this;
        }
        getIndices() { return this.m_indices; }
        getVertices() { return this.m_vertices; }
        getTexCoords() { return this.m_uvs; }
        getNormals() { return this.m_normals; }
        getTangents() { return this.m_tangents; }
    }
    exports.default = Mesh;
});
define("engine/components/MeshRenderer", ["require", "exports", "engine/components/GameComponent"], function (require, exports, GameComponent_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MeshRenderer extends GameComponent_4.default {
        constructor(mesh, material) {
            super();
            this.m_mesh = mesh;
            this.m_material = material;
            const program = this.m_material.getShader().getProgram();
            if (!program) {
                throw new Error("Error get shader program");
            }
            this.m_mesh.init(program);
        }
        render(shader, renderingEngine) {
            super.render(shader, renderingEngine);
            this.m_material.getShader().update(this.getTransform(), this.m_material, renderingEngine);
            this.m_mesh.draw();
        }
    }
    exports.default = MeshRenderer;
});
define("game/TestGame", ["require", "exports", "engine/core/Game", "engine/rendering/Mesh", "engine/core/GameObject", "engine/rendering/Material", "engine/components/MeshRenderer", "engine/math/Vector3f"], function (require, exports, Game_1, Mesh_1, GameObject_2, Material_1, MeshRenderer_1, Vector3f_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TestGame extends Game_1.default {
        constructor() {
            super();
        }
        init() {
            const cubeMesh = new Mesh_1.default();
            const cubeMaterial = new Material_1.default();
            const cube = new GameObject_2.default();
            cube.getTransform().setPos(new Vector3f_11.default(0, 0, 20));
            cube.addComponent(new MeshRenderer_1.default(cubeMesh, cubeMaterial));
            this.addObject(cube);
        }
    }
    exports.default = TestGame;
});
define("game/Main", ["require", "exports", "engine/core/CoreEngine", "engine/core/Display", "game/TestGame", "engine/core/resourceManagment/loaders/ResourcesLoader", "engine/core/Util"], function (require, exports, CoreEngine_1, Display_11, TestGame_1, ResourcesLoader_4, Util_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Main {
        static init(autostart = true) {
            Util_5.default.loadJSONFile(ResourcesLoader_4.default.URL + "resources.json")
                .then((result) => {
                return ResourcesLoader_4.default.loadResources(result);
            })
                .then(loaded => {
                Display_11.default.create(new Display_11.DisplayMode(800, 600, 60));
                Display_11.default.setTitle("Gizmo Bomba 3D");
                Main.engine = new CoreEngine_1.default(Display_11.default.getDisplayMode(), new TestGame_1.default());
                Main.start();
            });
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