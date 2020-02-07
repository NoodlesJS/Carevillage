const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const {registerValidation, loginValidation} = require('./userValidation');

// ROUTES
router.post('/register', async (req,res) => {

    // VALIDATE DATA
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // CHECK IF EMAIL ALREADY EXISTS
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send(`${req.body.email} already exists`);

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(15);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // CREATE NEW USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    });
    try {
        const savedUser = await user.save();
        res.status(201).send(user.serialize());
    }catch(err) {
        res.status(400).send(err);
    }
})

module.exports = router;