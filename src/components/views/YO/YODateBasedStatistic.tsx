import {DateBasedDataPoint} from "./graphs/DateBasedDataPoint";

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
}