import React, { Component } from 'react';
import { List, Grid, Icon } from 'semantic-ui-react';

const s = {
    tickerContainer: {
        width: '100%',
        color: '#fff',
        margin: '-25px 0 20px 0',
        textAlign: 'center'
    },
    tickerItem: {
        display: 'inline-block',
        backgroundColor: '#333',
        textAlign: 'center',
        width: '200px',
        padding: '7px 0',
        borderRadius: '2px',
        margin: '1px'
    },
    name: {
        fontWeight: '700',
        fontSize: '1.2em',
        marginRight: '10px'
    },
    price: {
        fontSize: '1em',
        marginRight: '10px'
    },
    change: {
        fontSize: '1em'
    },
    chevron: {
        fontSize: '8px',
        position: 'relative',
        top: '-2px',
        right: '-4px'
    },
    logoSpace: {
        display: 'inline-block',
        fontSize: '20px'
    }
};

export default class Ticker extends Component {
    constructor(props) {
        super(props);
    }

    renderTickerItems = (items) => {
        return items.map((item) => {

            let color = '';
            item.change > 0 ? color = '#21ba45' : color = 'red';
            console.log(item);
            return (
                <div style={s.tickerItem}>
                    <div style={s.logoSpace}>
                        <i style={s.logo} className={ 'cc ' + item.name } title={ item.name }></i>
                    </div>
                    <span style={s.name}>{item.name}</span>
                    <span style={s.price}>${item.price}</span>
                    <span style={s.change}>
                        <p style={{color: color, display: 'inline-block'}}>
                        <Icon style={s.chevron} name={ item.change > 0 ? 'chevron up' : 'chevron down'}/>
                        { Math.abs(item.change) }%
                        </p>
                    </span>
                </div>
            )
        })
    }

    render() {
        if (this.props.ticker.length === 0) {
            return <div style={s.tickerContainer}>Loading ticker...</div>;
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
                { this.renderTickerItems(items) }
            </div>
        );
    }
}
