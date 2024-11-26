import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { User } from '../models/User.js';

export const generateSecret = () => {
  return speakeasy.generateSecret({
    name: process.env.APP_NAME
  });
};

export const generateQRCode = async (secret) => {
  try {
    const url = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: process.env.APP_NAME,
      algorithm: 'sha1'
    });
    
    return await QRCode.toDataURL(url);
  } catch (error) {
    throw new Error('Erreur lors de la génération du QR code');
  }
};

export const verifyToken = (secret, token) => {
  try {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'ascii',
      token: token,
      window: 2 // Permet une légère désynchronisation de l'horloge
    });
  } catch (error) {
    return false;
  }
};

export const setup2FA = async (userId) => {
  try {
    const secret = generateSecret();
    const qrCode = await generateQRCode(secret);
    
    await User.findByIdAndUpdate(userId, {
      twoFactorTempSecret: secret.ascii
    });
    
    return {
      qrCode,
      secret: secret.ascii
    };
  } catch (error) {
    throw new Error('Erreur lors de la configuration de la 2FA');
  }
};

export const verify2FASetup = async (userId, token) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.twoFactorTempSecret) {
      throw new Error('Configuration 2FA non initialisée');
    }
    
    const isValid = verifyToken(user.twoFactorTempSecret, token);
    if (!isValid) {
      throw new Error('Code invalide');
    }
    
    user.twoFactorSecret = user.twoFactorTempSecret;
    user.twoFactorEnabled = true;
    user.twoFactorTempSecret = undefined;
    await user.save();
    
    return true;
  } catch (error) {
    throw error;
  }
};

export const disable2FA = async (userId, token) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new Error('2FA non activée');
    }
    
    const isValid = verifyToken(user.twoFactorSecret, token);
    if (!isValid) {
      throw new Error('Code invalide');
    }
    
    user.twoFactorSecret = undefined;
    user.twoFactorEnabled = false;
    await user.save();
    
    return true;
  } catch (error) {
    throw error;
  }
};