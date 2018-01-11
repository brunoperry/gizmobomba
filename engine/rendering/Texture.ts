import TextureResource from "../core/resourceManagment/TextureResource";
import ResourcesLoader from "../core/resourceManagment/loaders/ResourcesLoader";
import Display from "../core/Display";

export default class Texture {

    private gl: WebGLRenderingContext = Display.gl;

    private static s_loadedTextures: Map<string, TextureResource> = new Map<string, TextureResource>();
    private m_resource: TextureResource | undefined;
    private m_fileName: string;

    constructor(fileName: string) {
        this.m_fileName = fileName;
        const oldResource: TextureResource | undefined = Texture.s_loadedTextures.get(fileName);

        if (oldResource !== undefined) {
            this.m_resource = oldResource;
            this.m_resource.addReference();
        }
        else {
            this.m_resource = this.getTexture(fileName);
            if(this.m_resource === undefined) {
                throw new Error("Error no texture found: " + fileName);
            }
            Texture.s_loadedTextures.set(fileName, this.m_resource);
        }
    }

    protected finalize(): void {

        if(this.m_resource === undefined) return;

        if (this.m_resource.removeReference() && this.m_fileName !== "") {
            Texture.s_loadedTextures.delete(this.m_fileName);
        }
    }

    public bind(): void {
        this.bindNum(0);
    }

    public bindNum(samplerSlot: number): void {
        // assert(samplerSlot >= 0 && samplerSlot <= 31);
        // glActiveTexture(GL_TEXTURE0 + samplerSlot);
        // glBindTexture(GL_TEXTURE_2D, m_resource.GetId());
    }

    public getID(): WebGLTexture | null {

        if(this.m_resource === undefined) return null;
        return this.m_resource.getId();
    }

    private getTexture(fileName: string): TextureResource | undefined {

        const textureData: Blob | undefined = ResourcesLoader.texturesData.get(fileName);
        const imgElem: HTMLImageElement = document.createElement("img");
        imgElem.src = window.URL.createObjectURL(textureData);

        let canvas: HTMLCanvasElement = document.createElement("canvas");
        let context:CanvasRenderingContext2D | null = canvas.getContext("2d");
        if(context === null) {
            throw new Error("Error generating image data");
        }
        context.drawImage(imgElem, 0, 0);
        const imageData: ImageData = context.getImageData(0, 0, 512, 512);

        const resource:TextureResource = new TextureResource();

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, resource.getId());
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        // -- Allocate storage for the texture
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageData);

        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

        // glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        // glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

        // glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA8, image.getWidth(), image.getHeight(), 0, GL_RGBA, GL_UNSIGNED_BYTE, buffer);

        return resource;
    }
}