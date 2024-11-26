import crypto from 'crypto';
import { Webhook } from '../models/Webhook.js';
import { logActivity } from '../services/logService.js';

export const createWebhook = async (req, res) => {
  try {
    const { name, url, events } = req.body;

    if (!name || !url || !events || !Array.isArray(events)) {
      return res.status(400).json({ message: 'Données invalides' });
    }

    const secret = crypto.randomBytes(32).toString('hex');
    
    const webhook = new Webhook({
      name,
      url,
      events,
      secret
    });

    await webhook.save();

    await logActivity(
      req.user.id,
      'CREATE_WEBHOOK',
      { webhookId: webhook._id },
      req.ip,
      req.headers['user-agent'],
      'success'
    );

    res.status(201).json({
      ...webhook.toJSON(),
      secret // Envoyé une seule fois à la création
    });
  } catch (error) {
    await logActivity(
      req.user.id,
      'CREATE_WEBHOOK',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );

    res.status(500).json({ message: 'Erreur lors de la création du webhook' });
  }
};

export const getWebhooks = async (req, res) => {
  try {
    const webhooks = await Webhook.find()
      .select('-secret');
    
    res.json(webhooks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des webhooks' });
  }
};

export const updateWebhook = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, events, isActive } = req.body;

    const webhook = await Webhook.findByIdAndUpdate(
      id,
      { name, url, events, isActive },
      { new: true }
    ).select('-secret');

    if (!webhook) {
      return res.status(404).json({ message: 'Webhook non trouvé' });
    }

    await logActivity(
      req.user.id,
      'UPDATE_WEBHOOK',
      { webhookId: id },
      req.ip,
      req.headers['user-agent'],
      'success'
    );

    res.json(webhook);
  } catch (error) {
    await logActivity(
      req.user.id,
      'UPDATE_WEBHOOK',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );

    res.status(500).json({ message: 'Erreur lors de la mise à jour du webhook' });
  }
};

export const deleteWebhook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const webhook = await Webhook.findByIdAndDelete(id);
    
    if (!webhook) {
      return res.status(404).json({ message: 'Webhook non trouvé' });
    }

    await logActivity(
      req.user.id,
      'DELETE_WEBHOOK',
      { webhookId: id },
      req.ip,
      req.headers['user-agent'],
      'success'
    );

    res.json({ message: 'Webhook supprimé avec succès' });
  } catch (error) {
    await logActivity(
      req.user.id,
      'DELETE_WEBHOOK',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );

    res.status(500).json({ message: 'Erreur lors de la suppression du webhook' });
  }
};

export const rotateWebhookSecret = async (req, res) => {
  try {
    const { id } = req.params;
    const newSecret = crypto.randomBytes(32).toString('hex');

    const webhook = await Webhook.findByIdAndUpdate(
      id,
      { secret: newSecret },
      { new: true }
    );

    if (!webhook) {
      return res.status(404).json({ message: 'Webhook non trouvé' });
    }

    await logActivity(
      req.user.id,
      'ROTATE_WEBHOOK_SECRET',
      { webhookId: id },
      req.ip,
      req.headers['user-agent'],
      'success'
    );

    res.json({ secret: newSecret });
  } catch (error) {
    await logActivity(
      req.user.id,
      'ROTATE_WEBHOOK_SECRET',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );

    res.status(500).json({ message: 'Erreur lors de la rotation du secret' });
  }
};