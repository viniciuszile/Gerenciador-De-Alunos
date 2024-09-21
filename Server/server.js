const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configurações do MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Coloque seu nome de usuário aqui
    password: '', // Coloque sua senha aqui
    database: 'gerenciador_alunos', // Certifique-se de que esse banco de dados existe
});

// Conectar ao MySQL
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

// Rota para buscar alunos
app.get('/alunos', (req, res) => {
    db.query('SELECT * FROM alunos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Rota para inserir aluno
app.post('/alunos', (req, res) => {
    const { nome, matricula, nota1, nota2, nota3, nota4 } = req.body;

    // Verifica se a matrícula já existe
    db.query('SELECT * FROM alunos WHERE matricula = ?', [matricula], (err, results) => {
        if (err) {
            console.error('Erro ao verificar matrícula:', err);
            return res.status(500).json({ error: 'Erro ao verificar matrícula' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Matrícula já cadastrada' });
        }

        // Cálculo da média final
        const mediaFinal = (parseFloat(nota1) + parseFloat(nota2) + parseFloat(nota3) + parseFloat(nota4)) / 4;
        const resultadoFinal = mediaFinal >= 7 ? 'Aprovado' : 'Reprovado';

        const query = 'INSERT INTO alunos (nome, matricula, nota1, nota2, nota3, nota4, mediaFinal, resultadoFinal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [nome, matricula, nota1, nota2, nota3, nota4, mediaFinal, resultadoFinal], (err, results) => {
            if (err) {
                console.error('Erro ao inserir aluno:', err);
                return res.status(500).json({ error: 'Erro ao salvar aluno' });
            }
            res.status(201).json({ message: 'Aluno salvo com sucesso', id: results.insertId });
        });
    });
});

// Rota para atualizar aluno
app.put('/alunos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, matricula, nota1, nota2, nota3, nota4 } = req.body;

    // Cálculo da média final
    const mediaFinal = (parseFloat(nota1) + parseFloat(nota2) + parseFloat(nota3) + parseFloat(nota4)) / 4;
    const resultadoFinal = mediaFinal >= 7 ? 'Aprovado' : 'Reprovado';

    const query = 'UPDATE alunos SET nome = ?, matricula = ?, nota1 = ?, nota2 = ?, nota3 = ?, nota4 = ?, mediaFinal = ?, resultadoFinal = ? WHERE id = ?';
    db.query(query, [nome, matricula, nota1, nota2, nota3, nota4, mediaFinal, resultadoFinal, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar aluno:', err);
            return res.status(500).json({ error: 'Erro ao atualizar aluno' });
        }
        res.json({ message: 'Aluno atualizado com sucesso' });
    });
});

// Rota para excluir aluno
app.delete('/alunos/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM alunos WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao excluir aluno:', err);
            return res.status(500).json({ error: 'Erro ao excluir aluno' });
        }
        res.json({ message: 'Aluno excluído com sucesso' });
    });
});



// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
