require("dotenv/config");
require("./db");
const express = require("express");

const app = express();

require("./config")(app);

// 👇 Start handling routes here
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const recipeRouter = require("./routes/recipe.routes");
app.use("/api", recipeRouter);

/* const taskRouter = require("./routes/task.routes");
app.use("/api", taskRouter); */

require("./error-handling")(app);

module.exports = app;
