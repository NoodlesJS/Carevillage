const router = require('express').Router();
const meds = require('../models/medsModel');
const User = require('../models/userModel');
const verify = require('./userVerification');
const {postValidation} = require('./Validation');

router.get('/', verify, async (req, res) => {
    const allPosts = await meds.find({user: req.body._id});
    try {
        res.send(allPosts);
    }catch (err) {
        res.status(400).send('Posts not found');
    }
});

router.post('/post', verify, async (req, res) => {
    // VALIDATING DATA
    const {error} = postValidation(req.body);
    if(error) return res.status(400).send(error.detail[0].message);

    // CREATING POST
    const post = new meds ({
        user: req.body._id,
        medicine: req.body.medicine,
        amount: req.body.amount,
        prescriber: req.body.prescriber,
        pharmacy: req.body.pharmacy,
        start: req.body.start
    });
    try {
        const savedMed = await post.save();
        res.status(201).send(savedMed.serialize());
    }catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;