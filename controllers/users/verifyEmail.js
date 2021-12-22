const { NotFound } = require("http-errors");

const { User } = require("../../models");

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params; //все что находится за двоеточием, храниться в params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new NotFound("User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({
    message: "Verification successful",
  });
};

module.exports = verifyEmail;
