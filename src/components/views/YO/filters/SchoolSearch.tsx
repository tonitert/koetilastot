import React from "react";
import YODataParser, {School} from "../../../data/YODataParser";
import {BsX} from "react-icons/bs";

export class SchoolSearch extends React.Component {

    props: {
        yoDataParser: YODataParser
        onSelectionChange?: (selectedSchools: Set<School>) => void
    }

    state: {
        selectedSchools: Set<School>
        searchString: string
    } = {
        selectedSchools: new Set<School>(),
        searchString: ""
    }

    private onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if(this.props.yoDataParser === null) return;
        this.setState({
            searchString: event.target.value
        })
    }

    private updateSelection() {
        this.setState({
            selectedSchools: this.state.selectedSchools
        })
        if(this.props.onSelectionChange) this.props.onSelectionChange(this.state.selectedSchools)
    }

    private onResultClick(school: School, event: React.MouseEvent<HTMLButtonElement>) {
        this.state.selectedSchools.add(school)
        this.updateSelection()
    }

    private onSchoolRemove(school: School) {
        this.state.selectedSchools.delete(school)
        this.updateSelection()
    }

    private calculateSearchOptions(): School[] {
        // This has to be calculated every render
        let searchString = this.state.searchString;
        if(searchString === "") {
            return [];
        }
        let maxMatches = 3;
        let currentMatches = 0;
        let matches: School[] = [];
        for(let school of this.props.yoDataParser.yoData.schools) {
            if(school.schoolName.toLowerCase().includes(searchString.toLowerCase())) {
                if(this.state.selectedSchools.has(school)) continue;
                matches.push(school);
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
                    <input className="text-input" type="text" placeholder={"Hae lukioita.."} onChange={(e) => this.onInputChange(e)}/>
                    {matchingSchools.length > 0 ? <div className={"search-results"}>
                        {matchingSchools.map((school => <button className={"result"} onClick={(e) => this.onResultClick(school, e)}>
                            <div className={"result-paragraph-container"}>
                                <p>{school.schoolName}</p>
                            </div>
                        </button>))}
                    </div> : null}

                </div>
                <div className={"selected-results"}>
                    {this.state.selectedSchools.size === 0 ?
                        <div className={"result"}>
                            <div className={"result-paragraph-container"}>
                                <p className={"selected-placeholder"}>Ei vielä lukioita valittuna..</p>
                            </div>
                        </div> :
                        [...this.state.selectedSchools].map((school) =>
                            <button className={"result selected-result"} onClick={() => this.onSchoolRemove(school)}>
                                <div className={"result-paragraph-container"}>
                                    <p>{school.schoolName}</p>
                                    <div className={"search-result-close-btn"}><BsX size="20px"/></div>
                                </div>
                            </button>)}
                </div>
            </div>
        </div>
    }
}