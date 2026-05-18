import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    req.user = decoded;
    next();
  });
}

