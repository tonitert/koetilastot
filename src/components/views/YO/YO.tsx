import React from 'react';
import GraphBox from "../../containers/GraphBox";
import YODataParser, {Sex, YOSeasonData} from "../../data/YODataParser";
import {DateBasedDataPoint} from "./graphs/DateBasedDataPoint";
import StandardAreaChart from "./graphs/StandardAreaChart";
import {DataArray} from "./graphs/DataArray";
import {FilterState} from "./filters/FilterState";
import {FilterCard} from "./filters/FilterCard";
import {DataFilter} from "./filters/DataFilter";
import YODateBasedStatistic from "./YODateBasedStatistic";

export default class YO extends React.Component {

    props: {
        yoDataParser: YODataParser
    }

    state: {
        dataFilter: DataFilter
        filterState: FilterState
        yoSeasonData: YOSeasonData[]
    } = {
        dataFilter: null,
        filterState: {
            season: "all",
            selectedSchools: new Set(),
            sex: Sex.All
        },
        yoSeasonData: null
    }

    mounted: boolean = false;

    constructor(props) {
        super(props);
        this.state.dataFilter = new DataFilter(props.yoDataParser);
    }

    componentDidMount() {
        this.mounted = true;
        this.props.yoDataParser.addEventListener("update", this.handleDataUpdate.bind(this));
        this.props.yoDataParser.getData();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.props.yoDataParser.removeEventListener("update", this.handleDataUpdate);
    }

    handleDataUpdate() {
        this.runDataFilter(this.state.filterState)
    }

    private runDataFilter(filterState: FilterState) {
        this.setState({
            yoSeasonData: this.state.dataFilter.filterData(filterState)
        })
    }

    private onFilterUpdate(filterState: FilterState) {
        let mergedFilterState = {
            ...this.state.filterState,
            ...filterState
        };
        this.setState({
            filterState: mergedFilterState
        });
        this.runDataFilter(mergedFilterState);
    }

    render() {
        let yoStatistics: YODateBasedStatistic[] = []
        if(this.state.yoSeasonData) {
            yoStatistics = [
                {
                    name: "Valmistuneiden määrä",
                    yAxisNames: ["Valmistuneita"],
                    dataPoints: this.state.yoSeasonData.map((seasonData) => new DateBasedDataPoint([seasonData.candidates.length], seasonData.date))
                },
                {
                    name: "Sukupuolijakauma",
                    yAxisNames: ["Miehet", "Naiset"],
                    colors: ["url(#mcolor)", "url(#fcolor)"],
                    display: () => this.state.filterState.sex === Sex.All,
                    dataPoints: this.state.yoSeasonData.map((seasonData): [YOSeasonData, [number, number]] => {
                        let male = seasonData.candidates.filter((candidate) => candidate.sex === Sex.Male).length;
                        let female = seasonData.candidates.length - male;
                        return [seasonData, [male, female]];
                    }).map((tuple => new DateBasedDataPoint([...tuple[1]], tuple[0].date))),
                    stacked: true,
                    defs:
                        <defs>
                            <linearGradient id="fcolor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f582ff" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#f582ff" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="mcolor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#022CFF" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#022CFF" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>,
                    stackOffset: "expand"
                },
                {
                    name: "Arvosanajakauma",
                    yAxisNames: ["I","A","B","C","M","E","L"],
                    colors: [
                        "rgba(0,255,42,0.5)",
                        "rgba(0,255,157,0.5)",
                        "rgba(0,247,255,0.5)",
                        "rgba(0,157,255,0.5)",
                        "rgba(0,89,255,0.5)",
                        "rgba(17,0,255,0.5)",
                        "rgba(153,0,255,0.5)"
                    ],
                    stacked: true,
                    stackOffset: "expand",
                    legend: true,
                    dataPoints: this.state.yoSeasonData.map((seasonData):
                    [YOSeasonData, [number, number, number, number, number, number, number]] => {
                        let getAmount = (num: number): number => seasonData.candidates.reduce((p, c) =>
                            p + Object.values(c.subjectPoints).reduce((p: number, grade: number) => grade === num ? ++p : p), 0);
                        return [seasonData,
                            [
                                getAmount(0),
                                getAmount(2),
                                getAmount(3),
                                getAmount(4),
                                getAmount(5),
                                getAmount(6),
                                getAmount(7)
                            ]]
                    }).map((tuple => new DateBasedDataPoint([...tuple[1]], tuple[0].date)))
                }
            ]
        }

        return (
            <div>
                <h2 style={{color: "black"}}>Yleiset tilastot</h2>
                <FilterCard onFilterUpdate={(state) => {
                    this.onFilterUpdate(state)
                }} yoDataParser={this.props.yoDataParser}/>
                <div className="stat-container">
                    {yoStatistics.map((stat) => {
                            if(stat.display !== undefined && !stat.display()) return null;
                            return <GraphBox titleText={stat.name} views={[
                                {
                                    name: "",
                                    element: this.state.yoSeasonData === null ? null : <StandardAreaChart dataArray={new DataArray(stat.dataPoints, stat.yAxisNames)}
                                                                                                          colors={stat.colors}
                                                                                                          unit={stat.unit}
                                                                                                          defs={stat.defs}
                                                                                                          stacked={stat.stacked}
                                                                                                          stackOffset={stat.stackOffset}
                                                                                                          legend={stat.legend}/>

                                }
                            ]} currentView={""}/>
                        }

                    )}
                </div>
            </div>
        );
    }
}