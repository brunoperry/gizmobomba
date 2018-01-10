import Matrix4f from "../math/Matrix4f";
import Vertex from "./Vertex";

export default class Util {

    public static toRadians(degrees: number): number {
        return degrees * Math.PI / 180;
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

        // const pos: Array<number> = new Array<number>();
        // const texCoords: Array<number> = new Array<number>();
        // const normals: Array<number> = new Array<number>();
        // const tangents: Array<number> = new Array<number>();

        // for(let i:number = 0; i < vertices.length; i++) {

        //     pos.push(vertices[i].getPos().getX());
        //     pos.push(vertices[i].getPos().getY());
        //     pos.push(vertices[i].getPos().getZ());

        //     texCoords.push(vertices[i].getTexCoord().getX());
        //     texCoords.push(vertices[i].getTexCoord().getY());

        //     normals.push(vertices[i].getNormal().getX());
        //     normals.push(vertices[i].getNormal().getY());
        //     normals.push(vertices[i].getNormal().getZ());

        //     tangents.push(vertices[i].getTangent().getX());
        //     tangents.push(vertices[i].getTangent().getY());
        //     tangents.push(vertices[i].getTangent().getZ());
        // }

        // const buffer: Float32Array = new Float32Array(vertices.length * Vertex.SIZE);
        // buffer.set([], new Float32Array(pos));

        const buffer: Float32Array = new Float32Array(vertices.length * Vertex.SIZE);
        console.log(buffer.length)
        for (let i: number = 0; i < vertices.length; i++) {

            console.log(i)
            buffer.set([], vertices[i].getPos().getX());
            buffer.set([], vertices[i].getPos().getY());
            buffer.set([], vertices[i].getPos().getZ());
            buffer.set([], vertices[i].getTexCoord().getX());
            buffer.set([], vertices[i].getTexCoord().getY());
            buffer.set([], vertices[i].getNormal().getX());
            buffer.set([], vertices[i].getNormal().getY());
            buffer.set([], vertices[i].getNormal().getZ());
            buffer.set([], vertices[i].getTangent().getX());
            buffer.set([], vertices[i].getTangent().getY());
            buffer.set([], vertices[i].getTangent().getZ());
        }

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