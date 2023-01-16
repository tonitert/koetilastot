import React from 'react';
import PageSection from "./PageSection";
import ReactProps from "./ReactProps";

export interface FooterProps extends ReactProps {
    previousColor: string
}

export default class Footer extends React.Component {

    props: FooterProps

    render() {
        return (
            <PageSection backgroundColor={"#2f2f2f"} previousColor={this.props.previousColor}>
                <div className={"footer"}>
                    <h2>Koetilastot</h2>
                    <p>Kehittänyt <a href={"https://tertsonen.xyz"}>Toni Tertsonen</a></p>
                    <a href={"https://github.com/t0nero/koetilastot"}>GitHub</a>
                </div>
            </PageSection>
        );
    }
}