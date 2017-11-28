import React, { Component } from 'react';
import {PieChart, Pie, Legend, Tooltip} from 'recharts';

let con = require('../../../modules/constants');
const s = {
    chartArea: {
        display: 'inline-block'
    }
}

const data02 = [{name: 'Group A', value: 2400}, {name: 'Group B', value: 4567},
{name: 'Group C', value: 1398}, {name: 'Group D', value: 9800},
{name: 'Group E', value: 3908}, {name: 'Group F', value: 4800}];

export default class PieChartRe extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={s.chartArea}>
                <PieChart width={800} height={400}>
                    <Pie data={this.props.net.assets} cx="50%" cy="50%" innerRadius={40} outerRadius="80%" fill="#82ca9d" nameKey='currency' dataKey='value'/>
                    <Tooltip/>
                </PieChart>
            </div>
        )
    }
}