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
  return new Promise(async (resolve, reject) => {
    try {
    let result = await Post
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

      resolve(result);
    }

    catch(err) {
      reject(err)
    }
  })
}

module.exports = Post;
