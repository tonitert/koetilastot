import GraphPoint from "./GraphPoint";
import {GraphType} from "./GraphType";

export default interface LineProps {
    points: GraphPoint[]
    type: GraphType
    /**
     * Value for the CSS background-color attribute
     * */
    background?: string
    lineWidth?: number
    maxVal: number
    minVal: number
}