global.__basedir = __dirname;

const dbConnector = require("./config/db");
dbConnector()
  .then(() => {
    const app = require("express")();
    const config = require("./config/config");

    require("./config/express")(app);
    require("./config/routes")(app);

    app.listen(config.port, console.log(`Listening on port ${config.port}`));
  })
  .catch(console.error);
