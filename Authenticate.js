const jwt = require("jsonwebtoken");

//? authorize => Middleware for Api endpoints...
const authorize = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      // ------------------
      const verify = jwt.verify(
        req.headers.authorization,
        process.env.SECRET_KEY
      );
      // ------------------
      if (verify) {
        next();
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
      // ------------------
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Unauthorized" });
    }
  }
};

module.exports = { authorize };
