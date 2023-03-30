import React, {ReactElement} from "react";
import SelectorButton from "./SelectorButton";
import Underline from "./Underline";

export interface ViewSwitcherProps {
    targets: {
        icon?: string
        id?: string
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
        [key: string]: {
            elementRef: React.RefObject<HTMLButtonElement>
            target: {
                icon?: string
                id?: string
                name: string
            }
        }
    } = {}
    constructor(props: ViewSwitcherProps) {
        super(props);
        this.state = {
            cur: props.currentTarget,
            currentButton: null
        }

        for (let target of props.targets) {
            if(!target.id) {
                target.id = target.name
            }
            this.elements[target.id] = {
                elementRef: React.createRef<HTMLButtonElement>(),
                target: target
            }
        }
    }

    handleClick(name: string, e: React.MouseEvent<Element>){
        try{
            this.props.onStateChange(name);
        }
        catch (e) {
            console.error("Uncaught exception in event handler:")
            console.error(e)
        }
        this.setState({
            cur: name,
            currentButton: e.currentTarget
        })
    }

    componentDidMount() {
        this.setState({
            currentButton: this.elements[this.state.cur].elementRef.current
        })
    }

    render() {
        return (<div className={"view-switch-buttons"}>
            {
                (() => {
                    let btns: ReactElement[] = [];
                    Object.values(this.elements).forEach((e) => {
                        btns.push(<SelectorButton button={this.elements[e.target.id].elementRef} icon={e.target.icon} name={e.target.name}
                                                  onClick={(ev) =>
                                                      this.handleClick(e.target.id, ev)}
                                                  current={this.state.cur === e.target.id}/>)
                    })
                    return btns;
                })()
            }
            <Underline current={this.state.currentButton}/>
        </div>);
    }
}