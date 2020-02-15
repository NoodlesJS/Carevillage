const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const {registerValidation, loginValidation} = require('./Validation');

// ROUTES
router.post('/register', async (req,res) => {

    // VALIDATE DATA
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message);

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
        res.status(201).send(savedUser.serialize());
    }catch(err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) =>{
    // VALIDATE DATA
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    // CHECK IF EMAIL EXISTS
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json('Incorrect credentials');

    // VALIDATE PASSWORD
    const validatedPass = await bcrypt.compare(req.body.password, user.password);
    if(!validatedPass) return res.status(400).json('Incorrect credentials');

    // CREATE AND ASSIGN JWT TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.json(token);
});

module.exports = router;