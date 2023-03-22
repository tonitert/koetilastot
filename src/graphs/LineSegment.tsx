import React from 'react';
import GraphLine from "./GraphLine";
import {GraphType} from "./GraphType";

interface SegmentProps {
    startValue: number
    endValue: number
    width: number
    maxValue: number
    minValue: number
    graph: GraphLine
    lastElement: boolean
    dateText: string
    endDateText?: string
}

export class LineSegment extends React.Component {
    props: SegmentProps

    private calculatePositionClassName(yValue: number) {
        let avgValue: number = (this.props.maxValue - this.props.minValue) / 2;
        return yValue < avgValue ? "line-segment-date-text-above" : "line-segment-date-text-below"
    }

    render() {
        let style = {
            clipPath: null,
            background: "linear-gradient(0deg, #3333f299 0, #ADD8E697 100%)"
        }
        let startValue: number = (this.props.startValue - this.props.minValue) * 0.95
        let endValue: number = (this.props.endValue - this.props.minValue) * 0.95
        let divider: number = this.props.maxValue - this.props.minValue
        switch (this.props.graph.props.type) {
            case GraphType.Fill:
                style.clipPath = "polygon(0 " + ((1 - startValue / divider) * 100 - 5) + "%, 100% " + ((1 - endValue / divider) * 100 - 5) + "%, 100% 100%, 0 100%)";
                break;
            case GraphType.Line:
                style.clipPath = "polygon(0 " + (1 - startValue / divider) * 100 + "%, 100% " + (1 - endValue / divider) * 100 + "%, 100% calc("+ (1 - endValue / divider) * 100 + "% - " + this.props.graph.props.lineWidth + "px), 0 calc("+ (1 - startValue / divider) * 100 + "% - " + this.props.graph.props.lineWidth + "px))"
                break;
        }
        if(this.props.graph.props.background != null) {
            style.background = this.props.graph.props.background;
        }

        return (
            <div className={"line-segment-container"} style={{flexGrow: this.props.width}}>
                <div className="graph-point" style={{bottom: "calc(" + (startValue / divider * 100 + 5) + "% - 5px)"}}>
                    <div className={`line-segment-date-text ${this.calculatePositionClassName(startValue)}`}>
                        <p>{this.props.dateText}</p>
                    </div>
                </div>
                <div className="line-segment" style={style}/>
                {
                    (() => this.props.lastElement ?
                        <div className="graph-point end" style={{bottom: "calc(" + (endValue / divider * 100 + 5) + "% - 5px)"}}>
                            <div className={`line-segment-date-text end ${this.calculatePositionClassName(endValue)}`}>
                                <p>{this.props.endDateText}</p>
                            </div>
                        </div>: null)()
                }
            </div>
        );
    }
}