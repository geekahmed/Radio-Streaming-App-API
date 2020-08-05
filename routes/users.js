const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const {registerValidation, loginValidation} = require('../validation');

router.use(bodyParser.json());

router.post('/register', async (req, res) => {
  const {error} = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Checking if the user exists
  const emailExists = await User.findOne({email: req.body.email});
  if(emailExists) return res.status(400).send('Email already exists');


  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create new User
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashPassword
  });


  try{
      const savedUser = await user.save();
      res.send({user: user._id});
  } catch (err){
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  const {error} = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Checking if the email exists
  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send('Email or Password is wrong');

  // Checking Password is Correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid Password');


  // Create and Assign Token

  const token = jwt.sign({_id: user._id},config.tokenSecret );
  res.header('auth-token', token).send(token);




});
module.exports = router;
