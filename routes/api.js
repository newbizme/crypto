const express = require('express');
var path = require('path');
const axios = require('axios');
const ccxt = require('ccxt');
const { timeParse } = require('d3-time-format');
var fs = require('fs');

const router = new express.Router();

// Wrap routes with asyncMiddleware for easy control of async calls, and standardized error handling
// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016 
const asyncMiddleware = fn => 
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next)
    };


router.get('/', asyncMiddleware(async (req, res, next) => {
    res.status(200).json({ status: "Connected" });
}));

router.get('/exchanges', (req, res) => {
    res.status(200).json(ccxt.exchanges);
})

router.get('/symbols/:exchange', asyncMiddleware ( async (req, res, next) => {
    let exchange = new ccxt[req.params.exchange]();
    let markets = await exchange.loadMarkets();
    res.status(200).json(markets);
}));

router.get('/exchange/info/:name', asyncMiddleware(async (req, res, next) => {
    let exchange = new ccxt[req.params.name]();

    res.status(200).json(exchange);
}))

router.get('/exchanges/:name', asyncMiddleware(async (req, res, next) => {
    // Validate given exchange name
    let exchanges = ccxt.exchanges;

    /*
    if (exchanges.indexOf(req.params.name) === -1) {
        console.log('Exchange not found: ' + req.params.name);
        res.status(200).json({ error: 'Exchange not found'});
    } */


    // Instantiate exchange with given id
    let exchange = new ccxt[req.params.name]();

    // Load market data
    let markets = await exchange.loadMarkets();

    // Load orderbook to determine the intersection of bids & asks (aka market price)
    let orderbook = await exchange.fetchOrderBook('ETH/USD');
    let bid = orderbook.bids.length ? orderbook.bids[0][0] : undefined;
    let ask = orderbook.asks.length ? orderbook.asks[0][0] : undefined;
    let spread = (bid && ask) ? ask - bid : undefined;

    // Fetch the ticker
    let ticker = await exchange.fetchTicker('ETH/USD');

    res.status(200).json({ 
        exchange: exchange.id, 
        symbols: exchange.symbols,
        markets: markets,
        orderbook: orderbook,
        bid: bid,
        ask: ask,
        spread: spread,
        ticker: ticker
    });

}));

router.get('/historical', asyncMiddleware(async (req, res, next) => {
    // ?coins=eth,btc,xrp
    // &timeframe=1w || 1mo || 6mo || 1y || all
    const coins = req.query.coins.split(',');
    let timeframe = '1mo';
    if (req.query.timeframe) timeframe = req.query.timeframe;
    
    let data = {};
    coins.map((coin) => {  
        data[coin.toUpperCase()] = [];
    })
    
    var ex = require('../utils/exchange-api');

    for (var coin in data) {
        data[coin] = await ex.fetchHistorical(coin, timeframe);
    }

    res.status(200).json(data);
}))

router.get('/exchanges/candlesticks/:exchange/:curr', asyncMiddleware(async (req, res, next) => {
    // '/api/v1/exchanges/candlesticks?timeframe=1h&since=<?>&limit=<?>'
    let exchange = new ccxt[req.params.exchange];
    let curr = req.params.curr.toUpperCase().replace("-","/");
    let markets = await exchange.loadMarkets();

    let timeframe = undefined; // not all will have everything -- client-side will need to identify exchange.timeframes available


    let since = undefined;
    let limit = undefined;
    req.query.timeframe ? timeframe = req.query.timeframe : timeframe = undefined;
    req.query.since ? since = req.query.since : since = undefined;
    req.query.limit ? limit = req.query.limit : limit = undefined;


    let candlesticks = await exchange.fetchOHLCV(curr, timeframe, since, limit);
    let candleData = [];

    const parseDate = timeParse("%Q");

    candlesticks.reverse().map((c) => {
        candleData.push({
            date: new Date(c[0]),
            open: c[1],
            high: c[2],
            low: c[3],
            close: c[4],
            volume: c[5]
        })
    })
    
    res.status(200).json(candleData);
}));


// **PRODUCTION USE**
router.get('/tickers/all', asyncMiddleware(async (req, res, next) => {
    const fetchTickersAll = require('../utils/ticker');
    let tickersAll = await fetchTickersAll();
    res.status(200).json(tickersAll);
}));

router.get('/tickers/top', asyncMiddleware(async (req, res, next) => {
    let exchange = new ccxt['bittrex']();
    exchange.apiKey = process.env.BITTREX_APIKEY;
    exchange.secret = process.env.BITTREX_APISECRET;
    let tickers = await (exchange.fetchTickers ()) 
    const symbols = ['BTC/USDT', 'ETH/USDT', 'LTC/USDT', 'XMR/USDT', 'DASH/USDT', 'NEO/USDT', 'ZEC/USDT', 'LSK/BTC', 'GNT/ETH'];
    
    let data = [];
    symbols.map((symbol) => {
        data.push(tickers[symbol]);
    })

    res.status(200).json(data);
}));


// COIN MARKET CAP TABLE
router.get('/market/snapshot', asyncMiddleware(async (req, res, next) => {
    const fetchCMCTable = require('../utils/market-cmc');
    let marketData = await fetchCMCTable();
    res.status(200).json(marketData.data);
}))


/* PORTFOLIO HOLDINGS STREAMS */
router.get('/portfolio/streams', asyncMiddleware(async (req, res, next) => {
    // '/api/v1/exchanges/candlesticks?coins=BTC-USD,ETH-USD,ETH-BTC
    let exchange = new ccxt['bittrex'];
    let curr = req.params.curr.toUpperCase().replace("-","/");
    let markets = await exchange.loadMarkets();

    let timeframe = undefined; // not all will have everything -- client-side will need to identify exchange.timeframes available


    let since = undefined;
    let limit = undefined;
    req.query.timeframe ? timeframe = req.query.timeframe : timeframe = undefined;
    req.query.since ? since = req.query.since : since = undefined;
    req.query.limit ? limit = req.query.limit : limit = undefined;


    let candlesticks = await exchange.fetchOHLCV(curr, timeframe, since, limit);
    let candleData = [];

    const parseDate = timeParse("%Q");

    candlesticks.reverse().map((c) => {
        candleData.push({
            date: new Date(c[0]),
            open: c[1],
            high: c[2],
            low: c[3],
            close: c[4],
            volume: c[5]
        })
    })
    
    res.status(200).json(candleData);
}));

module.exports = router;
