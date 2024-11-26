import { Role } from '../models/Role.js';
import { Permission } from '../models/Permission.js';

export const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const role = await Role.findById(req.user.role)
        .populate('permissions');

      if (!role) {
        return res.status(403).json({ message: 'Rôle non trouvé' });
      }

      const hasPermission = role.permissions.some(
        p => p.name === permissionName && p.isActive
      );

      if (!hasPermission) {
        return res.status(403).json({ message: 'Permission insuffisante' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la vérification des permissions' });
    }
  };
};

export const checkMultiplePermissions = (permissionNames) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const role = await Role.findById(req.user.role)
        .populate('permissions');

      if (!role) {
        return res.status(403).json({ message: 'Rôle non trouvé' });
      }

      const hasAllPermissions = permissionNames.every(name =>
        role.permissions.some(p => p.name === name && p.isActive)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({ message: 'Permissions insuffisantes' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la vérification des permissions' });
    }
  };
};