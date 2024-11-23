const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token:', token);

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded);
      req.user = decoded; // Set user info to req.user
      next();
  } catch (error) {
      console.error('Auth Error:', error.message);
      res.status(401).json({ message: 'Unauthorized' });
  }
};
  
  module.exports = authMiddleware;