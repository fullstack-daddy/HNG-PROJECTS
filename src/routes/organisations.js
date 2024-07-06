import express from 'express';
import { getAllOrganisations, getOrganisation, createOrganisation, addUserToOrganisation } from '../controllers/organisationController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', auth, getAllOrganisations);
router.get('/:orgId', auth, getOrganisation);
router.post('/', auth, createOrganisation);
router.post('/:orgId/users', auth, addUserToOrganisation);

export default router;