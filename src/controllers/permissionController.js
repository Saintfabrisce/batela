import { Permission } from '../models/Permission.js';
import { logActivity } from '../services/logService.js';

export const createPermission = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const permission = new Permission({
      name,
      description,
      category
    });

    await permission.save();

    await logActivity(
      req.user.id,
      'CREATE_PERMISSION',
      { permissionId: permission._id },
      req.ip,
      req.headers['user-agent'],
      'success'
    );

    res.status(201).json(permission);
  } catch (error) {
    await logActivity(
      req.user.id,
      'CREATE_PERMISSION',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );

    res.status(500).json({ message: 'Erreur lors de la création de la permission' });
  }
};

export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({ isActive: true });
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des permissions' });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, isActive } = req.body;

    const permission = await Permission.findByIdAndUpdate(
      id,
      { description, isActive },
      { new: true }
    );

    if (!permission) {
      return res.status(404).json({ message: 'Permission non trouvée' });
    }

    await logActivity(
      req.user.id,
      'UPDATE_PERMISSION',
      { permissionId: id },
      req.ip,
      req.headers['user-agent'],
      'success'
    );

    res.json(permission);
  } catch (error) {
    await logActivity(
      req.user.id,
      'UPDATE_PERMISSION',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );

    res.status(500).json({ message: 'Erreur lors de la mise à jour de la permission' });
  }
};