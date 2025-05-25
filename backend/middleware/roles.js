module.exports = function(requiredRoles) {
  if (typeof requiredRoles === "string") requiredRoles = [requiredRoles];
  return (req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
};