import ResourcesLoader from "./ResourcesLoader";

export default class TextFileReader {

    private lines: Array<string>;
    private lineCounter: number = -1;
    constructor(textFile: string) {

        this.lines = textFile.split("\n");
    }

    public readLine():boolean {

        // console.log("LC:",this.lineCounter)
        // console.log("L:",this.lines.length)
        if(this.lineCounter >= this.lines.length - 1) {
            return false;
        } else {
            this.lineCounter++;
            return true;
        }
    }

    public getLine():string {



        return this.lines[this.lineCounter];
    }
}