const jwt = require("jsonwebtoken");
const { Users } = require("../model/users");
const SECRETKEY = "JWTSECRET";



module.exports.isLoggedIn = async (req, res, next) => {
  const { id } = req.params;
  const { token } = req.headers;
  try {
    const userExists = await Users.findOne({_id:id});
    if (token && userExists) {
      const decode = jwt.verify(token, SECRETKEY);
      if (decode.email === userExists.email) {
        next();
      } else {
        res.json("you are not authorized to access this");
      }
    } else res.json(" you are not logged in ");
  } catch (error) {
    res.json(error.message);
    // console.log(error.message);
  }
};
