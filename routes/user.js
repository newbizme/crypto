const express = require('express');

// Import data models
var Txn = require('../models/txn');

// PROTECTED ROUTES - REQUIRE JWT AUTHENTICATION

const router = new express.Router();

// *******************************
// TRANSACTIONS FUNCTIONS
// *******************************

router.get('/txns/:id', (req, res) => {
    var userID = req.params.id;
    Txn.find({ userID: userID }, function (err, txns) {
        if (err) return res.status(500).send({error: err});
        res.status(200).json(txns)
    });
});

router.post('/txns', (req, res) => {

})

router.delete('/txns/:id', (req, res) => {
    var id = req.params.id;

    Txn.findByIdAndRemove(id, function(err) {
        if (err) { throw err; }
        return res.status(200).send("Successfully deleted");
    });
});



module.exports = router;