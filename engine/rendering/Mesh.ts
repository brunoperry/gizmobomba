import Display, { DisplayMode } from "../core/Display";
import MeshResource from "../core/resourceManagment/MeshResource";
import Vertex from "../core/Vertex";
import Util from "../core/Util";
import Vector3f from "../math/Vector3f";
import OBJModel from "../core/resourceManagment/loaders/OBJModel";
import IndexedModel from "../core/resourceManagment/loaders/IndexedModel";
import ResourcesLoader from "../core/resourceManagment/loaders/ResourcesLoader";

export default class Mesh {

    private gl: WebGL2RenderingContext = Display.gl;

    private m_vao: WebGLVertexArrayObject | null;
    private m_vertices:Float32Array;
    private m_indices:Int16Array;
    private m_normals:Float32Array;
    private m_uvs:Float32Array;
    private m_tangents:Float32Array;

    private m_indexCount: number = 0;

    constructor(fileName: string = "cube.obj") {

        this.loadMesh(fileName);
    }

    public init(program: WebGLProgram): void {

        const vertexAttributeLocation : number = this.gl.getAttribLocation(program, "a_position");
        const texCoordAttributeLocation : number = this.gl.getAttribLocation(program, "a_texcoord");
        const normalAttributeLocation : number = this.gl.getAttribLocation(program, "a_normal");

        //Setup Indices.
        const ibo:WebGLBuffer | null = this.gl.createBuffer();
        this.m_indexCount = this.m_indices.length;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);  
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.m_indices, this.gl.STATIC_DRAW);

		//Set up vertices
        const vbo:WebGLBuffer | null = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.m_vertices, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(vertexAttributeLocation);
        this.gl.vertexAttribPointer(vertexAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        
        //Setup UV
        const UVbo:WebGLBuffer | null = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, UVbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.m_uvs, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(texCoordAttributeLocation);
        this.gl.vertexAttribPointer(texCoordAttributeLocation, 2, this.gl.FLOAT, true, 0, 0);

        //Setup normals
        console.log(normalAttributeLocation)
        const nbo:WebGLBuffer | null = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, nbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.m_normals, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(normalAttributeLocation);
        this.gl.vertexAttribPointer(normalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.m_vao =  this.gl.createVertexArray();
        this.gl.bindVertexArray(this.m_vao);

        //SET vertex buffer to VAO
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        this.gl.enableVertexAttribArray(vertexAttributeLocation);
        this.gl.vertexAttribPointer(vertexAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        
        //SET texture buffer to VAO
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, UVbo);
        this.gl.enableVertexAttribArray(texCoordAttributeLocation);
        this.gl.vertexAttribPointer(texCoordAttributeLocation, 2, this.gl.FLOAT, true, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        //SET normals buffer to VAO
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, nbo);
        this.gl.enableVertexAttribArray(normalAttributeLocation);
        this.gl.vertexAttribPointer(normalAttributeLocation, 3, this.gl.HALF_FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        //SET indices buffer to VAO
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);

        this.gl.bindVertexArray(null);
    }


    private addVertices(vertices: Array<Vertex>, indices: Array<number>, calcNormals: boolean): void {
        if (calcNormals) {
            this.calcNormals(vertices, indices);
        }

        const verts: Array<number> = new Array<number>();
        const norms: Array<number> = new Array<number>();
        const uvs: Array<number> = new Array<number>();
        const tans: Array<number> = new Array<number>();
        let vrt: Vertex;
        for (let i: number = 0; i < indices.length; i++) {

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

    public draw(): void {

        // console.log("drawing")
        this.gl.bindVertexArray(this.m_vao);
        this.gl.drawElementsInstanced(this.gl.TRIANGLES, this.m_indexCount, this.gl.UNSIGNED_SHORT, 0, 1);
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

        const vertices: Array<Vertex> = new Array<Vertex>();

        for (let i: number = 0; i < model.getPositions().length; i++) {

            vertices.push(new Vertex().initPTNT(
                model.getPositions()[i],
                model.getTexCoords()[i],
                model.getNormals()[i],
                model.getTangents()[i]));
        }

        const indexData: Array<number> = model.getIndices();
        this.addVertices(vertices, indexData, false);
        return this;
    }

    public getIndices():Int16Array { return this.m_indices; }
    public getVertices():Float32Array { return this.m_vertices; }
    public getTexCoords():Float32Array { return this.m_uvs; }
    public getNormals():Float32Array { return this.m_normals; }
    public getTangents():Float32Array { return this.m_tangents; }
}