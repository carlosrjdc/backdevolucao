const app = require("./src/routes/app.js");

const port = 4000;

app.listen(port, () => {
  console.log(`Escutando requisição na Porta http://localhost:${port}`);
});
