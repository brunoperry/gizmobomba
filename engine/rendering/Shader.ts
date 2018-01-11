import ShaderResource from "../core/resourceManagment/ShaderResource";
import Material from "./Material";
import RenderingEngine from "./RenderingEngine";
import Transform from "../core/Transform";
import Matrix4f from "../math/Matrix4f";
import Util from "../core/Util";
import Vector3f from "../math/Vector3f";
import Display from "../core/Display";
import TextFileReader from "../core/resourceManagment/loaders/TextFileReader";
import ResourcesLoader from "../core/resourceManagment/loaders/ResourcesLoader";

export default class Shader {

    private gl: WebGLRenderingContext = Display.gl;

    private static s_loadedShaders: Map<string, ShaderResource> = new Map<string, ShaderResource>();

    private m_resource: ShaderResource;
    private m_fileName: string;

    constructor(fileName: string) {
        this.m_fileName = fileName;

        const oldResource: ShaderResource | undefined = Shader.s_loadedShaders.get(fileName);

        if (oldResource !== undefined) {
            this.m_resource = oldResource;
            this.m_resource.addReference();
        }
        else {
            this.m_resource = new ShaderResource();

            const vertexShaderText: string | undefined = Shader.LoadShader(fileName + "Vertex.glsl");
            const fragmentShaderText: string | undefined = Shader.LoadShader(fileName + "Fragment.glsl");

            if(vertexShaderText === undefined || fragmentShaderText === undefined) {
                throw new Error("Error loading shaders");
            }

            this.addVertexShader(vertexShaderText);
            this.addFragmentShader(fragmentShaderText);

            this.addAllAttributes(vertexShaderText);

            this.compileShader();

            this.addAllUniforms(vertexShaderText);
            this.addAllUniforms(fragmentShaderText);

            Shader.s_loadedShaders.set(fileName, this.m_resource);
        }
    }

    // @Override
    protected finalize(): void {
        if (this.m_resource.removeReference() && this.m_fileName !== "") {
            Shader.s_loadedShaders.delete(this.m_fileName);
        }
    }

    public bind(): void {
        this.gl.useProgram(this.m_resource.getProgram());
    }

    public updateUniforms(transform: Transform, material: Material, renderingEngine: RenderingEngine): void {
        const worldMatrix: Matrix4f = transform.getTransformation();
        const MVPMatrix: Matrix4f = renderingEngine.getMainCamera().getViewProjection().mul(worldMatrix);

        for (let i: number = 0; i < this.m_resource.getUniformNames().length; i++) {
            const uniformName: string = this.m_resource.getUniformNames()[i];
            const uniformType: string = this.m_resource.getUniformTypes()[i];

            if (uniformType === "sampler2D") {
                const samplerSlot: number | undefined = renderingEngine.getSamplerSlot(uniformName);

                if (samplerSlot === undefined) {
                    throw new Error("Error updating uniform");
                }
                // material.getTexture(uniformName).bind(samplerSlot);
                material.getTexture(uniformName).bind();
                this.setUniformi(uniformName, samplerSlot);
            }
            else if (uniformName.startsWith("T_")) {
                if (uniformName.includes("T_MVP"))
                    this.setUniformm(uniformName, MVPMatrix);
                else if (uniformName.includes("T_model"))
                    this.setUniformm(uniformName, worldMatrix);
                else
                    throw new Error(uniformName + " is not a valid component of Transform");
            }
            else if (uniformName.startsWith("R_")) {
                const unprefixedUniformName: string = uniformName.substring(2);
                if (uniformType.includes("vec3"))
                    this.setUniformv(uniformName, renderingEngine.getVector3f(unprefixedUniformName));
                else if (uniformType.includes("float"))
                    this.setUniformf(uniformName, renderingEngine.getFloat(unprefixedUniformName));
                // else if (uniformType.includes("DirectionalLight"))
                //     this.setUniformDirectionalLight(uniformName, (DirectionalLight) renderingEngine.getActiveLight());
                // else if (uniformType.equals("PointLight"))
                //     SetUniformPointLight(uniformName, (PointLight) renderingEngine.GetActiveLight());
                // else if (uniformType.equals("SpotLight"))
                //     SetUniformSpotLight(uniformName, (SpotLight) renderingEngine.GetActiveLight());
                // else
                //     renderingEngine.updateUniformStruct(transform, material, this, uniformName, uniformType);
            }
            else if (uniformName.startsWith("C_")) {
                if (uniformName.includes("C_eyePos"))
                    this.setUniformv(uniformName, renderingEngine.getMainCamera().getTransform().getTransformedPos());
                else
                    throw new Error(uniformName + " is not a valid component of Camera");
            }
            else {
                if (uniformType.includes("vec3"))
                    this.setUniformv(uniformName, material.getVector3f(uniformName));
                else if (uniformType.includes("float"))
                    this.setUniformf(uniformName, material.getFloat(uniformName));
                else
                    throw new Error(uniformType + " is not a supported type in Material");
            }
        }
    }

    private addAllAttributes(shaderText: string): void {
        const ATTRIBUTE_KEYWORD: string = "attribute";
        let attributeStartLocation: number = shaderText.indexOf(ATTRIBUTE_KEYWORD);
        let attribNumber: number = 0;
        while (attributeStartLocation != -1) {
            if (!(attributeStartLocation != 0
                && (Util.isWhitespace(shaderText.charAt(attributeStartLocation - 1)) || shaderText.charAt(attributeStartLocation - 1) == ';')
                && Util.isWhitespace(shaderText.charAt(attributeStartLocation + ATTRIBUTE_KEYWORD.length)))) {
                attributeStartLocation = shaderText.indexOf(ATTRIBUTE_KEYWORD, attributeStartLocation + ATTRIBUTE_KEYWORD.length);
                continue;

            }

            const begin: number = attributeStartLocation + ATTRIBUTE_KEYWORD.length + 1;
            const end: number = shaderText.indexOf(";", begin);

            const attributeLine: string = shaderText.substring(begin, end).trim();
            const attributeName: string = attributeLine.substring(attributeLine.indexOf(' ') + 1, attributeLine.length).trim();

            this.setAttribLocation(attributeName, attribNumber);
            attribNumber++;

            attributeStartLocation = shaderText.indexOf(ATTRIBUTE_KEYWORD, attributeStartLocation + ATTRIBUTE_KEYWORD.length);
        }
    }

    private findUniformStructs(shaderText: string): Map<string, Array<GLSLStruct>> {

        const result: Map<string, Array<GLSLStruct>> = new Map<string, Array<GLSLStruct>>();

        const STRUCT_KEYWORD: string = "struct";
        let structStartLocation: number = shaderText.indexOf(STRUCT_KEYWORD);
        while (structStartLocation != -1) {
            if (!(structStartLocation != 0
                && (Util.isWhitespace(shaderText.charAt(structStartLocation - 1)) || shaderText.charAt(structStartLocation - 1) == ';')
                && Util.isWhitespace(shaderText.charAt(structStartLocation + STRUCT_KEYWORD.length)))) {
                structStartLocation = shaderText.indexOf(STRUCT_KEYWORD, structStartLocation + STRUCT_KEYWORD.length);
                continue;
            }

            const nameBegin: number = structStartLocation + STRUCT_KEYWORD.length + 1;
            const braceBegin: number = shaderText.indexOf("{", nameBegin);
            const braceEnd: number = shaderText.indexOf("}", braceBegin);

            const structName: string = shaderText.substring(nameBegin, braceBegin).trim();
            const glslStructs: Array<GLSLStruct> = new Array<GLSLStruct>();

            let componentSemicolonPos: number = shaderText.indexOf(";", braceBegin);
            while (componentSemicolonPos != -1 && componentSemicolonPos < braceEnd) {
                let componentNameEnd: number = componentSemicolonPos + 1;

                while (Util.isWhitespace(shaderText.charAt(componentNameEnd - 1)) || shaderText.charAt(componentNameEnd - 1) == ';')
                    componentNameEnd--;

                let componentNameStart: number = componentSemicolonPos;

                while (!Util.isWhitespace(shaderText.charAt(componentNameStart - 1)))
                    componentNameStart--;

                let componentTypeEnd = componentNameStart;

                while (Util.isWhitespace(shaderText.charAt(componentTypeEnd - 1)))
                    componentTypeEnd--;

                let componentTypeStart = componentTypeEnd;

                while (!Util.isWhitespace(shaderText.charAt(componentTypeStart - 1)))
                    componentTypeStart--;

                const componentName: string = shaderText.substring(componentNameStart, componentNameEnd);
                const componentType: string = shaderText.substring(componentTypeStart, componentTypeEnd);

                const glslStruct: GLSLStruct = new GLSLStruct();
                glslStruct.name = componentName;
                glslStruct.type = componentType;

                glslStructs.push(glslStruct);

                componentSemicolonPos = shaderText.indexOf(";", componentSemicolonPos + 1);
            }

            result.set(structName, glslStructs);

            structStartLocation = shaderText.indexOf(STRUCT_KEYWORD, structStartLocation + STRUCT_KEYWORD.length);
        }

        return result;
    }

    private addAllUniforms(shaderText: string): void {
        const structs: Map<string, Array<GLSLStruct>> = this.findUniformStructs(shaderText);

        const UNIFORM_KEYWORD: string = "uniform";
        let uniformStartLocation: number = shaderText.indexOf(UNIFORM_KEYWORD);
        while (uniformStartLocation != -1) {
            if (!(uniformStartLocation != 0
                && (Util.isWhitespace(shaderText.charAt(uniformStartLocation - 1)) || shaderText.charAt(uniformStartLocation - 1) == ';')
                && Util.isWhitespace(shaderText.charAt(uniformStartLocation + UNIFORM_KEYWORD.length)))) {
                uniformStartLocation = shaderText.indexOf(UNIFORM_KEYWORD, uniformStartLocation + UNIFORM_KEYWORD.length);
                continue;
            }

            const begin: number = uniformStartLocation + UNIFORM_KEYWORD.length + 1;
            const end: number = shaderText.indexOf(";", begin);

            const uniformLine: string = shaderText.substring(begin, end).trim();

            const whiteSpacePos: number = uniformLine.indexOf(' ');
            const uniformName: string = uniformLine.substring(whiteSpacePos + 1, uniformLine.length).trim();
            const uniformType: string = uniformLine.substring(0, whiteSpacePos).trim();

            this.m_resource.getUniformNames().push(uniformName);
            this.m_resource.getUniformTypes().push(uniformType);
            this.addUniform(uniformName, uniformType, structs);

            uniformStartLocation = shaderText.indexOf(UNIFORM_KEYWORD, uniformStartLocation + UNIFORM_KEYWORD.length);
        }
    }

    private addUniform(uniformName: string, uniformType: string, structs: Map<String, Array<GLSLStruct>>): void {

        let addThis: boolean = true;
        const structComponents: Array<GLSLStruct> | undefined = structs.get(uniformType);

        if (structComponents !== undefined) {
            addThis = false;

            const instance = this;
            structComponents.forEach(struct => {
                instance.addUniform(uniformName + "." + struct.name, struct.type, structs);
            });
        }

        if (!addThis)
            return;

        const uniformLocation: WebGLUniformLocation | null = this.gl.getUniformLocation(this.m_resource.getProgram(), uniformName);

        if (uniformLocation == 0xFFFFFFFF || uniformLocation === null) {
            throw new Error("Error: Could not find uniform: " + uniformName);
        }

        this.m_resource.getUniforms().set(uniformName, uniformLocation);
    }

    private addVertexShader(text: string): void {
        this.addProgram(text, this.gl.VERTEX_SHADER);
    }

    private addFragmentShader(text): void {
        this.addProgram(text, this.gl.FRAGMENT_SHADER);
    }

    private setAttribLocation(attributeName: string, location: number): void {
        this.gl.bindAttribLocation(this.m_resource.getProgram(), location, attributeName);
    }

    private compileShader(): void {
        this.gl.linkProgram(this.m_resource.getProgram());

        if (this.gl.getProgramParameter(this.m_resource.getProgram(), this.gl.LINK_STATUS) == 0) {
            throw new Error("" + this.m_resource.getProgram());
        }

        this.gl.validateProgram(this.m_resource.getProgram());

        if (this.gl.getProgramParameter(this.m_resource.getProgram(), this.gl.VALIDATE_STATUS) == 0) {
            throw new Error("" + this.m_resource.getProgram());
        }
    }

    private addProgram(text: string, type: number): void {
        const shader: WebGLShader | null = this.gl.createShader(type);

        if (shader === null) {
            throw new Error("Shader creation failed: Could not find valid memory location when adding shader");
        }

        this.gl.shaderSource(shader, text);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error("" + this.gl.getShaderInfoLog(shader));
        }

        this.gl.attachShader(this.m_resource.getProgram(), shader);
    }

    private static LoadShader(fileName: string): string | undefined {

        return ResourcesLoader.shadersData.get(fileName);
    }

    public setUniformi(uniformName: string, value: number): void {
        this.gl.uniform1i(this.m_resource.getUniforms().get(uniformName), value);
    }

    public setUniformf(uniformName: string, value: number): void {
        this.gl.uniform1f(this.m_resource.getUniforms().get(uniformName), value);
    }

    public setUniformv(uniformName: string, value: Vector3f): void {
        this.gl.uniform3f(this.m_resource.getUniforms().get(uniformName), value.getX(), value.getY(), value.getZ());
    }

    public setUniformm(uniformName: string, value: Matrix4f): void {
        this.gl.uniformMatrix4fv(this.m_resource.getUniforms().get(uniformName), true, Util.CreateFlippedMatrixBuffer(value));
    }

    // 	public  SetUniformBaseLight(String uniformName:string, BaseLight baseLight):void
    // {
    //     SetUniform(uniformName + ".color", baseLight.GetColor());
    //     SetUniformf(uniformName + ".intensity", baseLight.GetIntensity());
    // }

    // 	public void SetUniformDirectionalLight(String uniformName, DirectionalLight directionalLight)
    // {
    //     SetUniformBaseLight(uniformName + ".base", directionalLight);
    //     SetUniform(uniformName + ".direction", directionalLight.GetDirection());
    // }

    // 	public void SetUniformPointLight(String uniformName, PointLight pointLight)
    // {
    //     SetUniformBaseLight(uniformName + ".base", pointLight);
    //     SetUniformf(uniformName + ".atten.constant", pointLight.GetAttenuation().GetConstant());
    //     SetUniformf(uniformName + ".atten.linear", pointLight.GetAttenuation().GetLinear());
    //     SetUniformf(uniformName + ".atten.exponent", pointLight.GetAttenuation().GetExponent());
    //     SetUniform(uniformName + ".position", pointLight.GetTransform().GetTransformedPos());
    //     SetUniformf(uniformName + ".range", pointLight.GetRange());
    // }

    // 	public void SetUniformSpotLight(String uniformName, SpotLight spotLight)
    // {
    //     SetUniformPointLight(uniformName + ".pointLight", spotLight);
    //     SetUniform(uniformName + ".direction", spotLight.GetDirection());
    //     SetUniformf(uniformName + ".cutoff", spotLight.GetCutoff());
    // }
}

class GLSLStruct {

    public name: string;
    public type: string;
}