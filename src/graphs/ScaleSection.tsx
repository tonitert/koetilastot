import React from "react";

export class ScaleSection extends React.Component {

    props: {
        value: string
        noLine?: boolean
    }

    render() {
        return (<div className={"scale-section"}>
            <p style={{margin: "0 0 0 0"}}>{this.props.value}</p>
            {!this.props.noLine ? <div className={"scale-line"}/> : null}

        </div>);
    }
}