import React from 'react';
import GraphLine from "./GraphLine";
import {GraphType} from "./GraphType";

interface SegmentProps {
    startValue: number
    endValue: number
    width: number
    maxValue: number
    graph: GraphLine
    lastElement: boolean
    dateText: string
    endDateText?: string
}

export class LineSegment extends React.Component {
    props: SegmentProps

    render() {
        let style = {
            clipPath: null,
            background: "linear-gradient(0deg, #3333f299 0, #ADD8E697 100%)"
        }
        switch (this.props.graph.props.type) {
            case GraphType.Fill:
                style.clipPath = "polygon(0 " + (1 - this.props.startValue / this.props.maxValue) * 100 + "%, 100% " + (1 - this.props.endValue / this.props.maxValue) * 100 + "%, 100% 100%, 0 100%)";
                break;
            case GraphType.Line:
                style.clipPath = "polygon(0 " + (1 - this.props.startValue / this.props.maxValue) * 100 + "%, 100% " + (1 - this.props.endValue / this.props.maxValue) * 100 + "%, 100% calc("+ (1 - this.props.endValue / this.props.maxValue) * 100 + "% - " + this.props.graph.props.lineWidth + "px), 0 calc("+ (1 - this.props.startValue / this.props.maxValue) * 100 + "% - " + this.props.graph.props.lineWidth + "px))"
                break;
        }
        if(this.props.graph.props.background != null) {
            style.background = this.props.graph.props.background;
        }
        return (
            <div className={"line-segment-container"} style={{flexGrow: this.props.width}}>
                <div className="graph-point" style={{bottom: "calc(" + this.props.startValue / this.props.maxValue * 100 + "% - 5px)"}}>
                    <div className={"line-segment-date-text"}>
                        <p>{this.props.dateText}</p>
                    </div>
                </div>
                <div className="line-segment" style={style}/>
                {
                    (() => this.props.lastElement ?
                        <div className="graph-point end" style={{bottom: "calc(" + this.props.endValue / this.props.maxValue * 100 + "% - 5px)"}}>
                            <div className={"line-segment-date-text end"}>
                                <p>{this.props.endDateText}</p>
                            </div>
                        </div>: null)()
                }
            </div>
        );
    }
}