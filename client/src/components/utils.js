import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

export function getData() {
    const promiseMSFT = fetch("//rrag.github.io/react-stockcharts/data/MSFT.tsv")
        .then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
}

function parseGdaxData(data) {
    console.log('parseGdaxData', data);
    let d = [];
    data.map((c) => {
        d.push({
            date: c[0],
            open: c[1],
            high: c[2],
            low: c[3],
            close: c[4],
            volume: c[5]
        })
    })
    console.log('parseGdaxData>', d);
    return d;
}

export function getGdaxData() {
    const promiseGdax = fetch('/api/v1/exchanges/gdax/candlesticks')
        .then((response) => {
            console.log(response.data);
            parseGdaxData(response.data.candlesticks)
        })
    return promiseGdax;
}