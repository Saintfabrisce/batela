import { setup2FA, verify2FASetup, disable2FA, verifyToken } from '../services/twoFactorService.js';
import { User } from '../models/User.js';

export const setup = async (req, res) => {
  try {
    const { qrCode, secret } = await setup2FA(req.user.id);
    
    res.json({
      qrCode,
      secret,
      message: 'Scannez le QR code avec Google Authenticator'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token requis' });
    }
    
    await verify2FASetup(req.user.id, token);
    
    res.json({ message: 'Authentification à deux facteurs activée' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const disable = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token requis' });
    }
    
    await disable2FA(req.user.id, token);
    
    res.json({ message: 'Authentification à deux facteurs désactivée' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validate = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!token) {
      return res.status(400).json({ message: 'Token requis' });
    }
    
    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA non activée' });
    }
    
    const isValid = verifyToken(user.twoFactorSecret, token);
    if (!isValid) {
      return res.status(400).json({ message: 'Code invalide' });
    }
    
    res.json({ message: 'Code valide' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};