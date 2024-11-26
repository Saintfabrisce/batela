import express from 'express';
import {
  createPermission,
  getPermissions,
  updatePermission
} from '../controllers/permissionController.js';
import { auth } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';

const router = express.Router();

router.post(
  '/permissions',
  auth,
  checkPermission('manage_permissions'),
  createPermission
);

router.get(
  '/permissions',
  auth,
  checkPermission('view_permissions'),
  getPermissions
);

router.put(
  '/permissions/:id',
  auth,
  checkPermission('manage_permissions'),
  updatePermission
);

export default router;