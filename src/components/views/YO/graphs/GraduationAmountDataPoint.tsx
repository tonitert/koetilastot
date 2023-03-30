import {YODate} from "../../../data/YODataParser";
import {DataPoint} from "./DataPoint";

export class GraduationAmountDataPoint implements DataPoint {

    x: number
    y: number
    xName: string
    renderDot: boolean = true;

    constructor(amount: number, date: number | YODate, renderDot?: boolean) {
        this.y = amount
        if (date instanceof YODate) {
            this.x = date.year
        } else {
            this.x = date;
        }
        if(renderDot === false) this.renderDot = false;
        this.xName = this.x.toString()
    }
}