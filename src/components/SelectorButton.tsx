import React, {MouseEventHandler, RefObject} from 'react';

export interface SelectorButtonProps {
    icon: string
    name: string
    onClick: MouseEventHandler
    current: boolean
    button: RefObject<HTMLButtonElement>
}

export default class SelectorButton extends React.Component {

    props: SelectorButtonProps

    /* <img src={this.props.icon} alt={}/> */
    render() {
        return (<button ref={this.props.button} className={"view-switch-button"} onClick={this.props.onClick}>
            <p style={{marginTop: 0, marginBottom: 0}}>{this.props.name}</p>
        </button>);
    }
}