import React, {CSSProperties} from "react";
import Selector from "./Selector";
import ReactProps from "./ReactProps";

export interface ViewSwitchCallback {
    (newView: ViewData): void
}

export interface ViewData {
    name: string
    icon?: string
    element: React.ReactElement
    color?: string
}

export interface ViewSwitcherProps extends ReactProps {
    views: ViewData[]
    currentView: string
    style?: CSSProperties
    onViewSwitch?: ViewSwitchCallback
}

export default class ViewSwitcher extends React.Component {
    props: ViewSwitcherProps
    state: {
        currentView: string
    }
    views: {
        [key: string]: ViewData
    }

    constructor(props: ViewSwitcherProps) {
        super(props);
        this.state = {
            currentView: props.currentView
        }
        this.views = {};
        for (let target of props.views) {
            this.views[target.name] = target
        }
    }

    render() {
        return (
            <div className={"view-switcher"} style={this.props.style}>
                <Selector targets={this.props.views} currentTarget={this.props.currentView} onStateChange={newState => {
                    if (this.props.onViewSwitch) {
                        this.props.onViewSwitch(this.views[newState]);
                    }
                    this.setState({
                        currentView: newState
                    })
                }}/>
                {
                    this.views[this.state.currentView].element
                }
            </div>
        );
    }
}