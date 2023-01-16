import React from "react";

export default class Underline extends React.Component {

    props: {
        current: HTMLElement
    }

    state: {
        transition: boolean
    }

    constructor(props) {
        super(props);
        this.state = {
            transition: true
        }
        window.addEventListener('resize', () => {
            this.setState({
                transition: false
            })
        });
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
        if(!this.state.transition){
            this.setState({
                transition: true
            })
        }
    }

    render() {
        if(this.props.current === null) return null;
        return (
            <div className={"underline"} style={{left: this.props.current.offsetLeft + "px", top: this.props.current.offsetTop + "px", width: this.props.current.clientWidth, height: this.props.current.clientHeight, transition: this.state.transition ? undefined : "initial"}}>
            </div>
        );
    }
}