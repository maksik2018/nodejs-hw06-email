const { Conflict } = require("http-errors");
const { nanoid } = require("nanoid");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const { User } = require("../../models");

const { sendEmail } = require("../../helpers");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict("Email is in use");
  }
  // const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  // const newUser = await User.create({
  //   password: hashPassword,
  //   email,
  // });
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);
  const newUser = new User({ email, password, avatarURL, verificationToken });
  const { subscription } = await User.create(newUser);

  newUser.setPassword(password);
  await newUser.save();

  const mail = {
    to: email,
    subject: "Email verifying",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`,
  };

  await sendEmail(mail);

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        email,
        avatarURL,
        subscription,
        verificationToken,
      },
    },
  });
};

module.exports = register;
