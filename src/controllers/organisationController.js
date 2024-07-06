import Organisation from '../models/Organisation';
import User from '../models/User';

export async function getAllOrganisations(req, res) {
  try {
    const organisations = await Organisation.find({ users: req.user._id });

    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations: organisations.map((org) => ({
          orgId: org.orgId,
          name: org.name,
          description: org.description,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      statusCode: 500,
    });
  }
}

export async function getOrganisation(req, res) {
  try {
    const organisation = await Organisation.findOne({
      orgId: req.params.orgId,
      users: req.user._id,
    });

    if (!organisation) {
      return res.status(404).json({
        status: 'Not found',
        message: 'Organisation not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      statusCode: 500,
    });
  }
}

export async function createOrganisation(req, res) {
  try {
    const { name, description } = req.body;

    const organisation = new Organisation({
      orgId: Date.now().toString(),
      name,
      description,
      users: [req.user._id],
    });

    await organisation.save();

    req.user.organisations.push(organisation._id);
    await req.user.save();

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
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
      status: 'Bad Request',
      message: 'Client error',
      statusCode: 400,
    });
  }
}

export async function addUserToOrganisation(req, res) {
  try {
    const { userId } = req.body;
    const organisation = await Organisation.findOne({
      orgId: req.params.orgId,
      users: req.user._id,
    });

    if (!organisation) {
      return res.status(404).json({
        status: 'Not found',
        message: 'Organisation not found',
        statusCode: 404,
      });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        status: 'Not found',
        message: 'User not found',
        statusCode: 404,
      });
    }

    if (organisation.users.includes(user._id)) {
      return res.status(400).json({
        status: 'Bad Request',
        message: 'User already in organisation',
        statusCode: 400,
      });
    }

    organisation.users.push(user._id);
    await organisation.save();

    user.organisations.push(organisation._id);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      statusCode: 500,
    });
  }
}