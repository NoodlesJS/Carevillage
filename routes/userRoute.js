const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const {registerValidation, loginValidation} = require('./Validation');

// ROUTES
router.post('/register', async (req,res) => {

    const err = {};
    // VALIDATE DATA
    const {error} = registerValidation(req.body);
    if(error) {
        err.Error = error.details[0].message
        return res.status(400).send(err);
    } 

    // CHECK IF EMAIL ALREADY EXISTS
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) {
        err.Error = `${req.body.email} already exists`;
        return res.status(400).send(err);
    }

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
        res.status(201).send(savedUser.serialize());
    }catch(err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) =>{

    const err = {};
    // VALIDATE DATA
    const {error} = loginValidation(req.body);
    if(error) {
        err.Error = error.details[0].message
        return res.status(400).send(err);
    }

    // CHECK IF EMAIL EXISTS
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        err.Error = `Email doesn't exist`;
        return res.status(400).send(err);
    }
    // VALIDATE PASSWORD
    const validatedPass = await bcrypt.compare(req.body.password, user.password);
    if(!validatedPass) {
        err.Error = `Invalid password`;
        return res.status(400).send(err);
    }

    // CREATE AND ASSIGN JWT TOKEN
    const auth = {};
    auth.token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', auth.token).send(auth);
});

module.exports = router;