const { criarApp } = require('./app');

const porta = process.env.PORT || 3000;

criarApp().listen(porta, () => {
  console.log(`API do VazaApp rodando em http://localhost:${porta}`);
});
