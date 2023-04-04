import {DataPoint} from "./DataPoint";

export class DataArray {
    data: DataPoint[]
    yVariableNames: string[]

    constructor(data: DataPoint[], yVariableNames: string[]) {
        this.data = data;
        this.yVariableNames = yVariableNames;
    }

}