import React from 'react';
import InvestmentRollup from './investment-rollup';
import SimplePieChart from './pie-chart';
// import PieChartEz from './pie-chart-ez';

function convertToUSD(ticker, portfolio) {
    const btcPrice = ticker['BTC/USDT'].bid;
    const ethPrice = ticker['ETH/USDT'].bid;

    let vals = [];
    let net = 0;
    let investment = 0;
    portfolio.hasOwnProperty('USD') ? investment = portfolio['USD'] : '';

    for (const key in portfolio) {
        if (key !== 'USD' && key !== 'timestamp') {
            if (ticker.hasOwnProperty(key + '/USDT')) {
                let value = ticker[key + '/USDT'].bid * portfolio[key];
                net += value;
                vals.push({
                    currency: key,
                    amount: portfolio[key],
                    value: Math.round(value * 1e2)/1e2
                })
            } else if (ticker.hasOwnProperty(key + '/BTC')) {
                let value = portfolio[key] * ticker[key + '/BTC'].bid * btcPrice;
                net += value;
                vals.push({
                    currency: key,
                    amount: portfolio[key],
                    value: Math.round(value * 1e2)/1e2
                })
            } else if (ticker.hasOwnProperty(key + '/ETH')) {
                let value = portfolio[key] * ticker[key + '/ETH'].bid * ethPrice;
                net += value;
                vals.push({
                    currency: key,
                    amount: portfolio[key],
                    value: Math.round(value * 1e2)/1e2
                })
            }
        }
    }

    return {
        value: Math.round(net *1e2)/1e2,
        assets: vals,
        investment: Math.round(investment * 1e2)/1e2
    };
}

const NetWorth = (props) => {
    if (props.portfolio.length === 0 || props.ticker.length ===0 ) {
        return <div></div>;
    }

    const i = props.portfolio.length -1;
    const holdings = props.portfolio[i];

    const net = convertToUSD(props.ticker, holdings);

    return (
        <div>
            <InvestmentRollup value={net.value} investment={net.investment} />
        </div>
    )
}

// <SimplePieChart assets={net.assets} />

export default NetWorth;