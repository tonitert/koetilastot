import React from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Dot,
    Label,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {DataArray} from "./DataArray";
import {DefaultTooltipContent} from "recharts/lib/component/DefaultTooltipContent";

export default class StandardAreaChart extends React.Component {

    props: {
        dataArray: DataArray
    }

    render() {

        let data = [...this.props.dataArray.data];

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

        for (let dp of data) {
            max = Math.max(dp.y, max)
            min = Math.min(dp.y, min)
        }

        let diff = max-min;
        let yLineAmount = 3;

        return <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="x" type={"number"} tickFormatter={timeStr => timeStr.toString()} orientation={"top"}
                       padding={{ right: 0}} domain={["dataMin", "dataMax"]}
                       ticks={data.slice(1, -1).map((dp) => dp.x)}/>
                <YAxis domain={["dataMin", "dataMax"]} hide={true} interval={"preserveStartEnd"} tickCount={0}/>
                {
                    [...Array(yLineAmount)].map((_, i) => min + diff / (yLineAmount - 1) * i).map((y, i) =>
                        isNaN(y) ? null : <ReferenceLine isFront={true} label={<Label position={i === yLineAmount - 1 ? "insideTopLeft" : i === 0 ? "insideBottomLeft" : "insideLeft"} style={{ fill: "rgb(0,0,0)"}} value={Math.round(y)}/>} y={y} strokeDasharray="3 3"/>)
                }
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip content={(props) => {
                    if (!props || props.payload.length === 0 || props.payload[0].payload.renderDot === false)
                        return null;
                    let newProps = Object.assign({}, props);
                    newProps.separator = " "
                    return <DefaultTooltipContent {...newProps}/>
                }}/>
                <Area type="monotone" dataKey="y" name={this.props.dataArray.yVariableName} stroke="#8884d8" fillOpacity={1} fill="url(#color)"
                      dot={(props) => {
                          if(props.payload && props.payload.renderDot === false) return null;
                          return <Dot {...props}/>
                      }}
                      activeDot={(props) => {
                          if(props.payload && props.payload.renderDot === false) return null;
                          return <Dot {...props}/>
                      }}/>
            </AreaChart>
        </ResponsiveContainer>
    }
}