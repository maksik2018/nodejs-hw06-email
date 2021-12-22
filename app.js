const express = require("express");
const logger = require("morgan");
const cors = require("cors");

// const { SENDGRID_API_KEY } = process.env;

// sgMail.setApiKey(SENDGRID_API_KEY);

// const email = {
//   to: "gashenko100@ukr.net",
//   from: "gashenko10@gmail.com",
//   subject: "Новая заявка с сайта",
//   html: "<p>С сайта пришла новая заявка</p>",
// };

// sgMail
//   .send(email)
//   .then(() => console.log("Email send successfully"))
//   .catch((error) => console.log(error.message));

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");
const usersRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message: err.message });
});

module.exports = app;
