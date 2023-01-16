import {parse} from 'csv-parse/browser/esm';

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
}

export interface YOSeasonData {
    candidates: YOCandidate[]
}

export default class YOCSVParser {
    // private readonly YTL_BASE_URL = "https://www.ylioppilastutkinto.fi/ext/data/FT";
    private readonly YTL_BASE_URL = "https://www.ylioppilastutkinto.fi/ext/data/FT"

    // only the D4001 file exists for these
    private readonly LEGACY_YEARS = [2015, 2016]

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

    private cache: Map<YODate, YOCandidate[]> = new Map();

    private async startParser(start: YODate) {
        let currentYear = new Date().getFullYear();
        let promises: Promise<YOCandidate[]>[] = [];
        if(start.season === "S") {
            ++currentYear;
            promises.push(this.fetchSeason(new YODate(currentYear, YOSeason.Autumn)));
        }
        for (let year = start.year; year <= currentYear; year++) {
            promises.push(this.fetchSeason(new YODate(year, YOSeason.Spring)), this.fetchSeason(new YODate(year, YOSeason.Autumn)));
        }
        await Promise.all(promises);
    }

    private async fetchSeason(date: YODate): Promise<YOCandidate[]> {
        let res: Response;
        try{
            res = await fetch(this.YTL_BASE_URL + date.year + date.season + (this.LEGACY_YEARS.includes(date.year) ? "D3001" : "D4001"));
        }
        catch(e) {
            console.error("[DataParser] Fetching YO data failed.");
            console.error(e);
        }
        if(!res.ok){
            console.error("[DataParser] The YTL server responded with a non-successful status: " + res.status)
        }

        // Parse data

        let parser = parse({
            delimiter: ",",
            columns: true
        })
        parser.write(res.body)

        let candidates: YOCandidate[] = [];

        parser.on("readable", () => {
            let record: {
                [key: string]: string
            };
            while((record = parser.read()) !== null) {
                let candidate: YOCandidate = {
                    points: null, sex: null, subjects: {}, school: null
                };
                if(record.hasOwnProperty("yht")) candidate.points = Number(record.yht);
                if(record.hasOwnProperty("sukup")) candidate.sex = (record.sukup === "1" ? Sex.Male : Sex.Female);
                if(record.hasOwnProperty("koulun_nro")) candidate.school = Number(record.koulun_nro);
                candidates.push(candidate);
            }
        });

        this.cache.set(date, candidates);
        return candidates;
    }

    constructor(start: YODate) {
        this.startParser(start).then();
    }
}