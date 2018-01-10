import Display, { DisplayMode } from "../core/Display";
import MeshResource from "../core/resourceManagment/MeshResource";
import Vertex from "../core/Vertex";
import Util from "../core/Util";
import Vector3f from "../math/Vector3f";
import OBJModel from "../core/resourceManagment/loaders/OBJModel";
import IndexedModel from "../core/resourceManagment/loaders/IndexedModel";
import ResourcesLoader from "../core/resourceManagment/loaders/ResourcesLoader";

export default class Mesh {

    private gl: WebGLRenderingContext = Display.gl;

    private static s_loadedModels: Map<string, MeshResource> = new Map<string, MeshResource>();
    private m_resource: MeshResource;
    private m_fileName: string;

    constructor(fileName: string) {

        this.m_fileName = fileName;
        const oldResource: MeshResource | undefined = Mesh.s_loadedModels.get(fileName);


        if (oldResource != undefined) {
            this.m_resource = oldResource;
            this.m_resource.addReference();
        }
        else {
            this.loadMesh(fileName);
            Mesh.s_loadedModels.set(fileName, this.m_resource);
        }
    }

    // public InitLoad(fileName: string): Mesh {



    //     return this;
    // }

    public init(vertices: Array<Vertex>, indices: Array<number>, calcNormals: boolean): Mesh {
        this.m_fileName = "";
        this.addVertices(vertices, indices, calcNormals);

        return this;
    }

    protected finalize(): void {
        if (this.m_resource.removeReference() && !(this.m_fileName === " ")) {
            Mesh.s_loadedModels.delete(this.m_fileName);
        }
    }

    private addVertices(vertices: Array<Vertex>, indices: Array<number>, calcNormals: boolean): void {
        if (calcNormals) {
            this.calcNormals(vertices, indices);
        }

        this.m_resource = new MeshResource(indices.length);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.m_resource.getVbo());
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Util.CreateFlippedVertexBuffer(vertices), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.m_resource.getIbo());
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, Util.CreateFlippedIntBuffer(indices), this.gl.STATIC_DRAW);
    }

    public draw(): void {
        this.gl.enableVertexAttribArray(0);
        this.gl.enableVertexAttribArray(1);
        this.gl.enableVertexAttribArray(2);
        this.gl.enableVertexAttribArray(3);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.m_resource.getVbo());
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, Vertex.SIZE * 4, 0);
        this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, Vertex.SIZE * 4, 12);
        this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, Vertex.SIZE * 4, 20);
        this.gl.vertexAttribPointer(3, 3, this.gl.FLOAT, false, Vertex.SIZE * 4, 32);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.m_resource.getIbo());
        this.gl.drawElements(this.gl.TRIANGLES, this.m_resource.getSize(), this.gl.UNSIGNED_INT, 0);

        this.gl.disableVertexAttribArray(0);
        this.gl.disableVertexAttribArray(1);
        this.gl.disableVertexAttribArray(2);
        this.gl.disableVertexAttribArray(3);
    }

    private calcNormals(vertices: Array<Vertex>, indices: Array<number>): void {
        for (let i: number = 0; i < indices.length; i += 3) {
            const i0: number = indices[i];
            const i1: number = indices[i + 1];
            const i2: number = indices[i + 2];

            const v1: Vector3f = vertices[i1].getPos().subVec(vertices[i0].getPos());
            const v2: Vector3f = vertices[i2].getPos().subVec(vertices[i0].getPos());

            const normal: Vector3f = v1.cross(v2).normalized();

            vertices[i0].setNormal(vertices[i0].getNormal().addVec(normal));
            vertices[i1].setNormal(vertices[i1].getNormal().addVec(normal));
            vertices[i2].setNormal(vertices[i2].getNormal().addVec(normal));
        }

        for (let i: number = 0; i < vertices.length; i++)
            vertices[i].setNormal(vertices[i].getNormal().normalized());
    }

    private loadMesh(fileName: string): Mesh | null {
        
        const splitArray: Array<string> = fileName.split(".");
        let ext: string = splitArray[splitArray.length - 1];

        if (ext !== "obj") {
            throw new Error("Error: '" + ext + "' file format not supported for mesh data.");
        }

        const test: OBJModel = new OBJModel(fileName);
        const model: IndexedModel = test.toIndexedModel();

        const vertices: Array< Vertex>  = new Array<Vertex>();

        for (let i: number = 0; i < model.getPositions().length; i++) {

            vertices.push(new Vertex().initPTNT(
                model.getPositions()[i],
                model.getTexCoords()[i],
                model.getNormals()[i],
                model.getTangents()[i]));
        }

        // const vertexData:Array<Vertex> = new Array<Vertex>(vertices.length);
        // vertices.toArray(vertexData);

        const indexData:Array<number> = model.getIndices();
        this.addVertices(vertices, indexData, false);
        return this;
    }
}