


export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super-admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};


export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super-admin") {
    return res.status(403).json({ message: "Access denied. Super Admin only." });
  }
  next();
};