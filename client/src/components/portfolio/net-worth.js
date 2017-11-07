import React from 'react';

function convertToUSD(ticker, portfolio) {
    const btcPrice = ticker['BTC/USDT'].bid;
    const ethPrice = ticker['ETH/USDT'].bid;

    let vals = [];
    for (const key in portfolio) {
        if (key !== 'USD' && key !== 'timestamp') {
            if (ticker.hasOwnProperty(key + '/USDT')) {
                vals.push({
                    currency: key,
                    amount: portfolio[key],
                    value: ticker[key + '/USDT'].bid * portfolio[key]
                })
            } else if (ticker.hasOwnProperty(key + '/BTC')) {
                vals.push({
                    currency: key,
                    amount: portfolio[key],
                    value: portfolio[key] * ticker[key + '/BTC'].bid * btcPrice
                })
            } else if (ticker.hasOwnProperty(key + '/ETH')) {
                vals.push({
                    currency: key,
                    amount: portfolio[key],
                    value: portfolio[key] * ticker[key + '/ETH'].bid * ethPrice
                })
            }
        }
    }

    return vals;
}

const NetWorth = (props) => {
    if (props.portfolio.length === 0) {
        return <div><p>No portfolio</p></div>;
    }

    console.log(props);    
    const i = props.portfolio.length -1;
    const holdings = props.portfolio[i];
    console.log(holdings);

    const value = convertToUSD(props.ticker, holdings);
    
    return (
        <div>
            <p>BTC: { holdings.hasOwnProperty('BTC') ? holdings['BTC'] : 0 }</p>
            <p>ETH: { holdings.hasOwnProperty('ETH') ? holdings['ETH'] : 0 }</p>
            <p>Investment: { holdings.hasOwnProperty('USD') ? holdings['USD'] : 0 }</p>
        </div>
    )
}

export default NetWorth;