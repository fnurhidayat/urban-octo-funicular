const axios = require('axios')

exports.getFacebook = (req, res) => {
  axios.get('https://www.facebook.com')
    .then(response => {
      res.send(response.data)
    })
    .catch(err => {
      console.log(err.response.data)
      res.end() 
    })
}

exports.getJSON = (req, res) => {
  axios.get('https://jsonplaceholder.typicode.com/posts')
    .then(response => {
      res.status(200).json({
        status: true,
        data: response.data
      })
    })
    .catch(err => {
      console.log(err.response.data)
      res.end() 
    })
}

exports.postJSON = (req, res) => {
  let data = {
    title: req.body.title,
    body: req.body.body,
    userId: req.body.userId
  }

  axios.post('https://jsonplaceholder.typicode.com/posts', {
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      res.status(200).json({
        status: true,
        data: response.data
      })
    })
    .catch(err => {
      console.log(err.response.data)
      res.end() 
    })
}

exports.postTelegram = (req, res) => {
  let data = {
      chat_id: "591162822",
      text: req.body.message
  }

  axios.get('https://api.telegram.org/bot1012067456:AAHEijJ2dLkVAgzcspLyzLDu2T-sipAFuVA/sendMessage?chat_id=' + data.chat_id + "&text=" + data.text)
    .then(response => {
      res.status(200).json({
        status: true,
        data: response.data
      })
    })
    .catch(err => {
      res.status(422).json({
        status: false,
        errors: err.response.data
      }) 
    })
}
