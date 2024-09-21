// src/Home.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const Home = () => {
  const [alunos, setAlunos] = useState([]);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAluno, setCurrentAluno] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    nota1: "",
    nota2: "",
    nota3: "",
    nota4: "",
  });

  const fetchAlunos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/alunos");
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleShow = (aluno = null) => {
    if (aluno) {
      setIsEditing(true);
      setCurrentAluno(aluno);
      setFormData({
        nome: aluno.nome,
        matricula: aluno.matricula,
        nota1: aluno.nota1,
        nota2: aluno.nota2,
        nota3: aluno.nota3,
        nota4: aluno.nota4,
      });
    } else {
      setIsEditing(false);
      setFormData({
        nome: "",
        matricula: "",
        nota1: "",
        nota2: "",
        nota3: "",
        nota4: "",
      });
    }
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
    setCurrentAluno(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const mediaFinal = (
      (parseFloat(formData.nota1) +
        parseFloat(formData.nota2) +
        parseFloat(formData.nota3) +
        parseFloat(formData.nota4)) /
      4
    ).toFixed(2);

    const resultadoFinal = mediaFinal >= 7 ? "Aprovado" : "Reprovado";

    if (isEditing) {
      // Atualiza o aluno existente
      try {
        await axios.put(`http://localhost:3000/alunos/${currentAluno.id}`, {
          ...formData,
          mediaFinal,
          resultadoFinal,
        });
        fetchAlunos();
        handleClose();
      } catch (error) {
        console.error("Erro ao editar aluno:", error);
      }
    } else {
      // Insere novo aluno
      try {
        await axios.post("http://localhost:3000/alunos", {
          ...formData,
          mediaFinal,
          resultadoFinal,
        });
        fetchAlunos();
        handleClose();
      } catch (error) {
        console.error("Erro ao salvar aluno:", error);
      }
    }
  };

  const handleEditClick = (aluno) => {
    handleShow(aluno);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        await axios.delete(`http://localhost:3000/alunos/${id}`);
        fetchAlunos();
      } catch (error) {
        console.error("Erro ao excluir aluno:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gerenciador de Alunos</h2>
      <Button variant="primary" onClick={() => handleShow()}>
        Cadastrar Aluno
      </Button>
      <Table striped bordered hover variant="dark" className="mt-3">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Nota 1</th>
            <th>Nota 2</th>
            <th>Nota 3</th>
            <th>Nota 4</th>
            <th>Média Final</th>
            <th>Resultado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno, index) => (
            <tr key={index}>
              <td>{aluno.nome}</td>
              <td>{aluno.matricula}</td>
              <td>{aluno.nota1}</td>
              <td>{aluno.nota2}</td>
              <td>{aluno.nota3}</td>
              <td>{aluno.nota4}</td>
              <td>
                {aluno.mediaFinal !== undefined ? aluno.mediaFinal : "N/A"}
              </td>
              <td>{aluno.resultadoFinal}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleEditClick(aluno)}
                >
                  Editar
                </Button>
                <span style={{ marginLeft: "10px" }}></span>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(aluno.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar Aluno" : "Cadastrar Aluno"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Nome do Aluno"
              />
            </Form.Group>
            <Form.Group controlId="formMatricula">
              <Form.Label>Matrícula</Form.Label>
              <Form.Control
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleInputChange}
                placeholder="Matrícula"
              />
            </Form.Group>
            <Form.Group controlId="formNota1">
              <Form.Label>Nota 1</Form.Label>
              <Form.Control
                type="number"
                name="nota1"
                value={formData.nota1}
                onChange={handleInputChange}
                placeholder="Nota 1"
              />
            </Form.Group>
            <Form.Group controlId="formNota2">
              <Form.Label>Nota 2</Form.Label>
              <Form.Control
                type="number"
                name="nota2"
                value={formData.nota2}
                onChange={handleInputChange}
                placeholder="Nota 2"
              />
            </Form.Group>
            <Form.Group controlId="formNota3">
              <Form.Label>Nota 3</Form.Label>
              <Form.Control
                type="number"
                name="nota3"
                value={formData.nota3}
                onChange={handleInputChange}
                placeholder="Nota 3"
              />
            </Form.Group>
            <Form.Group controlId="formNota4">
              <Form.Label>Nota 4</Form.Label>
              <Form.Control
                type="number"
                name="nota4"
                value={formData.nota4}
                onChange={handleInputChange}
                placeholder="Nota 4"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditing ? "Salvar Alterações" : "Salvar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
