import Vector3f from "../../math/Vector3f";

export default abstract class MappedValues {
    private m_vector3fHashMap: Map<string, Vector3f>;
    private m_floatHashMap: Map<string, number>;

    constructor() {
        this.m_vector3fHashMap = new Map<string, Vector3f>();
        this.m_floatHashMap = new Map<string, number>();
    }

    public addVector3f(name: string, vector3f: Vector3f): void { this.m_vector3fHashMap.set(name, vector3f); }
    public addFloat(name: string, floatValue: number): void { this.m_floatHashMap.set(name, floatValue); }

    public getVector3f(name: string): Vector3f {
        const result: Vector3f | undefined = this.m_vector3fHashMap.get(name);
        if (result != undefined)
            return result;

        return new Vector3f(0, 0, 0);
    }

    public getFloat(name: string): number {
        const result: number | undefined = this.m_floatHashMap.get(name);
        if (result != undefined)
            return result;

        return 0;
    }
}