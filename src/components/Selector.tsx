import React, {ReactElement, RefObject} from "react";
import SelectorButton from "./SelectorButton";
import Underline from "./Underline";

export interface ViewSwitcherProps {
    targets: {
        icon?: string
        name: string
    }[],
    currentTarget: string,
    onStateChange: (newState: string) => void
}

export default class Selector extends React.Component {

    state: {
        cur: string
        currentButton: HTMLButtonElement
    }

    props: ViewSwitcherProps

    elements: {
        [key: string]: RefObject<HTMLButtonElement>
    }

    constructor(props: ViewSwitcherProps) {
        super(props);
        this.state = {
            cur: props.currentTarget,
            currentButton: null
        }
        this.elements = {};
        for (let target of props.targets) {
            this.elements[target.name] = React.createRef<HTMLButtonElement>();
        }
    }

    handleClick(name: string, e: React.MouseEvent<Element>){
        this.props.onStateChange(name);
        this.setState({
            cur: name,
            currentButton: e.currentTarget
        })
    }

    componentDidMount() {
        this.setState({
            currentButton: this.elements[this.state.cur].current
        })
    }

    render() {
        return (<div className={"view-switch-buttons"}>
            {
                (() => {
                    let btns: ReactElement[] = [];
                    this.props.targets.forEach((e) => {
                        btns.push(<SelectorButton button={this.elements[e.name]} icon={e.icon} name={e.name} onClick={(ev) => this.handleClick(e.name, ev)} current={this.state.cur === e.name}/>)
                    })
                    return btns;
                })()
            }
            <Underline current={this.state.currentButton}/>
        </div>);
    }
}