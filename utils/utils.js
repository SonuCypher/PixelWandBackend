const jwt = require("jsonwebtoken")
const SECRETKEY = "JWTSECRET"


module.exports.createSession =  (user)=>{
    const sessionToken = jwt.sign(
        { name: user.name, id: user._id, email: user.email },
        SECRETKEY,
        { expiresIn: "15m" }
      );
      const accessToken = jwt.sign(
        { name: user.name, id: user._id, email: user.email },
        SECRETKEY,
        { expiresIn: "30s" }
      )
      return {sessionToken,accessToken}
}

