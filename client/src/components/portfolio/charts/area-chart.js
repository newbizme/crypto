import React, { Component } from 'react';
import axios from 'axios';
import Auth from '../../../modules/auth';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Dimmer, Loader, Image, Segment, Menu } from 'semantic-ui-react';

const s = {
    chartArea: {
        display: 'inline-block',
        color: '#959595',
        textAlign: 'left'
    },
    loadingArea: {
        height: '400px',
        width: '600px',
        display: 'inline-block'
    },
    timeMenu: {
        position: 'relative',
        right: '-70px',
        top: '20px',
    }
}

let con = require('../../../modules/constants');


export default class StackedAreaChart extends Component {
    constructor(props) {
        super(props);

        this.state = { data: undefined }
    }

    componentWillMount() {
        /*
        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
        axios.get('/user/v1/portfolio/historical', config)
            .then((response) => {
                this.setState({ data: response.data });
            })
        */
    }

    renderAreaComponents = () => {
        let coins = [];
        //for (var key in this.state.data[0]) {
        for (var key in this.props.dataSeries[0]) {
            if (key !== 'name' && key !== 'timestamp') {
                coins.push(key);
            }
        }
        return coins.map((coin, index) => {
            return <Area type='monotone' dataKey={coin} stackId="1" stroke={con.chartColors[Math.floor(index % 10)]} fill={con.chartColors[Math.floor(index % 10)]} />;
        })
    }

    render() {
        if (this.props.dataSeries.length === 0) {
            return (
            <div style={s.loadingArea}>
                <Segment style={s.loadingArea}>
                    <Dimmer active>
                        <Loader size='massive' active inline='centered'>Loading</Loader>
                    </Dimmer>
                </Segment>
            </div>
            );
        }

        return (
            <div style={s.chartArea}>
            <Menu inverted secondary size='mini' style={s.timeMenu}>
                <Menu.Item name='3mo' active={true} />
            </Menu>
            <AreaChart 
                width={600} 
                height={400} 
                // data={this.state.data}
                data={this.props.dataSeries}
                margin={{top: 10, right: 30, left: 0, bottom: 0}}
                >
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                { this.renderAreaComponents() }
            </AreaChart>
            </div>
        )
    }
}

/**
 * <Area type='monotone' dataKey='ETH' stackId="1" stroke='#8884d8' fill='#8884d8' />
                <Area type='monotone' dataKey='GNT' stackId="1" stroke='#82ca9d' fill='#82ca9d' />
                <Area type='monotone' dataKey='BTC' stackId="1" stroke='#ffc658' fill='#ffc658' />
                <Area type='monotone' dataKey='XRP' stackId="1" stroke='#ffc658' fill='#ffc658' />
 */