const express = require('express');

// Import data models
//var Note = require('../models/note');

// PROTECTED ROUTES - REQUIRE JWT AUTHENTICATION

const router = new express.Router();

router.get('/dashboard', (req, res) => {
    res.status(200).json({
        message: "You're authorized to see this dashboard"
    });
});

/*
router.get('/notes/:id', (req, res) => {
    var userID = req.params.id;
    Note.find({ userID: userID }, function (err, notes) {
        if (err) return console.error(err);
        res.status(200).json(notes);
    });

});
*/


module.exports = router;