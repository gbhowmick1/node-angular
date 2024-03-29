const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const mongooseUniqueValidator = require('mongoose-unique-validator');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: 'User created!',
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Invalid authentication credentials!',
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  //console.log("inside userlogin")
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      //console.log(user)
      if (!user) {
        return res.status(401).json({
          message: 'Invalid Authentication Credentials',
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      //console.log(result);
      if (!result) {
        return res.status(401).json({
          message: 'Invalid Authentication Credentials',
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        { expiresIn: '1h' }
      );

      res.status(200).json({
        token: token,
        expiresIn: 3600000,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Invalid authentication credentials',
      });
    });
};
