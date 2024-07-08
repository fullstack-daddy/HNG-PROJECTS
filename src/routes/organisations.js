const express = require('express');
const authenticate = require('../middlewares/auth');
const { getOrganisations, getOrganisationById, createOrganisation } = require('../controllers/organisationController');
const { check } = require('express-validator');
const validate = require('../middlewares/validation');

const router = express.Router();

router.get('/organisations', authenticate, getOrganisations);
router.get('/organisations/:orgId', authenticate, getOrganisationById);
router.post(
  '/organisations',
  authenticate,
  validate([check('name').not().isEmpty().withMessage('Name is required')]),
  createOrganisation
);

module.exports = router;
