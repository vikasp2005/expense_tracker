import jwt from 'jsonwebtoken';



export const authenticate = (req, res, next) => {
    const token = req.header('x-auth-token'); // JWT token passed in headers
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    try {
  
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with your secret key
      req.user = decoded; // Attach the decoded user to the request object
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };