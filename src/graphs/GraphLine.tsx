import React, {ReactNode} from 'react';
import {LineSegment} from "./LineSegment";
import LineProps from "./LineProps";

export default class GraphLine extends React.Component {

    props: LineProps

    divs: ReactNode[] = [];

    constructor(props: LineProps) {
        super(props);
        this.props = props;
        for (let i = 1; i < this.props.points.length-1; i++) {
            this.divs.push(<LineSegment
                key={i}
                startValue={this.props.points[i-1].y}
                endValue={this.props.points[i].y}
                width={this.props.points[i].timestamp - this.props.points[i-1].timestamp}
                maxValue={this.props.maxVal}
                graph={this}
                lastElement={false}
                dateText={this.props.points[i-1].dateText}
            />)
        }

        this.divs.push(<LineSegment
            key={this.props.points.length-1}
            startValue={this.props.points[this.props.points.length-2].y}
            endValue={this.props.points[this.props.points.length-1].y}
            width={this.props.points[this.props.points.length-1].timestamp - this.props.points[this.props.points.length-2].timestamp}
            maxValue={this.props.maxVal}
            graph={this}
            lastElement={true}
            dateText={this.props.points[this.props.points.length-2].dateText}
            endDateText={this.props.points[this.props.points.length-1].dateText}
        />)
    }

    render() {
        return (
            <div className="graphLine">
                {
                    this.divs
                }
            </div>
        );
    }
}