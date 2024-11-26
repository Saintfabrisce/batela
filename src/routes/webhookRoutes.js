import express from 'express';
import {
  createWebhook,
  getWebhooks,
  updateWebhook,
  deleteWebhook,
  rotateWebhookSecret
} from '../controllers/webhookController.js';
import { auth } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';

const router = express.Router();

router.post(
  '/webhooks',
  auth,
  checkPermission('manage_webhooks'),
  createWebhook
);

router.get(
  '/webhooks',
  auth,
  checkPermission('view_webhooks'),
  getWebhooks
);

router.put(
  '/webhooks/:id',
  auth,
  checkPermission('manage_webhooks'),
  updateWebhook
);

router.delete(
  '/webhooks/:id',
  auth,
  checkPermission('manage_webhooks'),
  deleteWebhook
);

router.post(
  '/webhooks/:id/rotate-secret',
  auth,
  checkPermission('manage_webhooks'),
  rotateWebhookSecret
);

export default router;