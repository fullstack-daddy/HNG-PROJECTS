import { Router } from 'express';
import { getAllOrganisations, getOrganisation, createOrganisation, addUserToOrganisation } from '../controllers/organisationController';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', auth, getAllOrganisations);
router.get('/:orgId', auth, getOrganisation);
router.post('/', auth, createOrganisation);
router.post('/:orgId/users', auth, addUserToOrganisation);

export default router;