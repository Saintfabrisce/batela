import crypto from 'crypto';
import { Webhook } from '../models/Webhook.js';
import { systemLog } from './logService.js';

export const createSignature = (payload, secret) => {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
};

export const triggerWebhooks = async (event, payload) => {
  try {
    const webhooks = await Webhook.find({
      events: event,
      isActive: true
    });

    const promises = webhooks.map(webhook => {
      const signature = createSignature(payload, webhook.secret);
      
      return fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature
        },
        body: JSON.stringify({
          event,
          payload,
          timestamp: new Date().toISOString()
        })
      })
      .then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await Webhook.findByIdAndUpdate(webhook._id, {
          lastTriggered: new Date(),
          $set: { failureCount: 0 }
        });
      })
      .catch(async error => {
        systemLog.error('Webhook delivery failed', {
          webhookId: webhook._id,
          error: error.message
        });
        
        await Webhook.findByIdAndUpdate(webhook._id, {
          $inc: { failureCount: 1 }
        });
      });
    });

    await Promise.allSettled(promises);
  } catch (error) {
    systemLog.error('Error triggering webhooks', {
      error: error.message,
      event
    });
  }
};