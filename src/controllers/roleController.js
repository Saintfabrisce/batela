import { Role } from '../models/Role.js';
import { logActivity } from '../services/logService.js';

export const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    const role = new Role({
      name,
      description,
      permissions
    });

    await role.save();

    await logActivity(
      req.user.id,
      'CREATE_ROLE',
      { roleId: role._id },
      req.ip,
      req.headers['user-agent'],
      'success'
    );

    res.status(201).json(role);
  } catch (error) {
    await logActivity(
      req.user.id,
      'CREATE_ROLE',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );

    res.status(500).json({ message: 'Erreur lors de la création du rôle' });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true })
      .populate('permissions');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des rôles' });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, permissions, isActive } = req.body;

    const role = await Role.findByIdAndUpdate(
      id,
      { description, permissions, isActive },
      { new: true }
    ).populate('permissions');

    if (!role) {
      return res.status(404).json({ message: 'Rôle non trouvé' });
    }

    await logActivity(
      req.user.id,
      'UPDATE_ROLE',
      { roleId: id },
      req.ip,
      req.headers['user-agent'],
      'success'
    );

    res.json(role);
  } catch (error) {
    await logActivity(
      req.user.id,
      'UPDATE_ROLE',
      { error: error.message },
      req.ip,
      req.headers['user-agent'],
      'failure'
    );

    res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle' });
  }
};