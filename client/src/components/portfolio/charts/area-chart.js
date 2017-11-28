import React, { Component } from 'react';
import axios from 'axios';
import Auth from '../../../modules/auth';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const s = {
    chartArea: {
        display: 'inline-block',
        color: '#959595'
    }
}


export default class StackedAreaChart extends Component {
    constructor(props) {
        super(props);

        this.state = { data: undefined }
    }

    componentWillMount() {
        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
        axios.get('/user/v1/portfolio/historical', config)
            .then((response) => {
                this.setState({ data: response.data });
            })
    }

    // TODO: Map over one of the object keys to render <Area /> components using colors from a bigger list

    render() {
        if (!this.state.data) {
            return <div>Loading</div>
        }

        return (
            <div style={s.chartArea}>
            <AreaChart 
                width={600} 
                height={400} 
                data={this.state.data}
                margin={{top: 10, right: 30, left: 0, bottom: 0}}
                >
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Area type='monotone' dataKey='ETH' stackId="1" stroke='#8884d8' fill='#8884d8' />
                <Area type='monotone' dataKey='GNT' stackId="1" stroke='#82ca9d' fill='#82ca9d' />
                <Area type='monotone' dataKey='BTC' stackId="1" stroke='#ffc658' fill='#ffc658' />
                <Area type='monotone' dataKey='XRP' stackId="1" stroke='#ffc658' fill='#ffc658' />
            </AreaChart>
            </div>
        )
    }
}