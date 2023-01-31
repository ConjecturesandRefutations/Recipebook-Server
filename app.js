require("dotenv/config");
require("./db");
const express = require("express");

const app = express();

require("./config")(app);

const { isAuthenticated } = require("./middleware/jwt.middleware");

// 👇 Start handling routes here
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const recipeRouter = require("./routes/recipe.routes");
app.use("/api",  isAuthenticated, recipeRouter);

const authRouter = require("./routes/auth.routes");        
app.use("/auth", authRouter); 

require("./error-handling")(app);

module.exports = app;
