const Organisation = require('../models/Organisation.js');

const getOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.findAll({
      where: {
        // Add logic to filter organisations by userId if needed
      },
    });

    res.status(200).send({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations,
      },
    });
  } catch (e) {
    res.status(500).send({
      status: 'error',
      message: 'Server error',
    });
  }
};

const getOrganisationById = async (req, res) => {
  try {
    const organisation = await Organisation.findOne({
      where: { orgId: req.params.orgId },
    });

    if (!organisation) {
      return res.status(404).send({
        status: 'fail',
        message: 'Organisation not found',
      });
    }

    res.status(200).send({
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: organisation,
    });
  } catch (e) {
    res.status(500).send({
      status: 'error',
      message: 'Server error',
    });
  }
};

const createOrganisation = async (req, res) => {
  const { name, description } = req.body;

  try {
    const orgId = uuidv4();
    const organisation = await Organisation.create({
      orgId,
      name,
      description,
    });

    res.status(201).send({
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (e) {
    res.status(400).send({
      status: 'Bad request',
      message: 'Client error',
      statusCode: 400,
    });
  }
};

module.exports = {
  getOrganisations,
  getOrganisationById,
  createOrganisation,
};
