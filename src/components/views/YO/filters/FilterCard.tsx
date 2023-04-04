import Selector from "../../../Selector";
import React from "react";
import "./Filters.css"
import YODataParser, {Sex} from "../../../data/YODataParser";
import {SchoolSearch} from "./SchoolSearch";
import {FilterState} from "./FilterState";

export class FilterCard extends React.Component{

    props: {
        onFilterUpdate: (filterState: FilterState) => void
        yoDataParser: YODataParser
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
                        <SchoolSearch yoDataParser={this.props.yoDataParser} onSelectionChange={(selectedSchools) => {
                          this.props.onFilterUpdate({
                                selectedSchools: selectedSchools
                          })
                        }}/>
                    </div>
                </div>
            }

        </div>
    }
}