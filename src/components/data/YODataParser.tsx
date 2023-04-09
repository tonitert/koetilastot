import Selectable from "../views/YO/filters/Selectable";

export enum Sex {
    Male = "Male",
    Female = "Female",
    All = "All"
}

export enum YOSeason {
    Spring = "spring",
    Autumn = "autumn",
    All = "all"
}

export interface YOCandidate {
    sex: Sex,
    points: number
    subjectPoints: Record<string, number>,
    schoolNumber: number
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
    date: YODate
}

export class School implements Selectable {
    name: string
    num: number

    get searchName(): string {
        return this.name;
    }

    constructor(name: string, num: number) {
        this.name = name;
        this.num = num;
    }
}

export class YOSubject implements Selectable {
    shortName: string
    finName: string
    sweName: string

    get searchName(): string {
        return this.finName;
    }

    constructor(shortName: string, finName: string, sweName: string) {
        this.shortName = shortName;
        this.finName = finName;
        this.sweName = sweName;
    }
}

export class YOData {
    readonly yoSeasons: Map<YODate, YOSeasonData>
    readonly schools: School[]
    readonly subjects: Record<string, YOSubject>

    constructor(yoSeasons: Map<YODate, YOSeasonData>, schools: School[], subjects: Record<string, YOSubject>) {
        this.yoSeasons = yoSeasons;
        this.schools = schools;
        this.subjects = subjects;
    }
}

export class DataUpdatedEvent extends Event {
    data: YOData

    constructor(data: YOData, eventInitDict?: EventInit) {
        super("update", eventInitDict);
        this.data = data;
    }
}

export default class YODataParser extends EventTarget {

    private static readonly YTL_DATA_URL = "/data/ytl/per_student"

    private _yoData: YOData = null;

    private updatePromise: Promise<YOData> = null

    private fetchInProgress = false;

    public get yoData(): YOData {
        return this._yoData;
    }

    public get dataLoaded(): boolean{
        return this._yoData !== null;
    }

    /**
     * Gets the data, fetching from the internet if not already loaded.
     */
    public async getData(): Promise<YOData> {
        if(this.fetchInProgress) return this.updatePromise;
        return this.updateData();
    }


    /**
     * Fetches new data from the internet.
     */
    public updateData(): Promise<YOData> {
        if(this.fetchInProgress)
            return this.updatePromise;
        let promise = new Promise<YOData>(async (resolve, reject) => {
            this.fetchInProgress = true;
            try {
                let yoSeasons: Map<YODate, YOSeasonData> = new Map<YODate, YOSeasonData>()
                let yoDates: YODate[] = (await (await fetch(YODataParser.YTL_DATA_URL + "/downloadedDates.json")).json())
                    .map((val) => new YODate(val.year, val.season.toLowerCase()))
                for(let yoDate of yoDates) {
                    try {
                        let seasonData: YOSeasonData = await (await fetch(`${YODataParser.YTL_DATA_URL}/${yoDate.toJsonString()}`)).json();
                        seasonData.date = yoDate;
                        yoSeasons.set(yoDate, seasonData);
                    }
                    catch (e) {
                        console.warn("Exception while fetching:")
                        console.warn(e)
                    }
                }
                let subjectEntries: [string, YOSubject][] = Object.entries((await (await fetch(YODataParser.YTL_DATA_URL + "/subjects.json")).json()).subjects);
                let subjects: Record<string, YOSubject> = {};
                for (let subjectEntry of subjectEntries) {
                    subjects[subjectEntry[0]] = new YOSubject(subjectEntry[1].shortName, subjectEntry[1].finName, subjectEntry[1].sweName);
                }

                let rawSchoolArray = (await (await fetch(YODataParser.YTL_DATA_URL + "/schools.json")).json());
                let schools = rawSchoolArray.schools.map(rawSchool => new School(rawSchool.name, rawSchool.num));
                yoSeasons = new Map([...yoSeasons.entries()].sort((a,b) => {
                    let seasonToNum = (d: YODate) => d.season === YOSeason.Autumn ? 1 : 0
                    return (a[0].year * 2 + seasonToNum(a[0])) - (b[0].year * 2 + seasonToNum(b[0]))
                }));
                this._yoData = new YOData(yoSeasons, schools, subjects);
                this.fetchInProgress = false;
                this.dispatchEvent(new DataUpdatedEvent(this._yoData));
                resolve(this._yoData)
            }
            catch(e) {
                this.fetchInProgress = false;
                reject(e);
            }
        });
        this.updatePromise = promise;
        return promise;
    }
}