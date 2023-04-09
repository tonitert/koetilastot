import Selector from "../../../Selector";
import React from "react";
import "./Filters.css"
import YODataParser, {School, Sex, YOSubject} from "../../../data/YODataParser";
import {SearchSelector} from "./SearchSelector";
import {FilterState} from "./FilterState";

export class FilterCard extends React.Component{

    props: {
        onFilterUpdate: (filterState: FilterState) => void
        yoDataParser: YODataParser
    }

    state: {
        schools: School[]
        subjects: YOSubject[]
    } = {
        schools: null,
        subjects: null
    }

    private onUpdateListener() {
        this.setState({
            schools: this.props.yoDataParser.yoData.schools,
            subjects: Object.values(this.props.yoDataParser.yoData.subjects)
        })
    }

    componentDidMount() {
        this.props.yoDataParser.addEventListener("update", this.onUpdateListener.bind(this));
    }

    componentWillUnmount() {
        this.props.yoDataParser.removeEventListener("update", this.onUpdateListener);
    }

    render() {
        return <div className={"card filter-card"}>
            <h3>Suodata tietoja</h3>
            {this.props.yoDataParser === null ? null :
                <div className={"sort-options"}>
                    <div>
                        <p>Tutkinnon suoritusaika</p>
                        <Selector targets={[{name: "Koko vuosi", id: "all"}, {name: "Syksy", id: "autumn"}, {name: "Kevät", id: "spring"}]}
                                  currentTarget={"all"}
                                  onStateChange={(seasonId) => {
                            this.props.onFilterUpdate({season: seasonId as ("all" | "autumn" | "spring")})
                        }}/>
                    </div>
                    <div>
                        <p>Sukupuoli</p>
                        <Selector targets={[{name: "Kaikki", id: "All"}, {name: "Mies", id: "Male"}, {name: "Nainen", id: "Female"}]}
                                  currentTarget={"All"} onStateChange={(sex) => {
                            this.props.onFilterUpdate({sex: sex as unknown as Sex})
                        }}/>
                    </div>
                    <div>
                        <p>Lukio</p>
                        <SearchSelector values={this.state.schools} placeholder={"Hae lukioita.."} noValuesSelectedMessage={"Ei vielä lukioita valittuna.."} onSelectionChange={(selectedSchools) => {
                          this.props.onFilterUpdate({
                                selectedSchools: selectedSchools as Set<School>
                          })
                        }}/>
                    </div>
                    <div>
                        <p>Aine</p>
                        <SearchSelector values={this.state.subjects} placeholder={"Hae aineita.."} noValuesSelectedMessage={"Ei vielä aineita valittuna.."} onSelectionChange={(selectedSubjects) => {
                            this.props.onFilterUpdate({
                                selectedSubjects: selectedSubjects as Set<YOSubject>
                            })
                        }}/>
                    </div>
                </div>
            }
        </div>
    }
}