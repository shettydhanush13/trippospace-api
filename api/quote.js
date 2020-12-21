const express = require('express');
const router = express.Router();
const Templates = require('../templates/mailTemplates');

router.route('/')
    .post((req, res) => {
        console.log(req.body)
        Templates.Quote(req)
        .then(response => res.json(response))
        .catch(error => {
            console.log(error)
            res.send(error)
        })
    });  

module.exports = router