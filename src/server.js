const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const loginRouter = require("./routes/LoginRoute");
const registerRouter = require("./routes/RegisterRoute");
const verifyRouter = require("./routes/VerifyRoute");
const dashbordRouter = require("./routes/DashbordRoute");
const resendEmailRouter = require("./routes/ResendVerifyEmailRoute");
const errorHandler = require("./middlewares/ApiError");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Muitas requisições. Tente novamente mais tarde.",
});
app.use(helmet());
app.use(limiter);
app.use(morgan("combined"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(loginRouter);
app.use(registerRouter);
app.use(dashbordRouter);
app.use(verifyRouter);
app.use(resendEmailRouter);

app.use(errorHandler);

module.exports = app;
