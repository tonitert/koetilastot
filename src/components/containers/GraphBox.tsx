import ViewSwitcher from "../ViewSwitcher";
import React from "react";

interface GraphBoxProps {
    titleText: string,
    views: {
        name: string
        icon?: string
        element: React.ReactElement
    }[],
    currentView: string
}

export default class GraphBox extends React.Component {

    props: GraphBoxProps

    render() {
        return (
            <div className="graph-box">
                <h3 style={{margin: "10px"}}>{this.props.titleText}</h3>
                <ViewSwitcher views={this.props.views} currentView={this.props.currentView}/>
            </div>
        );
    }
}