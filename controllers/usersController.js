const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const imagekit = require('../middlewares/imagekit')
const mailer = require('../helpers/mailer.js')
const fs = require('fs')
const Auth = require('../events/auth.js')

function create(req, res) {
  let password = bcrypt.hashSync(req.body.password, 10);

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password
  })

  user.save()
    .then(i => {
      let registerHTML = fs.readFileSync(__dirname + '/../mailers/register.html', { encoding: 'utf-8'})

      let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)

      registerHTML = registerHTML.replace('{User.Name}', user.name)
      registerHTML = registerHTML.replace('{VerificationURL}', process.env.BASE_URL + '/api/v1/users/verify?token=' + token)

      let data = mailer.create({
        to: i.email,
        subject: 'Email Verification',
        html: registerHTML      
      })

      return mailer.send(data)
    })
    .then(i => {
      res.status(201).json({
        status: true,
        data: {
          _id: user._id,
          email: user.email
        }
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

      let userLog = process.log.users[user._id]
      let loginAttempt = 0
      if (userLog)
        loginAttempt = userLog.loginCount; 

      if (loginAttempt > 4) {
        return res.status(422).json({
          status: false,
          errors: "You've reached your maximum exceed for login attempt"
        })
      }

      if (bcrypt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
        Auth.emit('authorized', user._id)

        res.status(200).json({
          status: true,
          data: token 
        })
      } else {
        Auth.emit('unauthorized', {
          _id: user._id,
          email: req.body.email,
          source: req.headers['user-agents']
        })

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

const verify = async (req, res) => {
  let token = req.query.token

  try {
    let payload = await jwt.verify(token, process.env.SECRET_KEY)
    await User.findByIdAndUpdate(payload._id, { isConfirmed: true })

    res.redirect('/')
  }

  catch(err) {
    res.status(401).json({
      status: false,
      errors: 'Invalid token'
    })
  }
}

const uploadPhoto = (req, res) => {
  let url;
  imagekit.upload({
    file: req.file.buffer.toString('base64'),
    fileName: `IMG-${Date.now()}`
  })
    .then(data => {
      url = data.url
      return User.findByIdAndUpdate(req.headers.authorization, {
        image: data.url
      })
    })
    .then(data => {
      res.status(200).json({
        status: true,
        data: url
      })
    })
    .catch(err => {
      res.status(422).json({
        status: false,
        errors: err
      })
    })
}

module.exports = {
  create,
  login,
  uploadPhoto,
  verify
}
