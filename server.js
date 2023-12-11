const express = require('express');
const path = require('path');
const mysql = require('mysql2'); 
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Adicione esta linha

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'acesso123',
  database: 'amigo_oculto',
});

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a página de novo evento
app.get('/new', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'new.html'));
});

// Rota para cadastrar um usuário
app.post('/cadastrar', (req, res) => {
    const { nome, email } = req.body;
  
    // Verificar se o e-mail segue um formato básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de e-mail inválido na vida real.' });
    }
  
    // Verificar se o e-mail já existe no banco de dados
    connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
      if (error) {
        console.error('Erro ao verificar duplicatas:', error);
        return res.status(500).json({ error: 'Erro ao verificar duplicatas.' });
      }
  
      // Se o e-mail já existir, informe o usuário
      if (results.length > 0) {
        return res.status(400).json({ error: 'E-mail já cadastrado. Insira um e-mail válido na vida real.' });
      }
  
      // Inserir dados no banco de dados
      connection.query('INSERT INTO users (nome, email) VALUES (?, ?)', [nome, email], (error, results) => {
        if (error) {
          console.error('Erro ao cadastrar usuário:', error);
          return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
        }
  
        res.json({ message: 'Usuário cadastrado com sucesso!' });
      });
    });
  });

  app.post('/verificar-email', (req, res) => {
    const { email } = req.body;

    // Verifique se o e-mail existe no banco de dados
    connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Erro ao verificar e-mail:', error);
            return res.status(500).json({ error: 'Erro ao verificar e-mail.' });
        }

        if (results.length > 0) {
            // E-mail encontrado no banco de dados
            res.json({ cadastrado: true, nome: results[0].nome });
        } else {
            // E-mail não encontrado no banco de dados
            res.status(404).json({ cadastrado: false, nome: null });
        }
    });
});



  
// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
