
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.rolle !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
};

export default adminMiddleware;
