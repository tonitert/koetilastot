import React from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Dot,
    Label, Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {DataArray} from "./DataArray";
import {DefaultTooltipContent} from "recharts/lib/component/DefaultTooltipContent";
import {StackOffsetType} from "recharts/types/util/types";
import {DefaultLegendContent} from "recharts/lib/component/DefaultLegendContent";

export default class StandardAreaChart extends React.Component {

    props: {
        dataArray: DataArray
        unit?: string
        colors?: string[]
        stacked?: boolean
        defs?: JSX.IntrinsicElements["defs"]
        stackOffset?: StackOffsetType
        legend?: boolean
    }

    render() {

        let data = [...this.props.dataArray.data];

        let maxAt: number[] = Array(this.props.dataArray.data.length).fill(Number.MIN_VALUE)
        let minAt: number[] = Array(this.props.dataArray.data.length).fill(Number.MAX_VALUE)

        for (let i = 0; i < this.props.dataArray.yVariableNames.length; i++) {
            for (let j = 0; j < data.length; j++) {
                maxAt[j] = Math.max(data[j][`y${i}`], maxAt[j]);
                minAt[j] = Math.min(data[j][`y${i}`], minAt[j]);
            }
        }

        let first = Object.assign({}, data.slice(0,1)[0]);
        first.renderDot = false;
        first.x -= 0.5;
        data.unshift(first);

        let last = Object.assign({}, data.slice(-1)[0]);
        last.renderDot = false;
        last.x += 0.5;
        data.push(last)

        let max = Number.MIN_VALUE;
        let min = Number.MAX_VALUE;

        for(let i = 0; i < this.props.dataArray.data.length; i++) {
            max = Math.max(max, maxAt[i]);
            min = Math.min(min, minAt[i]);
        }

        if(this.props.stacked) {
            min = 0;
        }

        let diff = max-min;
        let yLineAmount = 3;

        return <div className={"graph-responsive-container"}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} stackOffset={this.props.stackOffset}>
                    {
                        this.props.defs === undefined ?
                            <defs>
                                <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs> :
                            this.props.defs}
                    <XAxis dataKey="x" type={"number"} tickFormatter={timeStr => timeStr.toString()} orientation={"top"}
                           domain={["dataMin", "dataMax"]}
                           ticks={data.slice(1, -1).map((dp) => dp.x)}/>
                    <YAxis domain={this.props.dataArray.yVariableNames.length !== 1 ? [`dataMin`, `dataMax`] :
                        [`dataMin-${diff * 0.11}`, `dataMax+${diff * 0.11}`]} hide={true}/>
                    {
                        (() => {
                            return [...Array(yLineAmount)].map((_, i) => min + diff / (yLineAmount - 1) * i).map((y, i) =>
                                isNaN(y) ? null :
                                    <ReferenceLine isFront={true} ifOverflow={"visible"}
                                                   label={
                                                       <Label
                                                           position={this.props.stackOffset === "expand" ? i === yLineAmount - 1 ?
                                                                   "insideTopLeft" : i === 0 ?
                                                                       "insideBottomLeft" : "insideLeft":
                                                               i === yLineAmount - 1 ?
                                                                   "insideBottomLeft" : i === 0 ?
                                                                       "insideTopLeft" : "insideLeft"}
                                                           style={{ fill: "rgb(0,0,0)"}}
                                                           value={Math.round(y)}/>} y={this.props.stackOffset === "expand" ? y / max : y} strokeDasharray="3 3"/>)
                        })()
                    }
                    <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                    <Tooltip content={(props) => {
                        if (!props || props.payload.length === 0 || props.payload[0].payload.renderDot === false)
                            return null;
                        let newProps = Object.assign({}, props);
                        newProps.separator = " "
                        return <DefaultTooltipContent {...newProps}/>
                    }}/>
                    {this.props.legend ? <Legend verticalAlign="top" height={36} content={(props) => {
                        props.payload.map((obj, i) => {
                            obj.color = this.props.colors[i];
                        })
                        return <DefaultLegendContent {...props}/>;
                    }}/>: null}
                    {
                        this.props.dataArray.yVariableNames.map((val, i) => {
                            let colArr = this.props.colors;
                            return <Area type="monotone" stackId={this.props.dataArray.yVariableNames.length === 1 ? undefined : this.props.stacked ? 1 : undefined}
                                         dataKey={`y${i}`}
                                         name={val}
                                         stroke="#8884d8"
                                         fillOpacity={1}
                                         fill={colArr === undefined || colArr[i] === undefined ? "url(#color)" : colArr[i]}
                                  dot={(props) => {
                                      if(props.payload && props.payload.renderDot === false) return null;
                                      return <Dot {...props}/>
                                  }}
                                  activeDot={(props) => {
                                      if(props.payload && props.payload.renderDot === false) return null;
                                      return <Dot {...props}/>
                                  }}/>
                        })
                    }

                </AreaChart>
            </ResponsiveContainer>
        </div>
    }
}