const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      // check token exists in DB
      const tokenDB = await prisma.token.findUnique({ where: { token } });
      if (!tokenDB) {
        return res.status(401).json({ error: "Token not found in DB" });
      }

      // verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach user info to request
      req.user = {
        id: decoded.userId,
        role: decoded.role,
      };

      // role check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden: Insufficient rights" });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};

module.exports = authMiddleware;
