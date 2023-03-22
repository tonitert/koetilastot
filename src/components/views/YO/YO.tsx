import React from 'react';
import {GraphType} from "../../../graphs/GraphType";
import {Graph} from "../../../graphs/Graph";
import GraphBox from "../../containers/GraphBox";
import YODataParser, {YOSeason} from "../../data/YODataParser";
import GraphPoint from "../../../graphs/GraphPoint";

export default class YO extends React.Component {

    props: {
        yoDataParser: Promise<YODataParser>
    }

    state: {
        yoDataParser: YODataParser
    } = {
        yoDataParser: null
    }

    constructor(props) {
        super(props)
        this.props = props
        this.props.yoDataParser.then((parser) => {
            this.setState({
                yoDataParser: parser
            })
        })
    }

    render() {
        let graduatesPerYear: GraphPoint[] = []
        let graduatesSpring: GraphPoint[] = []
        let graduatesAutumn: GraphPoint[] = []
        if (this.state.yoDataParser !== null) {
            let lastVal = 0;
            for (let entry of this.state.yoDataParser.yoSeasons.entries()) {
                let point: GraphPoint = new GraphPoint(entry[1].count, entry[0].year, entry[0].toString())

                switch (entry[0].season) {
                    case YOSeason.Spring:
                        graduatesSpring.push(point)
                        lastVal = entry[1].count
                        break
                    case YOSeason.Autumn:
                        graduatesAutumn.push(point)
                        graduatesPerYear.push(
                            new GraphPoint(entry[1].count + lastVal, entry[0].year, entry[0].year.toString())
                        )
                        break
                }
            }
        }
        return (
            <div>
                <h2 style={{color: "black"}}>Yleiset tilastot</h2>
                <div className="stat-container">
                    <GraphBox titleText={"Valmistuneiden määrä"} views={[
                        {
                            name: "Syksy",
                            element: <Graph lines={[
                                {
                                    points: graduatesAutumn,
                                    type: GraphType.Fill,
                                    lineWidth: 3
                                }
                            ]
                            }/>

                        },
                        {
                            name: "Kevät", element: <Graph lines={[
                                {
                                    points: graduatesSpring,
                                    type: GraphType.Fill,
                                    lineWidth: 3
                                }
                            ]
                            }/>
                        },
                        {
                            name: "Kaikki",
                            element: <Graph lines={[
                                {
                                    points: graduatesPerYear,
                                    type: GraphType.Fill,
                                    lineWidth: 3
                                }
                            ]
                            }/>
                        }
                    ]} currentView={"Syksy"}/>
                    <GraphBox titleText={"Ilmoittautumiset YO-kokeisiin"} views={[
                        {
                            name: "Syksy",
                            element: <Graph lines={[
                                {
                                    points: [
                                        {timestamp: 0, y: 1, dateText: "2019"},
                                        {timestamp: 4, y: 3, dateText: "2019"},
                                        {timestamp: 10, y: 1, dateText: "2019"},
                                        {timestamp: 25, y: 14, dateText: "2019"}
                                    ],
                                    type: GraphType.Fill,
                                    lineWidth: 3
                                }
                            ]
                            }/>
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
                            element: <Graph lines={[
                                {
                                    points: [
                                        {timestamp: 0, y: 1, dateText: "2019"},
                                        {timestamp: 4, y: 3, dateText: "2019"},
                                        {timestamp: 10, y: 1, dateText: "2019"},
                                        {timestamp: 25, y: 14, dateText: "2019"}
                                    ],
                                    type: GraphType.Fill,
                                    lineWidth: 3
                                }
                            ]
                            }/>
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
                            element: <Graph lines={[
                                {
                                    points: [
                                        {timestamp: 0, y: 1, dateText: "2019"},
                                        {timestamp: 4, y: 3, dateText: "2019"},
                                        {timestamp: 10, y: 1, dateText: "2019"},
                                        {timestamp: 25, y: 14, dateText: "2019"}
                                    ],
                                    type: GraphType.Fill,
                                    lineWidth: 3
                                }
                            ]
                            }/>
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
                            element: <Graph lines={[
                                {
                                    points: [
                                        {timestamp: 0, y: 1, dateText: "2019"},
                                        {timestamp: 4, y: 3, dateText: "2019"},
                                        {timestamp: 10, y: 1, dateText: "2019"},
                                        {timestamp: 25, y: 14, dateText: "2019"}
                                    ],
                                    type: GraphType.Fill,
                                    lineWidth: 3
                                }
                            ]
                            }/>
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