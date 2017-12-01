const express = require('express');
const ccxt = require('ccxt');

const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next)
};


// Import data models
var Txn = require('../models/txn');
var ExchangeKey = require('../models/exchange-key');

// PROTECTED ROUTES - REQUIRE JWT AUTHENTICATION

const router = new express.Router();

// =========================================================================
// ++++++++            /portfolio/ PORTFOLIO FUNCTIONS
// =========================================================================

// ~~~ GET PORTFOLIO SERIES DATA

router.get('/portfolio/historical', asyncMiddleware(async (req, res, next) => {
    // TODO: Configure so that multiple time ranges can be selected
    // 1mo -> hour inc, 6x aggregate
    // 3mo -> day inc, 1x aggregate
    // 6mo -> day inc, 2x aggregate
    // 1yr -> day inc, 5x aggregate
    // all -> ?? need to identify portfolio start time, and conditionally determine parameters from there

    let range = '3mo';
    if (req.query.range) { range = req.query.range; }


    var pc = require('../utils/portfolio-calcs');
    var ex = require('../utils/exchange-api');

    let txns = await pc.getTxnHistory(req);

    // From latest portfolio object, get list of coins
    let c = txns.portfolio.length;
    let coins = txns.portfolio[c-1];

    let histData = {};
    let start = undefined;
    let stop = undefined;
    
    for (var coin in coins) {
        if (coin != 'USD' && coin != 'USDT' && coin != 'datetime' && coin != 'timestamp') {
            histData[coin] = await ex.fetchHistorical(coin, 'day');
            start = histData[coin].timeFrom;
            stop = histData[coin].timeTo;
        }
    }
    
    let portfolio = await pc.parsePortfolioTimeline(txns.portfolio, 'day', start, stop);

    let valueOverTime = await pc.calculatePortfolioOverTime(portfolio, histData);

    res.status(200).json(valueOverTime);
}));

// =========================================================================
// ++++++++            /TXNS/ TRANSACTIONS FUNCTIONS
// =========================================================================

// ++++++++++++++++++++++++++++++++
// +++++++    MANUAL INPUT
// ++++++++++++++++++++++++++++++++

// ~~~ GET ALL TXNS - MANUAL AND API
// !!! PRODUCTION
router.get('/txns', asyncMiddleware(async (req, res, next) => {

    // ~ GET MANUAL TXNS
    async function getManualTxnsPromise(userID) {
        var txns = Txn.find({ userID: userID }).exec();
        return txns;
    }

    // ~~~ GET EXCHANGE TXNS
    var ex = require('../utils/exchange-api');

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

    res.status(200).json({ txns: txns, portfolio: portfolio });

}));

// ~~~ ADD MANUAL TXN
// !!! PRODUCTION
router.post('/txns', (req, res) => {
    let txn = req.body;
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
    var submission = new Txn({
        userID: req.userID,
        timestamp: txn.timestamp,
        datetime: txn.datetime,
        side: txn.side,
        symbol: txn.symbol,
        price: txn.price,
        amount: txn.amount,
        exchange: txn.exchange
    });

    submission.save(function (err, data) {
        if (err) return res.status(500).send({error: err});
        res.status(200).json(data);
    });
});

// ~~~ DELETE MANUAL TXN
// !!! PRODUCTION
router.delete('/txns/:id', (req, res) => {
    var id = req.params.id;

    Txn.findByIdAndRemove(id, function(err) {
        if (err) { throw err; }
        return res.status(200).send("Successfully deleted");
    });
});

// ++++++++++++++++++++++++++++++++
// +++++++   /AUTH/EXCHANGE/ -- AUTOMATIC INPUT
// ++++++++++++++++++++++++++++++++

// ~~~ GET EXCHANGE KEYS
// !!! PRODUCTION
router.get('/auth/exchange', (req, res) => {
    ExchangeKey.find({ userID: req.userID }, function (err, keys) {
        if (err) return res.status(500).send({error: err});

        // Sort txns by timestamp
        keys.sort(function(key1, key2) {
            // Descending
            return key2.created - key1.created
        })

        res.status(200).json(keys);
    });
});

// ~~~ ADD EXCHANGE KEYS
// !!! PRODUCTION
router.post('/auth/exchange', (req, res) => {
    let key = req.body;
    let password = undefined;
    key.password ? password = key.password : password = undefined;
    key.created = new Date();

    // Delete duplicates
    ExchangeKey.find({ userID: req.userID, exchange: key.exchange }).remove().exec();

    // Compile new key
    var submission = new ExchangeKey({
        userID: req.userID,
        password: key.password,
        exchange: key.exchange,
        apikey: key.apikey,
        apisecret: key.apisecret,
        created: key.created
    });

    // Save new key
    submission.save(function (err, data) {
        if (err) return res.status(500).send({error: err});
        res.status(200).json(data);
    });
})

// ~~~ DELETE EXCHANGE KEYS
// !!! PRODUCTION
router.delete('/auth/exchange/:id', (req, res) => {
    var id = req.params.id;

    ExchangeKey.findByIdAndRemove(id, function(err) {
        if (err) { throw err; }
        return res.status(200).send("Successfully deleted");
    });
});

// ~~~ TEST EXCHANGE KEYS
// !!! PRODUCTION
router.post('/auth/test', asyncMiddleware(async (req, res, next) => {
    let key = req.body;
    !key.password ? key.password = undefined : '';
    var ex = require('../utils/exchange-api');
    
    let test = await ex.testConnection(key.exchange, key.apikey, key.apisecret, key.password);
    if (test) {
        res.status(200).json({connection: true});
    } else {
        res.status(401).json({connection: false});
    }
}));

// ~~~ FETCH TXNS FROM EXCHANGE
// testing --> This should really start living in the get.('txn') endpoint to collect all txns (manual and auto) at once
router.get('/txns/api', asyncMiddleware(async (req, res, next) => {

    // ~~~ GET EXCHANGE TXNS
    var ex = require('../utils/exchange-api');

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

    getKeysPromise(req.userID).then(async (response) => {
        let txns = await mapKeys(response)
        res.status(200).json(txns);
    })    
    
}));

// TEST - Endpoint to test connections to new exchanges
router.get('/test/api', asyncMiddleware( async (req, res, next) => {
    var ex = require('../utils/exchange-api');

    const key = {
        exchange: 'gemini',
        apikey: process.env.GEMINI_APIKEY,
        apisecret: process.env.GEMINI_SECRET,
        password: process.env.GEMINI_PASSPHRASE
    }

    let txnList = await ex.fetchTrades(key.exchange, key.apikey, key.apisecret, key.password);
    console.log('return:', txnList);
    res.status(200).json(txnList);
}))

// =========================================================================
// ++++++++             PORTFOLIO FUNCTIONS
// =========================================================================

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

module.exports = router;