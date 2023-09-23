const { Users } = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Session } = require("../model/session");
const { createSession } = require("../utils/utils");





module.exports.Register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const userExist = await Users.findOne({ email: email });
    if (!userExist) {
      const newUser = await new Users({ email, name, password });
      await newUser.save();
    const token = createSession(newUser)
      const newSession = await new Session({
        userId: newUser._id,
        token: token.sessionToken,
      });
      await newSession.save();
      res.json({
        newUser:newUser._id,
        accessToken:token.accessToken,
        refTokenId: newSession._id,
      });
    } else res.json("this email is already registered");
  } catch (error) {
    res.json(error.message);
    console.log("this is error:", error);
  }
};





module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await Users.findOne({ email: email });
    if (userExist) {
      const validPassword = await bcrypt.compare(password, userExist.password);
      if (validPassword) {
        const token = createSession(userExist)
        const newSession = await new Session({
          userId: userExist._id,
          token: token.sessionToken,
        });
        await newSession.save();
        res.json({
          id: userExist._id,
          token: token.accessToken,
          refTokenId: newSession._id,
        });
      } else res.json("wrong credentials");
    } else res.json("wrong credentials");
  } catch (error) {
    res.json(error.message);
    console.log("this is error:", error);
  }
};





module.exports.Logout = async (req, res) => {
  const { id } = req.params;
  const { refid } = req.headers;
  try {
    const findSession = await Session.findOne({_id:refid,userId:id});
    if (!findSession) res.json("user not found");
    const deleteSession = await Session.findByIdAndDelete(refid);
    res.json("logged out")
  } catch (error) {
    res.json(error.message);
  }
};

module.exports.Secret = async (req, res) => {
  const { id } = req.params;
  try {
    res.json({ id: id, secret: "This is a protected route" });
  } catch (error) {
    res.json(error.message);
    console.log("this is error:", error);
  }
};

module.exports.RefreshTokens = async (req, res) => {
  const { id } = req.params;
  const { refid } = req.headers;
  try {
    const findSession = await Session.findOne({ _id: refid, userId: id });
    if (!findSession) {
      res.json("your session is over,need to login -1");
    } else {
      const verifySession = jwt.verify(
        findSession.token,
        process.env.JWTSECRET,
        (err, decoded) => {
          if (err) return false;
          return decoded;
        }
      );
      if (!verifySession) {
        await Session.findByIdAndDelete(refid);
        res.json("your session is over,need to login -2");
      } else {
        const accessToken = jwt.sign(
          {
            name: verifySession.name,
            id: verifySession.id,
            email: verifySession.email,
          },
          process.env.JWTSECRET,
          { expiresIn: "5m" }
        );
        res.json({ token: accessToken });
      }
    }
  } catch (error) {
    res.json(error.message);
  }
};
