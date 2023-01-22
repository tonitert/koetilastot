import React from 'react';
import ReactProps from "./ReactProps";
import PageSectionBorder from "./PageSectionBorder";

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
      <div className={"page-section " + (this.props.className !== undefined ? this.props.className : "")}
           style={{backgroundColor: this.props.backgroundColor}}>
        <PageSectionBorder color={this.props.backgroundColor}/>
        {this.props.children}
      </div>
    );
  }
}