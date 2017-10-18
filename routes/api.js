const express = require('express');
var path = require('path');
const axios = require('axios');
const ccxt = require('ccxt');

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
    console.log("Exchange initiated: " + req.params.name);

    // Load market data
    console.log("Loading market data...");
    let markets = await exchange.loadMarkets();
    console.log("Market data loaded.");

    // Load orderbook to determine the intersection of bids & asks (aka market price)
    console.log("Loading orderbook...");
    let orderbook = await exchange.fetchOrderBook('ETH/USD');
    let bid = orderbook.bids.length ? orderbook.bids[0][0] : undefined;
    let ask = orderbook.asks.length ? orderbook.asks[0][0] : undefined;
    let spread = (bid && ask) ? ask - bid : undefined;
    console.log(exchange.id, 'Market Price', {bid, ask, spread});

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

router.get('/exchanges/:name/candlesticks', asyncMiddleware(async (req, res, next) => {
    let exchange = new ccxt[req.params.name];
    let markets = await exchange.loadMarkets();

    let candlesticks = await exchange.fetchOHLCV('ETH/USD', '30m')
    
    res.status(200).json(candlesticks);


}));

module.exports = router;
