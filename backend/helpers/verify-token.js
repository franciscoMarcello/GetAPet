const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Acesso negado" });
  }
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Acesso negado" });
  }
  try {
    const veified = jwt.verify(token, "nossosecret");
    req.user = veified;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Token invalido!" });
  }
};
module.exports = checkToken;
