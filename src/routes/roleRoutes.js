import express from 'express';
import {
  createRole,
  getRoles,
  updateRole
} from '../controllers/roleController.js';
import { auth } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';

const router = express.Router();

router.post(
  '/roles',
  auth,
  checkPermission('manage_roles'),
  createRole
);

router.get(
  '/roles',
  auth,
  checkPermission('view_roles'),
  getRoles
);

router.put(
  '/roles/:id',
  auth,
  checkPermission('manage_roles'),
  updateRole
);

export default router;