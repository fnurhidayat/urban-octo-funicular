const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function create(req, res) {
  let password = bcrypt.hashSync(req.body.password, 10);

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password
  })

  user.save()
    .then(i => {
      res.status(201).json({
        status: true,
        data: i
      })
    })
    .catch(err => {
      res.status(422).json({
        status: false,
        errors: err
      })
    }) 
}

function login(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) return res.status(404).json({
        status: false,
        errors: 'Email seems to be not existed!'
      })

      if (bcrypt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

        res.status(200).json({
          status: true,
          data: token 
        })
      } else {
        res.status(401).json({
          status: false,
          errors: 'Wrong password!'
        }) 
      }
    })
    .catch(err => res.status(401).json({
      status: false,
      errors: err
    }))
}

module.exports = {
  create,
  login
}
