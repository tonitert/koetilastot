import InternalYODateBasedStatistic from "../InternalYODateBasedStatistic";
import {Sex, YOSeasonData} from "../../../data/YODataParser";
import {DateBasedDataPoint} from "../graphs/DateBasedDataPoint";
import React from "react";
import {FilterState} from "./FilterState";
import {runningInWorker} from "../Utils";
import YODateBasedStatistic from "../YODateBasedStatistic";

export default class YOStatGenerator {
     static readonly yoStats: InternalYODateBasedStatistic[] = [
        {
            name: "Valmistuneiden määrä",
            yAxisNames: ["Valmistuneita"],
            _dataPointGenerator: (yoSeasonData: YOSeasonData[]) => yoSeasonData.map((seasonData) => new DateBasedDataPoint([seasonData.candidates.length], seasonData.date))
        },
        {
            name: "Sukupuolijakauma",
            yAxisNames: ["Miehet", "Naiset"],
            colors: ["url(#mcolor)", "url(#fcolor)"],
            display: (filterState: FilterState) => filterState.sex === Sex.All,
            _dataPointGenerator: (yoSeasonData: YOSeasonData[]) => yoSeasonData.map((seasonData): [YOSeasonData, [number, number]] => {
                let male = seasonData.candidates.filter((candidate) => candidate.sex === Sex.Male).length;
                let female = seasonData.candidates.length - male;
                return [seasonData, [male, female]];
            }).map((tuple => new DateBasedDataPoint([...tuple[1]], tuple[0].date))),
            stacked: true,
            defs:
                <defs>
                    <linearGradient id="fcolor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f582ff" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#f582ff" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="mcolor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#022CFF" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#022CFF" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>,
            stackOffset: "expand"
        },
        {
            name: "Arvosanajakauma",
            yAxisNames: ["I", "A", "B", "C", "M", "E", "L"],
            colors: [
                "rgba(0,255,42,0.5)",
                "rgba(0,255,157,0.5)",
                "rgba(0,247,255,0.5)",
                "rgba(0,157,255,0.5)",
                "rgba(0,89,255,0.5)",
                "rgba(17,0,255,0.5)",
                "rgba(153,0,255,0.5)"
            ],
            stacked: true,
            stackOffset: "expand",
            legend: true,
            _dataPointGenerator: (yoSeasonData: YOSeasonData[], filterState: FilterState) => {
                let subjectStrings = new Set<string>();
                for (let value of filterState.selectedSubjects.values()) {
                    subjectStrings.add(value.shortName);
                }

                return yoSeasonData.map((seasonData):
                [YOSeasonData, [number, number, number, number, number, number, number]] => {
                    let getAmount = (num: number): number => seasonData.candidates.reduce((p, c) => {
                        return p + Object.entries(c.subjectPoints).reduce((p: number, entry: [string, number]) => {
                            return (subjectStrings.size === 0 || subjectStrings.has(entry[0])) && entry[1] === num ? ++p : p
                        }, 0);
                    }, 0);
                    return [seasonData,
                        [
                            getAmount(0),
                            getAmount(2),
                            getAmount(3),
                            getAmount(4),
                            getAmount(5),
                            getAmount(6),
                            getAmount(7)
                        ]]
                }).map((tuple => new DateBasedDataPoint([...tuple[1]], tuple[0].date)))
            }
        }
    ];

    static getStats(yoSeasonData: YOSeasonData[], filterState: FilterState): InternalYODateBasedStatistic[] {
        const nonCloneableProperties = ["display", "defs", "_dataPointGenerator"]

        if (runningInWorker()) {
            let newYOStats: YODateBasedStatistic[] = [];
            for (let yoStat of this.yoStats) {
                let newStat = Object.assign({}, yoStat);
                newStat.dataPoints = newStat._dataPointGenerator(yoSeasonData, filterState)
                for (let prop of nonCloneableProperties) {
                    delete newStat[prop];
                }
                newYOStats.push(newStat as YODateBasedStatistic);
            }
            return newYOStats;
        }
        return this.yoStats;
    }

    static mergeStats(statsFromWorker: YODateBasedStatistic[]): YODateBasedStatistic[] {
        let newYOStats: YODateBasedStatistic[] = [];
        for (let i = 0; i < statsFromWorker.length; i++) {
            let newStat = Object.assign({}, statsFromWorker[i]);
            newStat = {
                ...this.yoStats[i],
                ...newStat
            }
            newYOStats.push(newStat)
        }
        return newYOStats;
    }


}