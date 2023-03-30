import React from 'react';
import GraphBox from "../../containers/GraphBox";
import YODataParser, {YOSeason} from "../../data/YODataParser";
import {GraduationAmountDataPoint} from "./graphs/GraduationAmountDataPoint";
import StandardAreaChart from "./graphs/StandardAreaChart";
import {DataArray} from "./graphs/DataArray";
import Selector from "../../Selector";
import {FilterState} from "./filters/FilterState";

export default class YO extends React.Component {

    props: {
        yoDataParser: Promise<YODataParser>
    }

    state: {
        yoDataParser: YODataParser
        filterState: FilterState
    } = {
        yoDataParser: null,
        filterState: {
            season: "all"
        }
    }

    mounted: boolean = false;

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }



    constructor(props) {
        super(props)
        this.props = props
        this.props.yoDataParser.then((parser) => {
            if(this.mounted){
                this.setState({
                    yoDataParser: parser
                })
            } else {
                this.state.yoDataParser = parser
            }
        })
    }

    render() {
        let graduatesPerYear: GraduationAmountDataPoint[] = []
        let graduatesSpring: GraduationAmountDataPoint[] = []
        let graduatesAutumn: GraduationAmountDataPoint[] = []
        if (this.state.yoDataParser !== null) {
            let lastVal = 0;
            for (let entry of this.state.yoDataParser.yoSeasons.entries()) {
                let point: GraduationAmountDataPoint = new GraduationAmountDataPoint(entry[1].count, entry[0])
                switch (entry[0].season) {
                    case YOSeason.Spring:
                        graduatesSpring.push(point)
                        lastVal = entry[1].count
                        break
                    case YOSeason.Autumn:
                        graduatesAutumn.push(point)
                        graduatesPerYear.push(
                            new GraduationAmountDataPoint(entry[1].count + lastVal, entry[0].year)
                        )
                        break
                }
            }
        }

        let filterToData = {
            "all": graduatesPerYear,
            "spring": graduatesSpring,
            "autumn": graduatesAutumn
        }
        let graduated: GraduationAmountDataPoint[] = filterToData[this.state.filterState.season];
        return (
            <div>
                <h2 style={{color: "black"}}>Yleiset tilastot</h2>
                <div className={"card filter-card"}>
                    <h3>Suodata tietoja</h3>
                    <div className={"sort-options"}>
                        <div>
                            <p>Tutkinnon suoritusajan perusteella:</p>
                            <Selector targets={[{name: "Koko vuosi", id: "all"}, {name: "Syksy", id: "autumn"}, {name: "Kevät", id: "spring"}]} currentTarget={"all"} onStateChange={(seasonId) => {
                                this.setState({
                                    filterState: {
                                        season: seasonId
                                    }
                                })
                            }}/>
                        </div>
                    </div>

                </div>
                <div className="stat-container">
                    <GraphBox titleText={"Valmistuneiden määrä"} views={[
                        {
                            name: "Kaikki",
                            element: this.state.yoDataParser === null ? null : <StandardAreaChart dataArray={new DataArray(graduated, "Valmistuneita")}/>

                        }
                    ]} currentView={"Syksy"}/>
                    <GraphBox titleText={"Ilmoittautumiset YO-kokeisiin"} views={[
                        {
                            name: "Syksy",
                            element: null
                        },
                        {
                            name: "Kevät",
                            element: <div/>
                        },
                        {
                            name: "Kaikki",
                            element: <div/>
                        }
                    ]} currentView={"Syksy"}/>
                    <GraphBox titleText={"Ilmoittautumiset YO-kokeisiin"} views={[
                        {
                            name: "Syksy",
                            element: null
                        },
                        {
                            name: "Kevät",
                            element: <div/>
                        },
                        {
                            name: "Kaikki",
                            element: <div/>
                        }
                    ]} currentView={"Syksy"}/>
                    <GraphBox titleText={"Ilmoittautumiset YO-kokeisiin"} views={[
                        {
                            name: "Syksy",
                            element: null
                        },
                        {
                            name: "Kevät",
                            element: <div/>
                        },
                        {
                            name: "Kaikki",
                            element: <div/>
                        }
                    ]} currentView={"Syksy"}/>
                    <GraphBox titleText={"Ilmoittautumiset YO-kokeisiin"} views={[
                        {
                            name: "Syksy",
                            element: null
                        },
                        {
                            name: "Kevät",
                            element: <div/>
                        },
                        {
                            name: "Kaikki",
                            element: <div/>
                        }
                    ]} currentView={"Syksy"}/>
                </div>
            </div>
        );
    }
}