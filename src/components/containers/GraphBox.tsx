import ViewSwitcher from "../ViewSwitcher";
import React from "react";
import {BsArrowsFullscreen, BsX} from "react-icons/bs";

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

    state: {
        fullscreen: boolean
    } = {
        fullscreen: false
    }

    ref = React.createRef<HTMLDivElement>()

    private onFullscreenClick() {
        this.setState({
            fullscreen: !this.state.fullscreen
        })
    }

    render() {
        let elem = <div ref={this.ref} className={`card graph-card ${this.state.fullscreen ? "fullscreen" : ""}`}>
            <h3 style={{margin: "10px"}}>{this.props.titleText}<BsArrowsFullscreen onClick={() => this.onFullscreenClick()} style={{float: "right"}}/></h3>
            {this.props.views.length === 1 ?
                this.props.views[0].element :
                <ViewSwitcher views={this.props.views} currentView={this.props.currentView}/>}

        </div>
        if(this.state.fullscreen) {
            elem = <div className={"fullscreen-backdrop"}>
                {elem}
            </div>
        }
        return (
            elem
        );
    }
}