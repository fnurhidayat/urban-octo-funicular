const jwt = require('jsonwebtoken');

async function authenticate(req, res, next) {
  let token = req.headers.authorization;

  try {
    let payload = jwt.verify(token, process.env.SECRET_KEY);
    req.headers.authorization = payload._id;
    next();
  }

  catch(err) {
    return res.status(401).json({
      status: false,
      errors: 'Invalid token'
    })
  }
}

module.exports = authenticate;
