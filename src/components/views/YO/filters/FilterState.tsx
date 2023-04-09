import {School, Sex, YOSubject} from "../../../data/YODataParser";

export interface FilterState {
    season?: "all" | "autumn" | "spring"
    selectedSchools?: Set<School>
    selectedSubjects?: Set<YOSubject>
    sex?: Sex
}