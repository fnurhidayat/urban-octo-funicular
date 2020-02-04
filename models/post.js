const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: 'string',
    required: true
  },
  body: {
    type: 'string',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User' 
    }
  ]
})

const Post = mongoose.model('Post', postSchema);

Post.all = () => {
  return new Promise((resolve, reject) => {
    Post
      .find()
      .select([
        '_id',
        'title',
        'body',
        'author',
        'likes'
      ])
      .populate([
        {
          path: 'author',
          select: ['_id','name','email']
        },
        {
          path: 'likes',
          select: ['_id','name']
        },
      ])
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = Post;
