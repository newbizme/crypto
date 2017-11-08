import React, { Component } from 'react';
import { List, Grid, Icon } from 'semantic-ui-react';

const s = {
    tickerContainer: {
        color: '#fff',
        marginTop: '-25px',
        marginBottom: '15px',
        textAlign: 'center'
    },
    tickerItem: {
        display: 'inline-block',
        // backgroundColor: 'rgba(255, 255, 255, .15)',
        textAlign: 'center',
        padding: '5px 10px',
        borderRadius: '5px'
    },
    name: {
        fontWeight: '700',
        fontSize: '16px',
        marginRight: '5px'
    },
    price: {
        fontSize: '14px',
        marginRight: '5px'
    },
    change: {
        fontSize: '14px',
        marginRight: '5px'
    }
};

export default class Ticker extends Component {
    constructor(props) {
        super(props);
    }

    renderTickerItems = (items) => {
        return items.map((item) => {

            let color = '';
            item.change > 0 ? color = 'green' : color = 'red';

            return (
                <Grid.Column>
                <div style={s.tickerItem}>
                    <span style={s.name}>{item.name}</span>
                    <span style={s.price}>${item.price}</span>
                    <span style={s.change}>
                        <p style={{color: color, display: 'inline-block'}}>
                        { item.change > 0 ? <Icon name='chevron up'/> : <Icon name='chevron down'/> }
                        { Math.abs(item.change) }%
                        </p>
                    </span>
                </div>
                </Grid.Column>
            )
        })
    }

    render() {
        if (this.props.ticker.length === 0) {
            return <div>Loading ticker...</div>;
        }

        const { ticker } = this.props;
        const currencies = ['BTC/USDT', 'ETH/USDT', 'LTC/USDT', 'XMR/USDT'];
        let items = [];
        currencies.map((curr) => {
            items.push({
                name: curr.substring(0,3),
                price: Math.round(ticker[curr].last * 1e2)/1e2,
                change: Math.round(((ticker[curr].last - ticker[curr].info.PrevDay) / ticker[curr].info.PrevDay) * 100 * 1e2)/1e2
            })
        })

        return (
            <div style={s.tickerContainer}>
                <Grid doubling columns={4}>
                { this.renderTickerItems(items) }
                </Grid>
            </div>
        );
    }
}
