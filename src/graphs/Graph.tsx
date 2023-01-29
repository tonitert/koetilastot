import React, {ReactNode} from 'react';
import GraphProps from "./GraphProps";
import "./graphs.css";
import {ScaleSection} from "./ScaleSection";
import GraphLine from "./GraphLine";

export class Graph extends React.Component {
    props: GraphProps

    private maxVal: number = Number.MIN_VALUE;
    private minVal: number = Number.MAX_VALUE;

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
        console.log("ads")
    }

    render() {
        let lines: ReactNode[] = [];
        for (let line of this.props.lines) {
            for (let point of line.points) {
                this.maxVal = Math.max(point.y, this.maxVal)
                this.minVal = Math.min(point.y, this.minVal);
            }
        }
        for (let line of this.props.lines) {
            lines.push(<GraphLine points={line.points} type={line.type} maxVal={this.maxVal} minVal={this.minVal} lineWidth={line.lineWidth} background={line.background}/>)
        }

        let yLines = this.props.yLines === undefined ? 5 : this.props.yLines;
        let diff = this.maxVal - this.minVal;

        let scaleSectionArr: ReactNode[] = [];
        let currVal = this.maxVal - diff;
        let step = diff/yLines;

        for (let i = 0; i < yLines; i++) {
            scaleSectionArr.push(<ScaleSection noLine={i === 0} value={(currVal < 100 ? currVal.toFixed(1) : currVal.toFixed(0))}/>);
            currVal += step;
        }
        
        return (
            <div className="GraphContainer" style={this.props.style}>
                {this.props.children}
                <div className="y-scale">
                    {scaleSectionArr}
                </div>
                <div className="Graph">
                    {lines}
                </div>
            </div>
        );
    }
}