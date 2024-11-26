export const roles = {
  ADMIN: 'admin',
  USER: 'user'
};

export const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Accès non autorisé' });
    }
  };
};