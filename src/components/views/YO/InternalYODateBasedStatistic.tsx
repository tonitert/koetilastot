import {DateBasedDataPoint} from "./graphs/DateBasedDataPoint";
import {StackOffsetType} from "recharts/types/util/types";
import {FilterState} from "./filters/FilterState";
import {YOSeasonData} from "../../data/YODataParser";

export default interface InternalYODateBasedStatistic {
    dataPoints?: DateBasedDataPoint[]
    _dataPointGenerator?: (yoSeasonData: YOSeasonData[], filterState: FilterState) => DateBasedDataPoint[]
    name: string
    yAxisNames: string[]
    unit?: string
    colors?: string[]
    defs?: JSX.IntrinsicElements["defs"]
    /**
     * Should the element be displayed?
     */
    display?: (filterState: FilterState) => boolean
    stacked?: boolean
    stackOffset?: StackOffsetType
    legend?: boolean
}