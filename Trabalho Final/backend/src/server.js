const { criarApp } = require('./app');

const porta = process.env.PORT || 3000;

const app = criarApp();
const servidor = app.listen(porta, () => {
  console.log(`API do VazaApp rodando em http://localhost:${porta}`);
});
servidor.once('close', () => app.locals.banco.close());
