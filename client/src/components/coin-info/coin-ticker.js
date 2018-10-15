import React from 'react';

import { Icon } from 'semantic-ui-react';

const s = {
    logo: {
        marginRight: '15px',
        fontSize: '48px',
        color: '#fff'
    },
    logoSpace: {
        display: 'inline-block',
        minWidth: '48px'
    },
    priceInfo: {
        display: 'inline-block'
    },
    coinName: {
        display: 'inline-block',
        marginRight: '10px'
    },
    price: {
        display: 'inline-block',
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
    green: {
        color: '#1AFF00',
    },
    red: {
        color: 'red'
    },
}

const CoinTicker = (props) => {
    console.log(props.marketInfo);
    let coin = props.marketInfo;

    let change = coin.PRICE - coin.OPEN24HOUR;
    let pctChange = (change / coin.OPEN24HOUR) * 100;

    return (
        <div>
            <div style={s.logoSpace}>
                <i style={s.logo} className={ 'cc ' + coin.FROMSYMBOL } title={ coin.FROMSYMBOL }></i>
            </div>
            <div style={s.priceInfo}>
                <h4 style={s.coinName}>{ coin.FROMSYMBOL }</h4>
                <h4 style={s.price}>${ coin.PRICE }</h4>
                <br />
                <p style={ change > 0 ? s.green : s.red}>
                    { change > 0 ? '+' + Math.round(change * 1e2) / 1e2 : Math.round(change * 1e2) / 1e2 }

                    (<Icon style={s.chevron} name={ change > 0 ? 'chevron up' : 'chevron down'}/> 
                    { Math.abs(Math.round(pctChange * 1e2) / 1e2) }%)
                </p>
            </div>
        </div>
    )
}

export default CoinTicker;

/*
<p style={ c.percent_change_1h > 0 ? s.green : s.red }>
    <Icon style={s.chevron} name={ c.percent_change_1h > 0 ? 'chevron up' : 'chevron down'}/> 
    { Math.abs(c.percent_change_1h) }%
</p>
                    */