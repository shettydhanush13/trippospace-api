const express = require('express');
const router = express.Router();
const Category = require('../app/models/category');

router.route('/')
    .post((req, res) => {
        let query = { id: { $in : req.body.tags} }
        let action = req.body.action
        Category.find(query,(err, categories) => {
            if (err) { res.send(err) }
            else for(let i = 0; i < categories.length; i++){
                Category.update({ id : categories[i].id }, { $set : { trips : categories[i].trips + action } }, err => {
                    err ? res.send(err)
                    :
                    i === categories.length-1 ? res.send(err)
                    :
                    res.send("hi")
                })
            }
        });
    })

module.exports = router