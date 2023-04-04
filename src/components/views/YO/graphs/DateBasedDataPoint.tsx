import {YODate} from "../../../data/YODataParser";
import {DataPoint} from "./DataPoint";

export class DateBasedDataPoint implements DataPoint {

    x: number
    y0: number
    xName: string
    renderDot: boolean = true;

    constructor(yValues: number[], date: number | YODate, renderDot?: boolean, xStringName?: string) {
        for (let i = 0; i < yValues.length; i++) {
            this[`y${i}`] = yValues[i];
        }
        if (date instanceof YODate) {
            this.x = date.year
        } else {
            this.x = date;
        }
        if(renderDot === false) this.renderDot = false;
        this.xName = xStringName === undefined ? this.x.toString() : xStringName
    }
}