const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let json = {error:'', result:{}}

  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) { json.error = "Token is not valid!", res.status(403).json(json)}; 
        req.user = user;
        next();
    });
  } else {
    json.error = "You are not authenticated!"
    return res.status(401).json(json);
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  let json = {error:'', result:{}}

  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      json.error = "You are not alowed to do that!"
      res.status(403).json(json);
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  let json = {error:'', result:{}}

  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      json.error = "You are not alowed to do that!"
      res.status(403).json(json);
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};