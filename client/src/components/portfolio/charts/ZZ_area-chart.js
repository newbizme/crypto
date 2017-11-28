import React, { Component } from 'react';
import axios from 'axios';

import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, AreaSeries} from 'react-vis';

function parsePortfolioTimeline(portfolio, interval, start, stop) {
    let int;
    if (interval = '1d') { int = 24*60*60; } // TODO: expand to allow hourly, weekly, etc.
    
    let data = [];
    let amount = 0;
    let ts = start; // 1506470400
    
    let p = 0;
  
    // if portfolio starts before data starttime, find 'starting' point
    if (portfolio[0].timestamp <= ts) {
      do {
        p++;
      }
      while (portfolio[p].timestamp <= ts)
      // subtract one to remove the unnecessary p++ from last do loop
      p--;
    }
  
    // For each time range increment, find the closing portfolio balances
    do {
      if (portfolio[p+1] && portfolio[p+1].timestamp > ts + int) {
        // if next snapshot is outside ts -> ts+int time range, push
        data.push({ x: ts, y: Object.assign({}, portfolio[p]) })
      } else {
        // else, find closing portfolio balance of timerange
        let i = 0;
        portfolio.map((p, index) => {
           if (p.timestamp < ts+int) {
             i = index;
           }
        })
        p = i;
        data.push({ x: ts, y: Object.assign({}, portfolio[p]) });
      }
      
      // increment to next interval
      ts += int;
    } while (ts <= stop)
    
    return data;
  }

export default class AreaChart extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            histData: undefined,
            portfolio: undefined,
            timeframe: '1mo',
            timeTo: undefined,
            timeFrom: undefined,
            xAxis: undefined
        };
    }

    componentWillMount() {
        let coins = [];

        // Push holdings to array to pass into API
        for (var key in this.props.holdings) {
            if (key.toUpperCase() !== 'USD' && key.toUpperCase() !== 'USDT' && key.toLowerCase() !== 'datetime' && key.toLowerCase() !== 'timestamp') {
                coins.push(key);
            } 
        }
        
        axios.get('/api/v1/historical?coins=' + coins.join(',') + '&timeframe=' + this.state.timeframe)
            .then((response) => {
                this.setState({ 
                    histData: response.data,
                    timeTo: response.data[coins[0]].timeTo,
                    timeFrom: response.data[coins[0]].timeFrom
                 });
            });
    }

    renderLineSeries = (pData) => {
        let data = [];
        for (var key in this.state.histData) {
            // map through portfolio holdings
            let temp = {coin: key, data: []};
            this.state.histData[key].data.map((d, index) => {
                
                let p = pData[index].y;
                let amount = 0;
                p.hasOwnProperty(key) && p[key] > 0 ? amount = p[key] : amount = 0;
                
                temp.data.push({
                    x: d.x,
                    y: amount * d.y
                })
            })
            data.push(temp);
        }

        console.log(data);
        return data.map((d) => {
            return <LineSeries data={d.data} />
        })

        // return <AreaSeries data={this.state.histData[key]} />
    }

    render() {
        if (!this.state.histData) {
            return <div></div>;
        }
        let portfolioData = parsePortfolioTimeline(this.props.portfolio, '1d', this.state.timeFrom, this.state.timeTo); // portfolio, interval, start, stop

        return (
            <div style={{display: 'inline-block'}}>
                <XYPlot
                    width={300}
                    height={300}>
                    <HorizontalGridLines />
                    { this.renderLineSeries(portfolioData) }
                    <XAxis />
                    <YAxis />
                </XYPlot>
            </div>
        );
    }
}



        // console.log(portfolioData);
        // TODO: 
        // - Accept portfolio holdings over time. 
        // - portfolio[last] should contain an object with every coin that was owned at some point. Filter out USD
        // - Use that to retrieve history data (day increments)
        // - Use current ticker value as the last datapoint for today's date
        //
        // - data = price(USD) * amount over time. Check against portfolio object timestamps along the way
        // 
        // - Once X and Y values are denoted for all, need to re-map through and 'stack' (or, temporarily, just use lineSeries)
        // - Put largest current holding as stack1, second largest as stack2, etc. --> store order in an array
        // - y and y0 are both absolute. eg. for the second stacked area, y0=[y of first stack], and y=y0+[y of second stack]
        // 
        // - Filter options for timeline: 1) This week (?) 2) This month 2) This year 3) All 
        // - Filter options will just slice overall array as needed (will need to see how this look with that many datapoints,
        //     might need to re-map for monthly values or something.. we'll see)
