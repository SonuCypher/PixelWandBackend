const jwt = require("jsonwebtoken");
const { Users } = require("../model/users");




module.exports.isLoggedIn = async (req, res, next) => {
  const { id } = req.params;
  const { token } = req.headers;
  try {
    const userExists = await Users.findOne({_id:id});
    if (token && userExists) {
      const decode = jwt.verify(token, process.env.JWTSECRET,(err, decoded) => {
        if (err) return false;
        return decoded;
      });
      if (decode.email === userExists.email) {
        next();
      } else {
        res.status(401).json("your verification failed");
      }
    } else res.status(401).json(" you are not logged in ");
  } catch (error) {
    res.status(401).json(error.message);
  
  }
};
