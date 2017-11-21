import React, { Component } from 'react';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, AreaSeries} from 'react-vis';

export default class AreaChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        
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

        return (
            <div style={{display: 'inline-block'}}>
                <XYPlot
                    width={300}
                    height={300}>
                    <HorizontalGridLines />
                    <AreaSeries
                        data={[
                        {x: 1, y: 10, y0: 0},
                        {x: 2, y: 5, y0: 0},
                        {x: 3, y: 15, y0: 0}
                        ]}/>
                    <AreaSeries
                        data={[
                        {x: 1, y: 13, y0: 10},
                        {x: 2, y: 12, y0: 5},
                        {x: 3, y: 21, y0: 15}
                        ]}/>
                    <XAxis />
                    <YAxis />
                </XYPlot>
            </div>
        );
    }
}