import React from 'react';
import ReactProps from "./ReactProps";

export interface PageSectionBorderProps extends ReactProps {
  color: string
}

export default abstract class PageSectionBorder extends React.Component {

  props: PageSectionBorderProps

  render() {
    return (
      <div className={"page-section-border"}>
        <svg height="25.135" width="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={this.props.color.replace("#", "") + "wave"} width="52.916001" height="25.135" patternUnits="userSpaceOnUse">
              <path d="m0 25.135c13.229 0 13.229-25.135 26.458-25.135s13.229 25.135 26.458 25.135" fill={this.props.color}/>
            </pattern>
          </defs>
          <rect width="100%" height="25.135" fill={"url(" + this.props.color + "wave)"}/>
        </svg>
      </div>
    )
  }
}