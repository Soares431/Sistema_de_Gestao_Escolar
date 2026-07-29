import { useState, useEffect } from 'react';
import axios from 'axios';

function TurmaForm({ turmaEditando, onSalvo, onCancelar }) {
  const [nome, setNome] = useState('');
  const [codProfessor, setCodProfessor] = useState('');
  const [professores, setPofessores] = useState([]);
  // const [alunos, setAlunos] = useState([]);

  const [erro, setErro] = useState('');

  // Sempre que "turmaEditando" mudar, preenche o formulário com os dados dele
  useEffect(() => {
    if (turmaEditando) {
      setNome(turmaEditando.nome);
      setCodProfessor(turmaEditando.codProfessor)
    } else {
      setNome('');
      setCodProfessor('');
    }
  }, [turmaEditando]);

  useEffect(() => {
    axios.get("http://localhost:8080/professores")
      .then(response => {
        setPofessores(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar professores para o dropdown", error);
      })
  }, [])

  function handleSubmit(event) {
    event.preventDefault();

    const dados = { nome, codProfessor };

    if (turmaEditando) {
      // Modo edição: PUT
      axios.put(`http://localhost:8080/turmas/${turmaEditando.codTurma}`, dados)
        .then(response => {
          onSalvo(response.data);
          setErro('');
        }) 
        .catch(error => {
          console.error('Erro ao atualizar Turma:', error);
          setErro('Não foi possível atualizar o Turma.');
        });

    } else {
      // Modo criação: POST
      axios.post('http://localhost:8080/turmas', dados)
        .then(response => {
          onSalvo(response.data);
          setNome('');
          setCodProfessor('');
        })
        .catch(error => {
          console.error('Erro ao criar turna:', error);
          setErro('Não foi possível cadastrar o turna.');
        });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{turmaEditando ? 'Editar Turma' : 'Cadastrar Turma'}</h2>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <div>
        <label>Nome: </label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>

      <div>
        <label>Profesores responsaveis </label>
        <select value={codProfessor} onChange={(e => setCodProfessor(e.target.value))} required>
          <option value=""> Selecione o codigo do professor: </option>
          {professores.map(prof => (
            <option key={prof.codProfessor} value={prof.codProfessor}>
              {prof.codProfessor} - {prof.nome}
            </option>
          ))}
        </select>
      </div>


      <button type="submit">{turmaEditando ? 'Salvar alterações' : 'Cadastrar'}</button>
      {turmaEditando && (
        <button type="button" onClick={onCancelar} style={{ marginLeft: '8px' }}>
          Cancelar
        </button>
      )}

    </form>

  );
}

export default TurmaForm;