const { Users } = require("../model/users");

module.exports.Register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const userExist = await Users.findOne({ email: email });
    if (!userExist) {
      const newUser = await new Users({ email, name, password });
      await newUser.save();
      res.json(newUser);
    } else res.json("this email is already registered");
  } catch (error) {
    res.json(error.message);
    console.log("this is error:",error);
  }
};
