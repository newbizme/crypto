const express = require('express');

// Import data models
var Txn = require('../models/txn');

// PROTECTED ROUTES - REQUIRE JWT AUTHENTICATION

const router = new express.Router();

// *******************************
// TRANSACTIONS FUNCTIONS
// *******************************

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

router.delete('/txns/:id', (req, res) => {
    var id = req.params.id;

    Txn.findByIdAndRemove(id, function(err) {
        if (err) { throw err; }
        return res.status(200).send("Successfully deleted");
    });
});

// *******************************
// PORTFOLIO FUNCTIONS
// *******************************

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