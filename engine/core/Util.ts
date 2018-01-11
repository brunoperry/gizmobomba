import Matrix4f from "../math/Matrix4f";
import Vertex from "./Vertex";

export default class Util {

    public static toRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    public static isWhitespace(char:string) : boolean {
        return /\S/.test(char);
    }

    public static async loadJSONFile(url: string): Promise<JSON> {
        let response = await fetch(url);
        return await response.json();
    }

    public static CreateFlippedIntBuffer(values: Array<number>): Int16Array {

        const buffer: Int16Array = new Int16Array(values.length);
        buffer.set(values);
        buffer.reverse();

        return buffer;
    }

    public static CreateFlippedVertexBuffer(vertices: Array<Vertex>): Float32Array {

        const values: Array<number> = new Array<number>();

        for(let i:number = 0; i < vertices.length; i++) {

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

        const buffer: Float32Array = new Float32Array(vertices.length * Vertex.SIZE);
        buffer.set(values);
        buffer.reverse();

        return buffer;
    }

    public static CreateFlippedMatrixBuffer(value: Matrix4f): Float32Array {

        const buffer: Float32Array = new Float32Array(4 * 4);

        let v: number;
        for (let i: number = 0; i < 4; i++) {
            for (let j: number = 0; j < 4; j++) {
                v = value.get(i, j);
                buffer.set([], v);
            }
        }
        buffer.reverse();

        return buffer;
    }

    public static RemoveEmptyStrings(data: Array<string>): Array<string> {
        const result: Array<string> = new Array<string>();

        for (let i: number = 0; i < data.length; i++)
            if (!(data[i] === ""))
                result.push(data[i]);

        return result;
    }

    public static ToIntArrayBuffer(data:Array<number>): Int16Array {

        let res : Int16Array = new Int16Array(data.length);
        for (let i = 0; i < data.length; i++) {
            res[i] = data[i];
        }

        return res;
    }
}