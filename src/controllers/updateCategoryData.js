const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.route('/')
    .post((req, res) => {
        let query = { id: { $in : req.body.tags } }
        let action = req.body.action
        let error = false
        Category.find(query,(err, categories) => {
            if (err) { res.send(err) }
            else for(let i = 0; i < categories.length; i++){
                error = false
                Category.update({ id : categories[i].id }, { $set : { trips : categories[i].trips + action } }, err => {
                    if(err) error = true
                    else if(i === categories.length-1) error = true
                })
                if(error) break;
            }
            if(error) res.send("categories update failed")
            else res.send("categories update succesfully")
        });
    })

module.exports = router