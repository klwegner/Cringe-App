// ℹ️ Gets access to environment variables/settings
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
const express = require("express");

// Handles the handlebars
const hbs = require("hbs");

const app = express();
require('./config/session.config')(app);

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "Cringe";

app.locals.appTitle = `${(projectName)} created with IronLauncher`;

const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const postRoutes = require('./routes/posts.routes.js');
app.use('/', postRoutes);

require("./error-handling")(app);

module.exports = app;
