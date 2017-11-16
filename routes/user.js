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
// ++++++++             TRANSACTIONS FUNCTIONS
// =========================================================================

// ++++++++++++++++++++++++++++++++
// +++++++    MANUAL INPUT
// ++++++++++++++++++++++++++++++++
// ~~~ GET MANUAL TXNS
router.get('/txns', (req, res) => {
    Txn.find({ userID: req.userID }, function (err, txns) {
        if (err) return res.status(500).send({error: err});

        // Sort txns by timestamp
        txns.sort(function(txn1, txn2) {
            // Ascending
            return txn1.timestamp - txn2.timestamp
        })

        let portfolio = returnPortfolioTimeline(txns);
        res.status(200).json({ txns: txns, portfolio: portfolio });
    });
});

// ~~~ ADD MANUAL TXN
router.post('/txns', (req, res) => {
    let txn = req.body;
    var submission = new Txn({
        userID: req.userID,
        timestamp: txn.timestamp,
        action: txn.action,
        currency: txn.currency,
        base: txn.base,
        quantity: txn.quantity,
        price: txn.price,
        created: txn.created
    });

    submission.save(function (err, data) {
        if (err) return res.status(500).send({error: err});
        console.log(data);
        res.status(200).json(data);
    });
});

// ~~~ DELETE MANUAL TXN
router.delete('/txns/:id', (req, res) => {
    var id = req.params.id;

    Txn.findByIdAndRemove(id, function(err) {
        if (err) { throw err; }
        return res.status(200).send("Successfully deleted");
    });
});

// ++++++++++++++++++++++++++++++++
// +++++++    AUTOMATIC INPUT
// ++++++++++++++++++++++++++++++++

// ~~~ GET EXCHANGE KEYS
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
router.post('/auth/exchange', (req, res) => {
    let key = req.body;
    console.log(key);
    let password = undefined;
    key.password ? password = key.password : password = undefined;
    key.created = new Date();

    var submission = new ExchangeKey({
        userID: req.userID,
        password: key.password,
        exchange: key.exchange,
        apikey: key.apikey,
        apisecret: key.apisecret,
        created: key.created
    });

    submission.save(function (err, data) {
        if (err) return res.status(500).send({error: err});
        console.log(data);
        res.status(200).json(data);
    });
})

// ~~~ DELETE EXCHANGE KEYS
router.delete('/auth/exchange/:id', (req, res) => {
    var id = req.params.id;

    ExchangeKey.findByIdAndRemove(id, function(err) {
        if (err) { throw err; }
        return res.status(200).send("Successfully deleted");
    });
});

// ~~~ TEST EXCHANGE KEYS
router.post('/auth/test', asyncMiddleware(async (req, res, next) => {
    let key = req.body;
    !key.password ? key.password = undefined : '';
    var ex = require('../utils/exchange-api');
    console.log("Test: ", key);
    
    let test = await ex.testConnection(key.exchange, key.apikey, key.apisecret, key.password);
    if (test) {
        res.status(200).json({connection: true});
    } else {
        res.status(401).json({connection: false});
    }
}));

// ~~~ FETCH TXNS FROM EXCHANGE
// testing --> This should really start living in the get.('txn') endpoint to collect all txns (manual and auto) at once
router.get('/txns/api/:name', asyncMiddleware(async (req, res, next) => {
    if (req.params.name !== 'gdax' 
        && req.params.name !== 'poloniex'
        && req.params.name !== 'bittrex') 
    {
        
        res.end();
    }

    /*
    ExchangeKey.find({ userID: req.userID }, function (err, keys) {
        if (err) return res.status(500).send({error: err});
    });
    */

    const keys = {
        poloniex: {
            apikey: 'U7UN9H0X-AAVF187L-Q78XRLLB-ANA13T3O',
            apisecret: '333b391d4be19cb92c6b983f1011576ec1bc959ed37318d346a79e1b3adf425a35ce10aaab20accefd34c507f4730e2d37e9451b196c0a33229e83aef0501aec',
            password: undefined
        },
        gdax: {
            apikey: '1674e70b483c358a6ebcaeaf0714898d',
            apisecret: 'ks0JG12vTiaGwCeV9ckOuLK26eUN76RYhVzlyZtb04G+F/7dDnkyfGK6O4JpFq5nn/bv2+eUxDKMYUpDxmkXzQ==',
            password: 'p8927n2ng5'
        },
        bittrex: {
            apikey: 'd38580cf13444b9cb08b68e5b62eae81 ',
            apisecret: '16468c86ec224a879f0e860eb80d8bbf',
            password: undefined
        }
    };

    let txns = [];
    // for keys ...

    /* // Migrated to exchange-api function set 
    let exchange = new ccxt[req.params.name]();
    exchange.apiKey = keys[req.params.name].apiKey
    exchange.secret = keys[req.params.name].secret
    exchange.password = keys[req.params.name].password
    let trades = await exchange.fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {currencyPair: 'all', start: 1493596800, end: 1510701542});
    console.log(trades);
    */

    var ex = require('../utils/exchange-api');
    let trades = await ex.fetchTrades(req.params.name, keys[req.params.name]);
    console.log('return trades > poloniex');
    res.status(200).json(trades);

}));

// =========================================================================
// ++++++++             PORTFOLIO FUNCTIONS
// =========================================================================

// ~~~ INPUT=TXNS, OUTPUT=PORTFOLIO
function returnPortfolioTimeline(txns) {
    let p = [];

    txns.map((txn, index) => {
        let i = 1;
        txn.action === 'buy' ? i = 1 : i = -1;
        
        // Use Object.assign() to generate a copy of an object instead of a reference
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign 
        let data = Object.assign({});
        if (index === 0) {
            
            // handle first transaction
            data.timestamp = txn.timestamp;
            data[txn.currency] = i * txn.quantity;
            data[txn.base] = -1 * i * txn.quantity * txn.price;
        } else {
            data = Object.assign({}, p[index-1])
            data.timestamp = txn.timestamp;
            
            // validate if object key for the currency exists
            if (txn.currency in data) {
                data[txn.currency] += i * txn.quantity;
            } else {
                data[txn.currency] = i * txn.quantity;
            }
            // validate if the object key for the base exists
            if (txn.base in data) {
                data[txn.base] -= (i * txn.quantity * txn.price);
            } else {
                data[txn.base] = -1 * i * txn.quantity * txn.price;
            }
        }
        p.push(data);
    })

    return p;
}

module.exports = router;