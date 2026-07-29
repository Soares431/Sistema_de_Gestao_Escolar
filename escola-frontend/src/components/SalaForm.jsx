import { useState, useEffect } from 'react';
import axios from 'axios';

export function obterTurmasSemSala(salas, totalTurmas) {
    if (!salas || !totalTurmas) return [];

    const idsTurmasComSala = salas
        .filter(sala => sala.turma !== null)
        .map(sala => sala.turma.codTurma);

    return (
        totalTurmas.filter(
            turma => !idsTurmasComSala.includes(turma.codTurma)
        ));
}

function SalaForm({ salaEditando, turmasDisponivel = [], onSalvo, onCancelar }) {
    const [largura, setLargura] = useState('');
    const [comprimento, setComprimento] = useState('');
    const [altura, setAltura] = useState('');
    const [codTurma, setCodTurma] = useState('');
    const [erro, setErro] = useState('');

    // Sempre que "salaEditando" mudar, preenche o formulário com os dados dele
    useEffect(() => {
        if (salaEditando) {
            setLargura(salaEditando.largura || "");
            setComprimento(salaEditando.comprimento) || "";
            setAltura(salaEditando.altura || "");


            if (salaEditando.turma) {
                setCodTurma(salaEditando.turma.codTurma);
            } else {
                setCodTurma(salaEditando.codTurma || "");
            }

        } else {
            setLargura('');
            setComprimento('');
            setAltura('');
            setCodTurma('');
        }
    }, [salaEditando]);

    let turmaParaExibir = [...turmasDisponivel];
    if (salaEditando && salaEditando.turma) {
        const jaNaLista = turmaParaExibir.some(t => t.codTurma === salaEditando.turma.codTurma);
        if (!jaNaLista) {
            turmaParaExibir.push(salaEditando.turma);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const dados = { largura, comprimento, altura, codTurma };

        if (salaEditando) {
            // Modo edição: PUT
            axios.put(`http://localhost:8080/salas/${salaEditando.nroSala}`, dados)
                .then(response => {
                    onSalvo(response.data);
                    setErro('');
                })
                .catch(error => {
                    console.error('Erro ao atualizar Sala:', error);
                    setErro('Não foi possível atualizar a sala.');
                });
        } else {
            // Modo criação: POST
            axios.post('http://localhost:8080/salas', dados)
                .then(response => {
                    onSalvo(response.data);
                    setLargura('');
                    setComprimento('');
                    setAltura('');
                    setCodTurma('');
                    setErro('')
                })
                .catch(error => {
                    console.error('Erro ao criar Sala:', error);
                    setErro('Não foi possível cadastrar a sala.');
                });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{salaEditando ? 'Editar Aluno' : 'Cadastrar Aluno'}</h2>

            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            <div>
                <label>Largura: </label>
                <input type="number" value={largura} onChange={(e) => setLargura(e.target.value)} required />
            </div>

            <div>
                <label>Comprimento: </label>
                <input type="number" value={comprimento} onChange={(e) => setComprimento(e.target.value)} required />
            </div>

            <div>
                <label>Altura: </label>
                <input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} required />
            </div>


            <div>
                <label>Turmas que podem ficar nessa sala: </label>  <br />
                <select value={codTurma} onChange={(e => setCodTurma(e.target.value))} required>
                    <option value=""> Turma: </option>

                    {turmaParaExibir
                        .map(turma => (
                            <option key={turma.codTurma} value={turma.codTurma}>
                                {turma.nome}
                            </option>
                        ))}
                </select>
            </div>


            <button type="submit">{salaEditando ? 'Salvar alterações' : 'Cadastrar'}</button>
            {salaEditando && (
                <button type="button" onClick={onCancelar} style={{ marginLeft: '8px' }}>
                    Cancelar
                </button>
            )}

        </form>
    );
}

export default SalaForm;