const { Users } = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Session } = require("../model/session");
const SECRETKEY = "JWTSECRET";

module.exports.Register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const userExist = await Users.findOne({ email: email });
    if (!userExist) {
      const newUser = await new Users({ email, name, password });
      await newUser.save();
      const sessionToken = jwt.sign(
        { name: newUser.name, id: newUser._id, email: newUser.email },
        SECRETKEY,
        { expiresIn: "15m" }
      );
      const accessToken = jwt.sign(
        { name: newUser.name, id: newUser._id, email: newUser.email },
        SECRETKEY,
        { expiresIn: "5m" }
      );
      const newSession = await new Session({
        userId: newUser._id,
        token: sessionToken,
      });
      await newSession.save();
      res.json({
        newUser: { ...newUser, password: "NoSecret" },
        accessToken,
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
        const sessionToken = jwt.sign(
          { name: userExist.name, id: userExist._id, email: userExist.email },
          SECRETKEY,
          { expiresIn: "15m" }
        );
        const accessToken = jwt.sign(
          { name: userExist.name, id: userExist._id, email: userExist.email },
          SECRETKEY,
          { expiresIn: "5m" }
        );
        const newSession = await new Session({
          userId: userExist._id,
          token: sessionToken,
        });
        await newSession.save();
        res.json({
          id: userExist._id,
          token: accessToken,
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
  const { refId } = req.body;
  try {
    const findUser = await Users.findById(id);
    if (!findUser) res.json("user not found");
    const findSession = await Session.findByIdAndDelete(refId);
  } catch (error) {
    res.json(error.message);
  }
};

module.exports.Secret = async (req, res) => {
  const { id } = req.params;
  try {
    res.json({ id: id, secret: "Boost is the secret of my energy" });
  } catch (error) {
    res.json(error.message);
    console.log("this is error:", error);
  }
};

module.exports.RefreshTokens = async (req, res) => {
  const { id } = req.params;
  const { refId } = req.headers;
  try {
    const findUser = await Users.findById(id);
    if (!findUser) res.json("user not found");
    const findSession = await Session.findById(refId);
    if (!findSession) res.json("your session is over,need to login");
    const verifySession = jwt.verify(
      findSession.token,
      SECRETKEY,
      (err, decoded) => {
        if (err) return false;
        return decoded;
      }
    );
    if (!verifySession) {
      await Session.findByIdAndDelete(refId);
      res.json("your session is over,need to login");
    } else {
      const accessToken = jwt.sign(
        {
          name: verifySession.name,
          id: verifySession.id,
          email: verifySession.email,
        },
        SECRETKEY,
        { expiresIn: "5m" }
      );
      res.json({ token: accessToken });
    }
  } catch (error) {
    res.json(error.message);
  }
};
