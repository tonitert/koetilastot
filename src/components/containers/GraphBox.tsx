import ViewSwitcher from "../ViewSwitcher";
import React from "react";

interface GraphBoxProps {
    titleText: string,
    views: {
        name: string
        icon?: string
        element: React.ReactElement
    }[],
    currentView?: string
}

export default class GraphBox extends React.Component {

    props: GraphBoxProps

    render() {
        return (
            <div className="card graph-card">
                <h3 style={{margin: "10px"}}>{this.props.titleText}</h3>
                {this.props.views.length === 1 ?
                    this.props.views[0].element :
                    <ViewSwitcher views={this.props.views} currentView={this.props.currentView}/>}

            </div>
        );
    }
}