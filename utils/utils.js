const jwt = require("jsonwebtoken")


module.exports.createSession =  (user)=>{
    const sessionToken = jwt.sign(
        { name: user.name, id: user._id, email: user.email },
        process.env.JWTSECRET,
        { expiresIn: "15m" }
      );
      const accessToken = jwt.sign(
        { name: user.name, id: user._id, email: user.email },
        process.env.JWTSECRET,
        { expiresIn: "30s" }
      )
      return {sessionToken,accessToken}
}

