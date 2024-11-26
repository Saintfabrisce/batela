import { Subscription, UserSubscription } from '../config/subscriptions.js';
import { systemLog } from '../services/logService.js';

export const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await Subscription.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await UserSubscription.findOne({
      userId: req.user.id,
      status: 'active'
    }).populate('subscriptionId');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Aucun abonnement actif trouvé'
      });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const { subscriptionId, paymentDetails } = req.body;

    const plan = await Subscription.findById(subscriptionId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan d\'abonnement non trouvé'
      });
    }

    // Créer l'abonnement
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = new UserSubscription({
      userId: req.user.id,
      subscriptionId: plan._id,
      endDate,
      paymentHistory: [{
        amount: plan.price,
        paymentMethod: paymentDetails.method,
        transactionId: paymentDetails.transactionId
      }]
    });

    await subscription.save();

    await systemLog.info('Abonnement créé', {
      userId: req.user.id,
      subscriptionId: plan._id,
      amount: plan.price
    });

    res.json({
      success: true,
      subscription
    });

  } catch (error) {
    await systemLog.error('Erreur création abonnement', {
      userId: req.user.id,
      error: error.message
    });

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await UserSubscription.findOneAndUpdate(
      {
        userId: req.user.id,
        status: 'active'
      },
      { status: 'cancelled' },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Aucun abonnement actif trouvé'
      });
    }

    await systemLog.info('Abonnement annulé', {
      userId: req.user.id,
      subscriptionId: subscription._id
    });

    res.json({
      success: true,
      message: 'Abonnement annulé avec succès'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};