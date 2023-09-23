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
      res.status(201).json({
        newUser:newUser._id,
        accessToken:token.accessToken,
        refTokenId: newSession._id,
      });
    } else res.status(401).json("this email is already registered");
  } catch (error) {
    res.status(404).json(error.message);
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
        res.status(201).json({
          id: userExist._id,
          token: token.accessToken,
          refTokenId: newSession._id,
        });
      } else res.status(401).json("wrong credentials");
    } else res.status(401).json("wrong credentials");
  } catch (error) {
    res.status(401).json(error.message);
  }
};





module.exports.Logout = async (req, res) => {
  const { id } = req.params;
  const { refid } = req.headers;
  try {
    const findSession = await Session.findOne({_id:refid,userId:id});
    if (!findSession) res.json("user not found");
    const deleteSession = await Session.findByIdAndDelete(refid);
    res.status(201).json("logged out")
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports.Secret = async (req, res) => {
  const { id } = req.params;
  try {
    res.status(201).json({ id: id, secret: "This is a protected route" });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports.RefreshTokens = async (req, res) => {
  const { id } = req.params;
  const { refid } = req.headers;
  try {
    const findSession = await Session.findOne({ _id: refid, userId: id });
    if (!findSession) {
      res.status(401).json("your session is over,need to login");
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
        res.status(401).json("your session is over,need to login");
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
        res.status(201).json({ token: accessToken });
      }
    }
  } catch (error) {
    res.status(401).json(error.message);
  }
};
