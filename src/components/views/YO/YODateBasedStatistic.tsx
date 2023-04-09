import InternalYODateBasedStatistic from "./InternalYODateBasedStatistic";
import {DateBasedDataPoint} from "./graphs/DateBasedDataPoint";

export default interface YODateBasedStatistic extends InternalYODateBasedStatistic {
    dataPoints: DateBasedDataPoint[]
}