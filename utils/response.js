const responseUtil = {
    sendSuccess: (res, data, statusCode = 200) => {
      res.status(statusCode).json({ success: true, data });
    },
  
    sendError: (res, message, statusCode = 500) => {
      res.status(statusCode).json({ success: false, message });
    },
  };
  
  module.exports = responseUtil;
  