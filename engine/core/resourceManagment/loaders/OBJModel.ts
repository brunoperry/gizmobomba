import Vector3f from "../../../math/Vector3f";
import Vector2f from "../../../math/Vector2f";
import OBJIndex from "./OBJIndex";
import TextFileReader from "./TextFileReader";
import Util from "../../Util";
import IndexedModel from "./IndexedModel";
import ResourcesLoader from "./ResourcesLoader";

export default class OBJModel {

	private static OBJProperties = {
		VERTEX: "v",
		UV: "vt",
		NORMAL: "vn",
		FACE: "f",
		SMOOTH: "s",
		GROUP: "g",
		MAT: "usemtl"
	}

	private m_positions: Array<Vector3f>;
	private m_texCoords: Array<Vector2f>;
	private m_normals: Array<Vector3f>;
	private m_indices: Array<OBJIndex>;
	private m_hasTexCoords: boolean;
	private m_hasNormals: boolean;

	constructor(fileName: string) {
		this.m_positions = new Array<Vector3f>();
		this.m_texCoords = new Array<Vector2f>();
		this.m_normals = new Array<Vector3f>();
		this.m_indices = new Array<OBJIndex>();
		this.m_hasTexCoords = false;
		this.m_hasNormals = false;

		const modelData: string | undefined = ResourcesLoader.modelsData.get(fileName);

        if(modelData === undefined) {
            throw new Error("No file found: " + fileName);
        }

		let meshReader: TextFileReader = new TextFileReader(modelData);

		while (meshReader.readLine()) {
			let line: string = meshReader.getLine();
			let tokens: Array<string> = line.split(" ");
			tokens = Util.RemoveEmptyStrings(tokens);

			if (tokens.length == 0 || tokens[0] === "#")
				continue;
			else if (tokens[0] === OBJModel.OBJProperties.VERTEX) {
				this.m_positions.push(new Vector3f(
					parseFloat(tokens[1]),
					parseFloat(tokens[2]),
					parseFloat(tokens[3])
				));
			}
			else if (tokens[0] === OBJModel.OBJProperties.UV) {
				this.m_texCoords.push(new Vector2f(
					parseFloat(tokens[1]),
					1.0 - parseFloat(tokens[2])
				));
			}
			else if (tokens[0] === OBJModel.OBJProperties.NORMAL) {
				this.m_normals.push(new Vector3f(
					parseFloat(tokens[1]),
					parseFloat(tokens[2]),
					parseFloat(tokens[3])));
			}
			else if (tokens[0] === OBJModel.OBJProperties.FACE) {
				for (let i: number = 0; i < tokens.length - 3; i++) {
					this.m_indices.push(this.parseOBJIndex(tokens[1]));
					this.m_indices.push(this.parseOBJIndex(tokens[2 + i]));
					this.m_indices.push(this.parseOBJIndex(tokens[3 + i]));
				}
			}
		}
	}

	public toIndexedModel(): IndexedModel {
		const result: IndexedModel = new IndexedModel();
		const normalModel: IndexedModel = new IndexedModel();
		const resultIndexMap: Map<OBJIndex, number> = new Map<OBJIndex, number>();
		const normalIndexMap: Map<number, number> = new Map<number, number>();
		const indexMap: Map<number, number> = new Map<number, number>();

		for (let i: number = 0; i < this.m_indices.length; i++) {
			const currentIndex: OBJIndex = this.m_indices[i];

			const currentPosition: Vector3f = this.m_positions[currentIndex.getVertexIndex()];
			let currentTexCoord: Vector2f;
			let currentNormal: Vector3f;

			if (this.m_hasTexCoords)
				currentTexCoord = this.m_texCoords[currentIndex.getTexCoordIndex()];
			else
				currentTexCoord = new Vector2f(0, 0);

			if (this.m_hasNormals)
				currentNormal = this.m_normals[currentIndex.getNormalIndex()];
			else
				currentNormal = new Vector3f(0, 0, 0);

			let modelVertexIndex: number | undefined = resultIndexMap.get(currentIndex);

			if (modelVertexIndex === undefined) {
				modelVertexIndex = result.getPositions().length;
				resultIndexMap.set(currentIndex, modelVertexIndex);

				result.getPositions().push(currentPosition);
				result.getTexCoords().push(currentTexCoord);
				if (this.m_hasNormals)
					result.getNormals().push(currentNormal);
			}

			let normalModelIndex: number = normalIndexMap[currentIndex.getVertexIndex()];

			if (normalModelIndex === undefined) {

				normalModelIndex = normalModel.getPositions().length;
				normalIndexMap.set(currentIndex.getVertexIndex(), normalModelIndex);

				normalModel.getPositions().push(currentPosition);
				normalModel.getTexCoords().push(currentTexCoord);
				normalModel.getNormals().push(currentNormal);
				normalModel.getTangents().push(new Vector3f(0, 0, 0));
			}

			indexMap.set(modelVertexIndex, normalModelIndex);
			result.getIndices().push(modelVertexIndex);
			normalModel.getIndices().push(normalModelIndex);
			indexMap.set(modelVertexIndex, normalModelIndex);
		}

		if (!this.m_hasNormals) {

			normalModel.calcNormals();
			for (let i: number = 0; i < result.getPositions().length; i++)
				result.getNormals().push(normalModel.getNormals()[indexMap[i]]);
		}

		normalModel.calcTangents();
		for (let i: number = 0; i < result.getPositions().length; i++) {

			const res = normalModel.getTangents()[indexMap.get(i) as number];
			
			result.getTangents().push(res);
		}

		return result;
	}

	private parseOBJIndex(token: string): OBJIndex {
		const values: Array<string> = token.split("/");

		const result: OBJIndex = new OBJIndex();
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