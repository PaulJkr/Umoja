const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: Access denied" });
    }
    next();
  };
};

module.exports = allowRoles;
