const Post = require('../models/post.js');
const User = require('../models/user.js');

function create(req, res) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: false,
      errors: 'Unauthorized'
    })
  } 

  let newPost = new Post({
    title: req.body.title,
    body: req.body.body,
    author: req.headers.authorization
  })

  newPost.save()
    .then(data => {
      res.status(201).json({
        status: true,
        data: newPost
      })
    })
    .catch(err => {
      res.status(422).json({
        status: false,
        errors: err
      })
    })
}

function read(req, res) {
  Post.all()
    .then(data => {
      res.status(200).json({
        status: true,
        data
      })
    })
    .catch(err => {
      res.status(422).json({
        status: false,
        errors: err
      })
    })
}

async function like(req, res) {
  try {
    let post = await Post.findById(req.params._id);
    let user = await User.findById(req.headers.authorization);

    if (!post || !user) {
      return res.status(422).json({
        status: false,
        errors: 'User or Post doesn\'t seem to be exist!'
      })
    }

    post.likes.push(user._id);
    await post.save();

    res.status(201).json({
      status: true,
      data: post
    })
  }

  catch(err) {
    res.status(422).json({
      status: false,
      errors: err
    })
  }
}

module.exports = {
  create,
  read,
  like
}
