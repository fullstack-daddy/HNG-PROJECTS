import User from '../models/User.js';
import Organisation from '../models/Organisation.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { compare } = bcrypt

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export async function register(req, res) {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const user = new User({
      userId: Date.now().toString(),
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    await user.save();

    const organisation = new Organisation({
      orgId: Date.now().toString(),
      name: `${firstName}'s Organisation`,
      users: [user._id],
    });

    await organisation.save();

    user.organisations.push(organisation._id);
    await user.save();

    const token = generateToken(user.userId);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(422).json({ errors });
    }
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const token = generateToken(user.userId);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
}