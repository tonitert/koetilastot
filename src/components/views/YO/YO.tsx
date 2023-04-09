import React from 'react';
import GraphBox from "../../containers/GraphBox";
import YODataParser, {Sex} from "../../data/YODataParser";
import StandardAreaChart from "./graphs/StandardAreaChart";
import {DataArray} from "./graphs/DataArray";
import {FilterState} from "./filters/FilterState";
import {FilterCard} from "./filters/FilterCard";
import YODateBasedStatistic from "./YODateBasedStatistic";
import YOStatGenerator from "./filters/YOStatGenerator";

export default class YO extends React.Component {

    props: {
        yoDataParser: YODataParser
    }

    state: {
        dataFilterWorker: Worker
        filterState: FilterState
        yoStatistics: YODateBasedStatistic[]
    } = {
        filterState: {
            season: "all",
            selectedSchools: new Set(),
            sex: Sex.All,
            selectedSubjects: new Set()
        },
        yoStatistics: [],
        dataFilterWorker: new Worker(new URL("./filters/DataProcessor.tsx", import.meta.url))
    }

    mounted: boolean = false;

    componentDidMount() {
        this.mounted = true;
        this.props.yoDataParser.addEventListener("update", this.handleDataUpdate.bind(this));
        this.props.yoDataParser.getData();
        let worker = this.state.dataFilterWorker;
        worker.onerror = (event) => {
            console.error(event.error)
        }
        worker.onmessage = (event) => {
            let workerYOStats: YODateBasedStatistic[] = event.data;
            this.setState({
                yoStatistics: YOStatGenerator.mergeStats(workerYOStats)
            })
        }
        this.setState({
            dataFilterWorker: worker
        })
    }

    componentWillUnmount() {
        this.mounted = false;
        this.props.yoDataParser.removeEventListener("update", this.handleDataUpdate);
        this.state.dataFilterWorker.terminate();
        this.state.dataFilterWorker.onmessage = null;
    }

    handleDataUpdate() {
        this.state.dataFilterWorker.postMessage({
            yoData: this.props.yoDataParser.yoData,
            filterState: this.state.filterState
        })
    }

    private runDataFilter(filterState: FilterState) {
        this.state.dataFilterWorker.postMessage({
            filterState: filterState
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

        return (
            <div>
                <h2 style={{color: "black"}}>Yleiset tilastot</h2>
                <FilterCard onFilterUpdate={(state) => {
                    this.onFilterUpdate(state)
                }} yoDataParser={this.props.yoDataParser}/>
                <div className="stat-container">
                    {this.state.yoStatistics.map((stat) => {
                            if(stat.display !== undefined && !stat.display(this.state.filterState)) return null;
                            return <GraphBox titleText={stat.name} views={[
                                {
                                    name: "",
                                    element: <StandardAreaChart dataArray={new DataArray(stat.dataPoints, stat.yAxisNames)}
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