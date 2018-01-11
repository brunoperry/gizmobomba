import MappedValues from "../core/resourceManagment/MappedValues";
import Texture from "./Texture";

export default class Material extends MappedValues {
    private m_textureHashMap: Map<string, Texture>;

    constructor(
        diffuse: Texture,
        specularIntensity: number = 1,
        specularPower: number = 8
    ) {

        super();
        this.m_textureHashMap = new Map<string, Texture>();
        this.addTexture("diffuse", diffuse);
        this.addFloat("specularIntensity", specularIntensity);
        this.addFloat("specularPower", specularPower);
    }

    public addTexture(name: string, texture: Texture): void { this.m_textureHashMap.set(name, texture); }

    public getTexture(name: string): Texture {

        const result:Texture | undefined = this.m_textureHashMap.get(name);
        if (result !== undefined)
            return result;

        return new Texture("test.png");
    }
}