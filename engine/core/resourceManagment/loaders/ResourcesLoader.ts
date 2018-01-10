export default class ResourcesLoader {

    public static URL: string = "resources/";
    public static modelsData: Map<string, string> = new Map<string, string>();
    public static shadersData: Map<string, string> = new Map<string, string>();
    public static texturesData: Map<string, string> = new Map<string, string>();

    public static async loadResources(json: any): Promise<boolean> {

        let models: Array<string> = Array<string>();
        let shaders: Array<string> = Array<string>();
        let textures: Array<string> = Array<string>();

        //build models urls
        for (let i: number = 0; i < json.models.files.length; i++) {
            models.push(json.models.path + json.models.files[i]);
        }
        //build shaders urls
        for (let i: number = 0; i < json.shaders.files.length; i++) {
            shaders.push(json.shaders.path + json.shaders.files[i]);
        }
        //build textures urls
        for (let i: number = 0; i < json.textures.files.length; i++) {
            textures.push(json.textures.path + json.textures.files[i]);
        }

        return Promise.all(models.map(url =>
            fetch(ResourcesLoader.URL + url).then(resp => resp.text())
        )).then((mData) => {

            let key: string;
            for (let i: number = 0; i < mData.length; i++) {
                key = models[i].split("/")[1];
                ResourcesLoader.modelsData.set(key, mData[i]);
            }

            return Promise.all(shaders.map(url =>
                fetch(ResourcesLoader.URL + url).then(resp => resp.text())
            )).then(sData => {

                for (let i: number = 0; i < sData.length; i++) {
                    key = shaders[i].split("/")[1];
                    ResourcesLoader.shadersData.set(key, sData[i]);
                }

                return Promise.all(textures.map(url =>

                    fetch(ResourcesLoader.URL + url).then(resp => resp.blob())
                )).then(tData => {

                    for (let i: number = 0; i < tData.length; i++) {

                        key = textures[i].split("/")[1];

                        ResourcesLoader.texturesData.set(key, textures[i]);
                    }
                    return true;
                });
            });
        }).catch((error) => {
            return false;
        });
    }
}