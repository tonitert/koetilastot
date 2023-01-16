import React from 'react';
import ReactProps from "./ReactProps";

export interface PageSectionProps extends ReactProps {
    backgroundColor: string
    previousColor: string
    className?: string
}

export default class PageSection extends React.Component {

    props: PageSectionProps

    public static defaultProps = {
        previousColor: "#fff",
        backgroundColor: "#b698d9"
    }

    render() {
        return (
          <div className={"page-section " + (this.props.className !== undefined ? this.props.className : "")} style={{backgroundColor: this.props.backgroundColor}}>
              <div className={"page-section-before"} style={{backgroundImage: `radial-gradient(circle at 10px -5px, ${this.props.previousColor} 12px, ${this.props.backgroundColor} 13px)`}}></div>
              {this.props.children}
              <div className={"page-section-after"} style={{backgroundImage: `radial-gradient(circle at 10px 15px, ${this.props.backgroundColor} 12px, transparent 13px)`}}></div>
          </div>
        );
    }
}