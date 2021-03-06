//<---------------------------BEGIN IMPORT------------------------------------>

//Import App Modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

//Import Cyber Security Modules

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

//Import Routers Modules
const relationshipRoutes = require("./routes/relationship/relationshipRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/relationship/groupRoutes");
const bookRoutes = require("./routes/journal/bookRoutes");
const quoteRoutes = require("./routes/journal/quoteRoutes");
const timelineEventRoutes = require("./routes/journal/timelineEventRoutes");
const blogPostRoutes = require("./routes/blog/blogPostRoutes");

//Import Error Handling Modules

const AppError = require("./utilities/appError");
const ErrorHandler = require("./controllers/errorController");

//<----------------------------Mount Middleware------------------------------->

//Instantiate Express Instance
const app = express();

//Add Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//<--------------------------Cyber Security Middleware------------------------>
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/api", limiter);

//<--------------------------Storage Middleware------------------------------->

//<--------------------------Route Middleware--------------------------------->

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/blogPosts", blogPostRoutes);

//Error if route is missed
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//<--------------------------Eroror Handling Middware------------------------->

app.use(ErrorHandler);

//Start Server
module.exports = app;
