function success(res, data, statusCode) {
  return res.status(statusCode).json({  
    status: true,
    data
  })
}

function error(res, err, statusCode) {
  return res.status(statusCode).json({ 
    status: false,
    errors: err
  })
}

module.exports = {
  success,
  error
};
