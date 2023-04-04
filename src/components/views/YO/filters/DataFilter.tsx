import YODataParser, {School, Sex, YODate, YOSeason, YOSeasonData} from "../../../data/YODataParser";
import {FilterState} from "./FilterState";

export class DataFilter {

    parser: YODataParser

    constructor(yoDataParser: YODataParser) {
        this.parser = yoDataParser
    }

    private filterBySex(sex: Sex, seasons: YOSeasonData[]): YOSeasonData[] {
        if (sex === Sex.All) return seasons;
        for (let season of seasons) {
            season.candidates = season.candidates.filter((candidate) => candidate.sex === sex);
        }
        return seasons;
    }

    private filterBySeason(season: YOSeason, seasons: YOSeasonData[]): YOSeasonData[]  {
        if(season !== YOSeason.All)
            return seasons.filter((seasonData) => seasonData.date.season === season);

        /**
         * Else we combine autumn and spring to get meaningful stats,
         * since autumn and spring aren't really comparable
         */

        let yoDateToString = (date: YODate) => date.season + date.year;

        let seasonMap: Map<string, YOSeasonData> = new Map();
        for (let season of seasons) {
            seasonMap.set(yoDateToString(season.date), season);
        }

        let newArray: YOSeasonData[] = []
        while (!seasonMap.values().next().done) {
            let yoSeasonData: YOSeasonData = seasonMap.values().next().value;
            seasonMap.delete(yoDateToString(yoSeasonData.date));
            let pairDate = Object.assign({}, yoSeasonData.date);
            pairDate.season = yoSeasonData.date.season === YOSeason.Spring ? YOSeason.Autumn : YOSeason.Spring;
            let pair = seasonMap.get(yoDateToString(pairDate));
            if (pair !== undefined) {
                seasonMap.delete(yoDateToString(pairDate))
                yoSeasonData.candidates = yoSeasonData.candidates.concat(pair.candidates)
                yoSeasonData.date.season = YOSeason.All;
                newArray.push(yoSeasonData)
                continue;
            }
            yoSeasonData.date.season = YOSeason.All;
            newArray.push(yoSeasonData);
        }
        return newArray;
    }

    private filterBySchool(schools: Set<School>, seasonsArray: YOSeasonData[]): YOSeasonData[] {
        let schoolsArray = [...schools.values()];
        if (schoolsArray.length === 0) return seasonsArray;
        let schoolNumbers = new Set(schoolsArray.map((school) => school.num));
        for (let seasonData of seasonsArray) {
            seasonData.candidates = seasonData.candidates.filter((candidate) =>
                schoolNumbers.has(candidate.schoolNumber))
        }
        return seasonsArray;
    }

    filterData(filterState: FilterState) : YOSeasonData[]{
        let seasonsArray: YOSeasonData[] = [];
        for (let season of this.parser.yoData.yoSeasons.values()) {
            seasonsArray.push(Object.assign(Object.create(Object.getPrototypeOf(season)), season))
        }

        // Clone candidate arrays to so that the data is not changed globally
        for (let season of seasonsArray) {
            season.candidates = [...season.candidates];
            // Clone class
            season.date = Object.assign(Object.create(Object.getPrototypeOf(season.date)), season.date)
        }
        seasonsArray = this.filterBySex(filterState.sex, seasonsArray);
        seasonsArray = this.filterBySeason(filterState.season as YOSeason, seasonsArray)
        seasonsArray = this.filterBySchool(filterState.selectedSchools, seasonsArray);

        return seasonsArray;
    }
}