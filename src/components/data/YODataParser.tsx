export enum Sex {
    Male,
    Female
}

export enum YOSeason {
    Spring = "Spring",
    Autumn = "Autumn"
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

    public toString() {
        return `${this.season}, ${this.year}`
    }
}

export interface YOSeasonData {
    candidates: YOCandidate[]
    count: number
}

export default class YODataParser {

    private static readonly YTL_DATA_URL = "/data/ytl/per-student"
    private static readonly SUBJECTS = {
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

    yoSeasons: Map<YODate, YOSeasonData> = new Map<YODate, YOSeasonData>()

    static async loadData(): Promise<YODataParser> {
        let yoSeasons: Map<YODate, YOSeasonData> = new Map<YODate, YOSeasonData>()
        let yoDates: YODate[] = (await (await fetch(this.YTL_DATA_URL + "/downloadedDates.json")).json())
            .map((val) => new YODate(val.year, val.season))
        for(let yoDate of yoDates) {
            try {
                yoSeasons.set(yoDate, await (await fetch(`${this.YTL_DATA_URL}/${yoDate.toJsonString()}`)).json());
            }
            catch (e) {
                console.warn("Exception while fetching:")
                console.warn(e)
            }
        }
        yoSeasons = new Map([...yoSeasons.entries()].sort((a,b) => {
            let seasonToNum = (d: YODate) => d.season === YOSeason.Autumn ? 1 : 0
            return (a[0].year * 2 + seasonToNum(a[0])) - (b[0].year * 2 + seasonToNum(b[0]))
        }));
        return new YODataParser(yoSeasons);
    }

    private constructor(yoSeasons: Map<YODate, YOSeasonData>) {
        this.yoSeasons = yoSeasons
    }

}