import {DateBasedDataPoint} from "./graphs/DateBasedDataPoint";
import {StackOffsetType} from "recharts/types/util/types";

export default interface YODateBasedStatistic {
    dataPoints: DateBasedDataPoint[]
    name: string
    yAxisNames: string[]
    unit?: string
    colors?: string[]
    defs?: JSX.IntrinsicElements["defs"]
    /**
     * Should the element be displayed?
     */
    display?: () => boolean
    stacked?: boolean
    stackOffset?: StackOffsetType
}