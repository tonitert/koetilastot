import React from 'react';
import {GraphType} from "../../../graphs/GraphType";
import {Graph} from "../../../graphs/Graph";
import YOCSVParser from "../../data/YOCSVParser";
import GraphBox from "../../containers/GraphBox";

export default class YO extends React.Component {

  yoDataParser: YOCSVParser

  constructor(props) {
    super(props);
    //this.yoDataParser = new YODataParser(new YODate(2015, YOSeason.Spring));
  }

  render() {
    return (
      <div>
        <h2 style={{color: "black"}}>Yleiset tilastot</h2>
        <div className="stat-container">
          <GraphBox titleText={"Valmistuneiden määrä"} views={[
            {
              name: "Syksy",
              // <Graph lines={[<GraphLine points={} background={"lightblue"} type={GraphType.Fill} lineWidth={3}/>]}/>
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