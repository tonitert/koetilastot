export enum Sex {
    Male,
    Female
}

export enum YOSeason {
    Spring = "K",
    Autumn = "S"
}

export interface YOCandidate {
    sex: Sex,
    points: number
    subjects: {
        [key: string]: number
    },
    school: number
}

export class YODate {
    year: number
    season: YOSeason

    constructor(year: number, season: YOSeason) {
        this.year = year;
        this.season = season;
    }

    public toJsonString() {
        return `${this.season.toString()}_${this.year}.json`
    }
}

export interface YOSeasonData {
    candidates: YOCandidate[]
}

export default class YODataParser {

    private readonly YTL_DATA_URL = "/data/ytl/per-student"
    private readonly SUBJECTS = {
        "A":"a",
        "O":"a",
        "Z":"a",
        "I":"a",
        "W":"a",
        "Q":"a",
        "A5":"a",
        "O5":"a",
        "M":"a",
        "N":"a",
        "BI":"a",
        "FF":"a",
        "FY":"a",
        "HI":"a",
        "PS":"a",
        "UE":"a",
        "UO":"a",
        "ET":"a",
        "GE":"a",
        "KE":"a",
        "TE":"a",
        "YH":"a",
        "BA":"a",
        "BB":"a",
        "CA":"a",
        "CB":"a",
        "EA":"a",
        "FA":"a",
        "SA":"a",
        "PA":"a",
        "VA":"a",
        "EC":"a",
        "FC":"a",
        "SC":"a",
        "PC":"a",
        "VC":"a",
        "DC":"a",
        "IC":"a",
        "QC":"a",
        "GC":"a",
        "TC":"a",
        "L1":"a",
        "L7":"a"
    }

    yoSeasons: Map<YODate, YOSeason>

    private async loadData() {
        let yoDates: YODate[] = (await (await fetch(this.YTL_DATA_URL + "/downloadedDates.json")).json()).map((val) => new YODate(val.year, val.season))
        for(let yoDate of yoDates) {
            this.yoSeasons.set(yoDate, await (await fetch(`${this.YTL_DATA_URL}/${yoDate.toJsonString()}`)).json());
        }
    }

    constructor() {
        this.loadData()
    }
}