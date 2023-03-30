import {DataPoint} from "./DataPoint";

export class DataArray {
    data: DataPoint[]
    yVariableName: string

    constructor(data: DataPoint[], yVariableName: string) {
        this.data = data;
        this.yVariableName = yVariableName;
    }

}