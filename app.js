require("dotenv/config");
require("./db");
const express = require("express");

const app = express();

require("./config")(app);

const { isAuthenticated } = require("./middleware/jwt.middleware");
  

// 👇 Start handling routes here
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const feedbackRouter = require("./routes/feedback.routes");
app.use("/api", isAuthenticated, feedbackRouter);

const recipeRouter = require("./routes/recipe.routes");
app.use("/api", isAuthenticated, recipeRouter);

const userRoutes = require("./routes/user.routes");
app.use("/api", isAuthenticated, userRoutes)

const authRouter = require("./routes/auth.routes");        
app.use("/auth", authRouter); 

require("./error-handling")(app);

module.exports = app;
