const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // Debugging
      req.user = decoded; // Attach decoded data
      if (!req.user.userId) {
        return res.status(400).json({ message: "Invalid Token: No userId" });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  
module.exports = auth;
