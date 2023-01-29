import React, {ReactNode} from 'react';
import {LineSegment} from "./LineSegment";
import LineProps from "./LineProps";
import GraphProps from "./GraphProps";

export default class GraphLine extends React.Component {

    props: LineProps

    divs: ReactNode[] = [];

    constructor(props) {
        super(props);
        this.updateDivs(props)
    }


    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
        this.updateDivs(this.props)
    }

    private updateDivs(props: LineProps) {
        if(props.points.length <= 1) return
        for (let i = 1; i < props.points.length-1; i++) {
            this.divs.push(<LineSegment
                key={i}
                startValue={props.points[i-1].y}
                endValue={props.points[i].y}
                width={props.points[i].timestamp - props.points[i-1].timestamp}
                maxValue={props.maxVal}
                graph={this}
                lastElement={false}
                dateText={props.points[i-1].dateText}
            />)
        }

        this.divs.push(<LineSegment
            key={props.points.length-1}
            startValue={props.points[props.points.length-2].y}
            endValue={props.points[props.points.length-1].y}
            width={props.points[props.points.length-1].timestamp - props.points[props.points.length-2].timestamp}
            maxValue={props.maxVal}
            graph={this}
            lastElement={true}
            dateText={props.points[props.points.length-2].dateText}
            endDateText={props.points[props.points.length-1].dateText}
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