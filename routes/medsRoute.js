const router = require('express').Router();
const meds = require('../models/medsModel');
const User = require('../models/userModel');
const verify = require('./userVerification');
const {postValidation} = require('./Validation');

router.get('/', verify, async (req, res) => {
    const info = {};
    info.projects = await meds.find({user: req.user._id});
    const userInfo = await User.findById(req.user._id);
    info.user = userInfo.serialize();
    try {
        res.json(info);
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
        user: req.user._id,
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

router.put('/:id', verify, async (req, res) => {
    const updated = {};
    const updateableFields = [
      "medicine",
      "amount",
      "prescriber",
      "pharmacy",
      "start"
    ];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });

    const updatedData = await meds.findByIdAndUpdate(req.params.id, {$set: updated}, { new: true });
    try {
        res.json(updatedData);
    } catch (error) {
        res.status(500).send(error);
    }

});

router.delete('/:id', verify, async (req, res) => {
    await meds.findByIdAndRemove({_id: req.params.id});
    try {
        res.json({message: 'success'});
    } catch (error) {
        res.send(error);
    }
});
module.exports = router;