import {School, Sex} from "../../../data/YODataParser";

export interface FilterState {
    season?: "all" | "autumn" | "spring"
    selectedSchools?: Set<School>
    sex?: Sex
}