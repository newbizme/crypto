const axios = require('axios');
const ccxt = require('ccxt');

// Models
var Txn = require('../models/txn');
var ExchangeKey = require('../models/exchange-key');

// GET transaction history (manual & auto)
async function getTxnHistory(req) {
    // ~ GET MANUAL TXNS
    async function getManualTxnsPromise(userID) {
        var txns = Txn.find({ userID: userID }).exec();
        return txns;
    }

    // ~~~ GET EXCHANGE TXNS
    var ex = require('./exchange-api');

    // Find exchange API keys
    async function getKeysPromise(userID) {
        var keys = ExchangeKey.find({ userID: userID }).exec();
        return keys;
    }
    async function mapKeys(keys) {
        let txns = [];
        await Promise.all(keys.map(async (key) => {
            !key.password ? key.password = undefined : '';
            let txnList = await ex.fetchTrades(key.exchange, key.apikey, key.apisecret, key.password);
            txns = txns.concat(txnList);
        }))
        return txns;
    }

    let keys = await getKeysPromise(req.userID);
    let apitxns = await mapKeys(keys);
    let manualtxns = await getManualTxnsPromise(req.userID);

    let txns = manualtxns.concat(apitxns);

    // Sort txns by timestamp
    txns.sort(function(txn1, txn2) {
        // Ascending
        return txn1.timestamp - txn2.timestamp
    })

    let portfolio = await returnPortfolioTimeline(txns);

    return({ txns: txns, portfolio: portfolio });
};


// ~~~ INPUT=TXNS, OUTPUT=PORTFOLIO
// !!! PRODUCTION
// TODO: Move to portfolio-calcs.js
function returnPortfolioTimeline(txns) {
    let p = [];
    txns.map((txn, index) => {
    /*
        'id':        '12345-67890:09876/54321', // string trade id
        'timestamp':  1502962946216,            // Unix timestamp in milliseconds
        'datetime':  '2017-08-17 12:42:48.000', // ISO8601 datetime with milliseconds
        'symbol':    'ETH/BTC',                 // symbol
        'order':     '12345-67890:09876/54321', // string order id or undefined/None/null
        'type':      'limit',                   // order type, 'market', 'limit' or undefined/None/null
        'side':      'buy',                     // direction of the trade, 'buy' or 'sell'
        'price':      0.06917684,               // float price in quote currency
        'amount':     1.5,                      // amount of base currency
    */
        let i = 1;
        txn.side === 'buy' ? i = 1 : i = -1;

        let coin = txn.symbol.split('/');
        const currency = coin[0];
        const base = coin[1];
        
        // Use Object.assign() to generate a copy of an object instead of a reference
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign 
        let data = Object.assign({});
        if (index === 0) {
            
            // handle first transaction
            data.datetime = txn.datetime;
            data[currency] = i * txn.amount;
            data[base] = -1 * i * txn.amount * txn.price;
        } else {
            data = Object.assign({}, p[index-1])
            data.datetime = txn.datetime;
            
            // validate if object key for the currency exists
            if (currency in data) {
                data[currency] += i * txn.amount;
            } else {
                data[currency] = i * txn.amount;
            }
            // validate if the object key for the base exists
            if (base in data) {
                data[base] -= (i * txn.amount * txn.price);
            } else {
                data[base] = -1 * i * txn.amount * txn.price;
            }
        }
        p.push(data);
    })

    return p;
}

// ---------------------------------------
// CONVERT PORTFOLIO -> EVEN TIME INCREMENTS
// ---------------------------------------
// portfolio: array of portfolio objects
// interval: time interval between output objects
// start: UTC time to start
// stop: UTC time to stop
async function parsePortfolioTimeline(portfolio, interval, start, stop) {
    let int = 24*60*60; // TODO: expand to allow hourly, weekly, etc.

    portfolio.map((p) => { 
        let timestamp = Date.parse(p.datetime)/1000;
        p["timestamp"] = timestamp;
      });
      
    
    let data = [];
    let amount = 0;
    let ts = start; // 1506470400
    
    let p = 0;
  
    // if portfolio starts before data starttime, find 'starting' point
    if (portfolio[0].timestamp <= ts) {
      do {
        p++;
      }
      while (portfolio[p].timestamp <= ts && p-1 >= portfolio.length)
      
      if (portfolio[p].timestamp > ts) {
        // subtract one to remove the unnecessary p++ from last do loop
        p--;
      }
    }
    
    // For each time range increment, find the closing portfolio balances
    do {

      if (portfolio[p+1] && portfolio[p+1].timestamp > ts + int) {
        // if next snapshot is outside ts -> ts+int time range, push
        data.push({ timestamp: ts, coins: Object.assign({}, portfolio[p]) })
      } else {
        // else, find closing portfolio balance of timerange
        let i = 0;
        portfolio.map((p, index) => {
           if (p.timestamp < ts+int) {
             i = index;
           }
        })
        p = i;
        data.push({ timestamp: ts, coins: Object.assign({}, portfolio[p]) });
      }
      
      // increment to next interval
      ts += int;
    } while (ts <= stop)
    
    return data;
  }


// ---------------------------------------
// CALCULATE PORTFOLIO OVER TIME
// ---------------------------------------
async function calculatePortfolioOverTime(portfolio, data) {
    let i = portfolio.length - 1 ;
    let coins = [];
    for (var coin in portfolio[i].coins) {
        if (coin !== 'datetime' && coin !== 'timestamp' && coin !== 'USD' && coin !== 'USDT') { 
            coins.push(coin); 
        }
    }
    let portfolioData = [];
    
    portfolio.map((p, index) => {
        // x = p.timestamp
        let datapoint = { timestamp: p.timestamp };

        // datapoint.name = date
        let date = new Date(p.timestamp * 1000);
        let dateStr = (date.getMonth() + 1) + '/' + date.getDate();
        datapoint.name = dateStr;

        coins.map((coin) => {
            if (p.coins.hasOwnProperty(coin)) {
                let amount = p.coins[coin];
                amount < 0 ? amount = 0 : '';

                let price = data[coin].data[index].y;

                datapoint[coin] = amount * price; // amount * price
            } else {
                datapoint[coin] = 0;
            }
        })

        portfolioData.push(datapoint);
    })
    

    return portfolioData;
    // return { portfolio, data };
    /**
     * return: array[obj{}]
     * {
     *   symbol: 'ETH',
     *   data: [{x: 211901239, y: 1211, amount: 4, price: 303, coin: 'ETH'}],
     *      
     * }
     */
}

module.exports = {
    returnPortfolioTimeline,
    parsePortfolioTimeline,
    getTxnHistory,
    calculatePortfolioOverTime
};