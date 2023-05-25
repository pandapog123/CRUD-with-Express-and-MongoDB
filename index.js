const express = require("express");
const app = express();
const { createRouter } = require("./router");
const port = 3000;

async function main() {
  const router = await createRouter();

  app.use(express.json());
  app.use(router);

  app.listen(port, () => console.log(`listening on http://localhost:${port}`));
}

main();
