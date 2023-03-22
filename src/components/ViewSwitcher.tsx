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

    constructor(props) {
        super(props);
        this.state = {
            currentView: props.currentView
        }
    }

    private getView = (viewName: string) => this.props.views.find(view => view.name === viewName)

    render() {
        return (
            <div className={"view-switcher"} style={this.props.style !== undefined ? this.props.style : null}>
                <Selector targets={this.props.views} currentTarget={this.props.currentView} onStateChange={newState => {
                    if (this.props.onViewSwitch) {
                        this.props.onViewSwitch(this.getView(newState));
                    }
                    this.setState({
                        currentView: newState
                    })
                }}/>
                {
                    this.getView(this.state.currentView).element
                }
            </div>
        );
    }
}