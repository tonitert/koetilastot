import {CSSProperties} from "react";
import GraphPoint from "./GraphPoint";
import {GraphType} from "./GraphType";
import ReactProps from "../components/ReactProps";

export default interface GraphProps extends ReactProps {
    lines: {
        points: GraphPoint[]
        type: GraphType
        /**
         * Value for the CSS background-color attribute
         * */
        background?: string
        lineWidth?: number
    }[]
    style?: CSSProperties
    yLines?: number
}