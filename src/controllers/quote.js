const express = require('express');
const router = express.Router();
const Templates = require('../templates');

router.route('/')
    .post((req, res) => {
        console.log(req.body)
        Templates.Quote(req.body)
        .then(response => res.json(response))
        .catch(error => {
            console.log(error)
            res.send(error)
        })
    });  

module.exports = router