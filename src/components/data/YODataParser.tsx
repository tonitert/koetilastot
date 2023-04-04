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
    subjects: {
        [key: string]: number
    },
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

export interface School {
    schoolName: string
    num: number
}

export class YOData {
    readonly yoSeasons: Map<YODate, YOSeasonData>
    readonly schools: School[]

    constructor(yoSeasons: Map<YODate, YOSeasonData>, schools: School[]) {
        this.yoSeasons = yoSeasons;
        this.schools = schools;
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
                let schoolsObject = (await (await fetch(YODataParser.YTL_DATA_URL + "/schools.json")).json());
                yoSeasons = new Map([...yoSeasons.entries()].sort((a,b) => {
                    let seasonToNum = (d: YODate) => d.season === YOSeason.Autumn ? 1 : 0
                    return (a[0].year * 2 + seasonToNum(a[0])) - (b[0].year * 2 + seasonToNum(b[0]))
                }));
                this._yoData = new YOData(yoSeasons, schoolsObject.schools);
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