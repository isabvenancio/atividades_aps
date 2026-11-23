const Database = require('better-sqlite3');
const path = require('node:path');

const arquivoPadrao = path.resolve(__dirname, '../../../vazaapp.sqlite');

function abrirBanco(arquivo = process.env.SQLITE_PATH || arquivoPadrao) {
  const banco = new Database(arquivo);
  try {
    banco.pragma('foreign_keys = ON');
    banco.transaction(() => banco.exec(`
      CREATE TABLE IF NOT EXISTS categorias (
        id TEXT NOT NULL PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT NOT NULL,
        ativa INTEGER NOT NULL CHECK (ativa IN (0, 1))
      );
      CREATE TABLE IF NOT EXISTS destinatarios (
        id TEXT NOT NULL PRIMARY KEY,
        conta_id TEXT NOT NULL,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL,
        proximidade TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS destinatarios_por_conta
        ON destinatarios (conta_id, nome, id);
      CREATE TABLE IF NOT EXISTS pedidos (
        id TEXT NOT NULL PRIMARY KEY,
        conta_id TEXT NOT NULL,
        titulo TEXT NOT NULL,
        estado TEXT NOT NULL,
        situacao TEXT,
        contexto TEXT,
        categoria_id TEXT REFERENCES categorias(id),
        categoria_nome TEXT,
        destinatario_nome TEXT,
        destinatario_tipo TEXT,
        destinatario_proximidade TEXT,
        destinatario_origem TEXT,
        criado_em TEXT NOT NULL
      );
    `))();
    return banco;
  } catch (erro) {
    banco.close();
    throw erro;
  }
}

module.exports = { abrirBanco };
