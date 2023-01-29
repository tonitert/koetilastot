export default class GraphPoint {
    y: number
    timestamp: number
    dateText?: string

    constructor(y: number, timestamp: number, dateText: string) {
        this.y = y;
        this.timestamp = timestamp;
        this.dateText = dateText;
    }
}