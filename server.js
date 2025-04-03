const express = require('express');
 const sqlite3 = require('sqlite3').verbose();
 const bodyParser = require('body-parser');
 const fs = require('fs');
 const path = require('path');
 
 const app = express();
 const port = 3000;
 
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 
 // Servir arquivos estáticos
 app.use(express.static(path.join(__dirname, '/')));
 
 // Conectar ao banco de dados
 let db;
 
 function connectToDatabase() {
  db = new sqlite3.Database('farmacia.db', (err) => {
  if (err) {
  console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
  console.log('Conectado ao banco de dados SQLite.');
  createTable();
  }
  });
 }
 
 function createTable() {
  db.run(`
  CREATE TABLE IF NOT EXISTS Medicamentos (
  ID_Med INTEGER PRIMARY KEY AUTOINCREMENT,
  Desc_Med TEXT NOT NULL,
  Dosagem TEXT NOT NULL,
  Qtd_Est INTEGER NOT NULL,
  Fabricante TEXT NOT NULL,
  Uso_Controlado TEXT,
  Posic_Estq TEXT NOT NULL
  )
 `, (err) => {
  if (err) {
  console.error('Erro ao criar tabela:', err.message);
  }
  });
 }
 
 connectToDatabase();
 
 // Rota para cadastrar medicamento
 app.post('/cadastrarMedicamento', (req, res) => {
  const { Desc_Med, Dosagem, Qtd_Est, Fabricante, Uso_Controlado, Posic_Estq } = req.body;
 
  // Validação básica dos dados
  if (!Desc_Med || !Dosagem || !Qtd_Est || !Fabricante || !Posic_Estq) {
  return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
  }
 
  const sql = `INSERT INTO Medicamentos (Desc_Med, Dosagem, Qtd_Est, Fabricante, Uso_Controlado, Posic_Estq) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [Desc_Med, Dosagem, Qtd_Est, Fabricante, Uso_Controlado, Posic_Estq], function(err) {
  if (err) {
  console.error('Erro ao inserir medicamento:', err.message);
  return res.status(500).json({ success: false, message: 'Erro ao cadastrar medicamento: ' + err.message });
  }
  const novoMedicamento = { ID_Med: this.lastID, Desc_Med, Dosagem, Qtd_Est, Fabricante, Uso_Controlado, Posic_Estq };
  gerarCSV(novoMedicamento);
  res.json({ success: true, message: 'Medicamento cadastrado com sucesso!', id: this.lastID });
  });
 });
 
 function gerarCSV(novoMedicamento) {
  if (!novoMedicamento) {
  console.log('Nenhum dado de medicamento para gerar CSV.');
  return;
  }
 
  const csvFilePath = path.resolve(__dirname, 'medicamentos.csv');
  const header = 'ID_Med,Desc_Med,Dosagem,Qtd_Est,Fabricante,Uso_Controlado,Posic_Estq\n';
  const csvRow = `${novoMedicamento.ID_Med},${novoMedicamento.Desc_Med},${novoMedicamento.Dosagem},${novoMedicamento.Qtd_Est},${novoMedicamento.Fabricante},${novoMedicamento.Uso_Controlado},${novoMedicamento.Posic_Estq}\n`;
 
  try {
  if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, header + csvRow);
  console.log('Arquivo CSV criado com sucesso!');
  } else {
  fs.appendFileSync(csvFilePath, csvRow);
  console.log('Linha adicionada ao arquivo CSV com sucesso!');
  }
  } catch (err) {
  console.error('Erro ao manipular o arquivo CSV:', err);
  }
 }
 
 // Iniciar o servidor
 app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
 });