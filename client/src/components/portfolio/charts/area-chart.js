import React, { Component } from 'react';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, AreaSeries} from 'react-vis';

export default class AreaChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // y and y0 are both absolute. eg. for the second stacked area, y0=[y of first stack], and y=y0+[y of second stack]
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