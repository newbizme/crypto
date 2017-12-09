import React, { Component } from 'react';
import axios from 'axios';

import socketIOClient from 'socket.io-client';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { 
    fetchTxns,
    fetchPortfolioSeries
  } from '../actions/portfolio';

import Auth from '../modules/auth';

import CoinTicker from '../components/coin-info/coin-ticker';
// import HistLineChart from '../components/coin-info/hist-line-chart';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Dimmer, Loader, Image, Segment, Menu } from 'semantic-ui-react';

const s = {
    chartArea: {
        display: 'inline-block',
        color: '#959595',
        textAlign: 'left'
    },
    loadingArea: {
        height: '350px',
        width: '730px',
        display: 'inline-block',
        textAlign: 'center'
    },
    timeMenu: {
        position: 'relative',
        right: '-70px',
        top: '20px',
    },
    container: {
        textAlign: 'center'
    },
    logo: {
        marginRight: '15px',
        fontSize: '32px',
        color: '#fff'
    },
    logoSpace: {
        display: 'inline-block',
        width: '24px'
    },
    coinName: {
        display: 'inline-block',
        
    },
    price: {
        display: 'inline-block',
    }
}


class Coin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coinData: undefined,
            chartView: 'month'
        };
    }

    componentWillMount() {
        
    }

    componentDidMount() {
        this.props.fetchTxns();
        this.props.fetchPortfolioSeries();

        axios.get('/api/v1/coin-info/' + this.props.match.params.name)
            .then((response) => {
                this.setState({ coinData: response.data });
            })
    }

    onSelectChartView = (time) => {
        this.setState({ chartView: time });
    }

    render() {
        if (!this.state.coinData) {
            return (
            <div style={s.container}>
                <div style={s.loadingArea}>
                    <Segment style={s.loadingArea}>
                        <Dimmer active>
                            <Loader size='massive' active inline='centered'>Loading</Loader>
                        </Dimmer>
                    </Segment>
                </div>
            </div>
            );
        }

        let coin = this.props.match.params.name.toUpperCase();

        return (
            <div style={s.container}>
                <CoinTicker marketInfo={this.state.coinData.market.AggregatedData} />
                
                <div style={s.chartArea}>
                <Menu inverted secondary size='mini' style={s.timeMenu}>
                    <Menu.Item name='day' active={this.state.chartView === 'day'} onClick={this.onSelectChartView.bind(this, 'day')}/>
                    <Menu.Item name='month' active={this.state.chartView === 'month'} onClick={this.onSelectChartView.bind(this, 'month')} />
                    <Menu.Item name='year' active={this.state.chartView === 'year'} onClick={this.onSelectChartView.bind(this, 'year')} />
                </Menu>
                <LineChart width={730} height={350} data={this.state.coinData.historical[this.state.chartView]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis dataKey="close" />
                    <Tooltip />
                    <Line 
                        type="monotone" 
                        dot={false}
                        dataKey="close"
                        name="Price ($)"
                        animationEasing="linear"
                        stroke="#82ca9d" />
                </LineChart>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ 
    portfolio,
  }) {
  return { 
    portfolio,
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      fetchTxns,
      fetchPortfolioSeries
    }, dispatch);
  }  

export default connect(mapStateToProps, mapDispatchToProps)(Coin);