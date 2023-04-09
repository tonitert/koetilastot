import React from "react";
import {BsX} from "react-icons/bs";
import Selectable from "./Selectable";

export class SearchSelector extends React.Component {

    props: {
        values: Selectable[]
        onSelectionChange?: (selectedSchools: Set<Selectable>) => void
        placeholder: string,
        noValuesSelectedMessage: string
    }

    state: {
        selectedValues: Set<Selectable>
        searchString: string
    } = {
        selectedValues: new Set<Selectable>(),
        searchString: ""
    }

    private onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if(this.props.values === null) return;
        this.setState({
            searchString: event.target.value
        })
    }

    private updateSelection() {
        this.setState({
            selectedSchools: this.state.selectedValues
        })
        if(this.props.onSelectionChange) this.props.onSelectionChange(this.state.selectedValues)
    }

    private onResultClick(value: Selectable, event: React.MouseEvent<HTMLButtonElement>) {
        this.state.selectedValues.add(value)
        this.updateSelection()
    }

    private onSchoolRemove(school: Selectable) {
        this.state.selectedValues.delete(school)
        this.updateSelection()
    }

    private calculateSearchOptions(): Selectable[] {
        // This has to be calculated every render
        let searchString = this.state.searchString;
        if(searchString === "") {
            return [];
        }
        let maxMatches = 3;
        let currentMatches = 0;
        let matches: Selectable[] = [];
        for(let selectable of this.props.values) {
            if(selectable.searchName.toLowerCase().includes(searchString.toLowerCase())) {
                if(this.state.selectedValues.has(selectable)) continue;
                matches.push(selectable);
                ++currentMatches;
                if (currentMatches === maxMatches) break;
            }
        }
        return matches;
    }


    render() {
        let matchingSchools = this.calculateSearchOptions();

        return <div className={"filter-search"}>
            <div className={"filter-search-flex"}>
                <div className={"search-bar"}>
                    <input className="text-input" type="text" placeholder={this.props.placeholder} onChange={(e) => this.onInputChange(e)}/>
                    {matchingSchools.length > 0 ? <div className={"search-results"}>
                        {matchingSchools.map((school => <button className={"result"} onClick={(e) => this.onResultClick(school, e)}>
                            <div className={"result-paragraph-container"}>
                                <p>{school.searchName}</p>
                            </div>
                        </button>))}
                    </div> : null}

                </div>
                <div className={"selected-results"}>
                    {this.state.selectedValues.size === 0 ?
                        <div className={"result"}>
                            <div className={"result-paragraph-container"}>
                                <p className={"selected-placeholder"}>{this.props.noValuesSelectedMessage}</p>
                            </div>
                        </div> :
                        [...this.state.selectedValues].map((selectable) =>
                            <button className={"result selected-result"} onClick={() => this.onSchoolRemove(selectable)}>
                                <div className={"result-paragraph-container"}>
                                    <p>{selectable.searchName}</p>
                                    <div className={"search-result-close-btn"}><BsX size="20px"/></div>
                                </div>
                            </button>)}
                </div>
            </div>
        </div>
    }
}