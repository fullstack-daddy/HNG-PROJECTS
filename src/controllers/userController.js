import User from '../models/User.js';

export async function getUser(req, res) {
  try {
    const user = await User.findOne({ userId: req.params.id });

    if (!user) {
      return res.status(404).json({
        status: 'Not found',
        message: 'User not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User retrieved successfully',
      data: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      statusCode: 500,
    });
  }
}