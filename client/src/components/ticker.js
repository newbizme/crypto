import React, { Component } from 'react';

import ccxt from 'ccxt';

const symbols = ['BTC/USDT', 'ETH/USDT', 'LTC/USDT', 'XMR/USDT', 'DASH/USDT', 'NEO/USDT', 'ZEC/USDT', 'LSK/BTC', 'GNT/ETH'];

const styles = {
    ticker: {
        display: 'inline-block',
        width: '200px'
    },
    symbol: {
        fontWeight: '700',
        fontSize: '11px',
        marginRight: '5px'
    },
    value: {
        fontSize: '11px',
        marginRight: '5px'
    },
    change: {
        fontSize: '11px',
        marginRight: '5px'
    }
}

export default class Ticker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tickerData: undefined
        };
    }

    componentWillMount() {
        this.fetchTickers();
    }

    fetchTickers = () => {
        fetch('/api/v1/tickers/all')
            .then(res => res.json())
            .then((data) => {
                console.log('ticker', data);
                this.setState({ tickerData: data });
            });
    }

    renderTickers = () => {
        return symbols.map((sym) => {
            let curr = this.state.tickerData[sym];
            let change = ((curr.last - curr.info.PrevDay) / curr.info.PrevDay) * 100;
            return (
                <div style={styles.ticker} key={curr.symbol}>
                    <span style={styles.symbol}>{ curr.symbol }</span>
                    <span style={styles.value}>{ curr.last > 1 ? curr.last.toFixed(2) : curr.last }</span>
                    <span style={styles.change}>{ change > 0 && '+' }{ change.toFixed(2) }%</span>
                </div>
            );
        })
    }

    render() {
        if (!this.state.tickerData) {
            return <div>Loading...</div>;
        }
        
        return (
            <div>
                {this.renderTickers()}
            </div>  
        )
    }
};