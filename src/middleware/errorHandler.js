function errorHandler(err, req, res, next) {
    console.error('❌ Server Error Context: ', err.stack);
    
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error encountered.'
    });
  }
  
  module.exports = errorHandler;