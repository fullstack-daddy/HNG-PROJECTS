const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { userId: decoded.userId } });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ message: 'Please authenticate' });
  }
};

module.exports = authenticate;
