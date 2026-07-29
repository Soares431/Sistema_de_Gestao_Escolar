import { useEffect, useState } from "react";
import axios from "axios";
import SalaForm, { obterTurmasSemSala } from "../components/SalaForm";

function SalasPage() {
    const [salas, setSala] = useState([]);
    const [totalTurmas, setTotalTurmas] = useState([]);
    const [salaEditando, setSalaEditando] = useState(null);

    const turmasSemSala = obterTurmasSemSala(salas, totalTurmas);

    function carregarSalas() {
        axios.get('http://localhost:8080/salas')
            .then(response => setSala(response.data))
            .catch(error => console.error('Erro ao buscar Salass:', error));
    }
    function CarregarTurmas() {
        axios.get('http://localhost:8080/turmas')
            .then(response => setTotalTurmas(response.data))
            .catch(error => console.error('Erro ao buscar turmas:', error));
    }

    useEffect(() => {
        carregarSalas();
        CarregarTurmas();
    }, []);

    function obterTurmasSemSalas() {
        return (
            SalaForm.obterTurmasSemSalas(salas, totalTurmas)
        );
    }

    function handleSalvo(salasAlvo) {
        if (salaEditando) {
            // Atualiza o salas editado na lista, sem precisar buscar tudo de novo
            setSala(salas.map(a => a.nroSala === salasAlvo.nroSala ? salasAlvo : a));
            setSalaEditando(null);
        } else {
            setSala([...salas, salasAlvo]);
        }
    }

    function handleDeletar(nroSala) {
        if (!window.confirm('Tem certeza que deseja excluir essa Sala?')) {
            return;
        }
        axios.delete(`http://localhost:8080/salas/${nroSala}`)
            .then(() => {
                setSala(salas.filter(a => a.nroSala !== nroSala));
            })
            .catch(error => {
                console.error('Erro ao deletar a Sala:', error);
                alert('Não foi possível excluir o sala.');
            });
    }

    return (
        <div>
            <h1>salas cadastrados</h1>
            <ul style={{ textAlign: 'left', listStylePosition: 'inside' }}>
                {salas.map(sala => (
                    <li key={sala.nroSala}>
                        Numero da Sala: {sala.nroSala} - Turma: {sala.turma.nome} | DETALHES: {sala.altura}m² x {sala.largura}m² x {sala.comprimento}m²
                        <button onClick={() => setSalaEditando(sala)} style={{ marginLeft: '8px' }}>
                            Editar
                        </button>
                        <button onClick={() => handleDeletar(sala.nroSala)} style={{ marginLeft: '4px' }}>
                            Excluir
                        </button>
                    </li>
                ))}
            </ul>

            {turmasSemSala.length > 0 || salaEditando ? (
                <h4 style={{ textAlign: "left" }}>
                    Turmas no Sistema
                </h4>,
                <ul style={{ textAlign: 'left', listStylePosition: 'inside' }}>
                    <ul style={{ textAlign: 'left', listStylePosition: 'inside' }}>
                        {turmasSemSala.map(turma => (
                            <li key={turma.codTurma}>
                                <label>ID: {turma.codTurma} | {turma.nome}</label>
                            </li>
                        ))}
                    </ul>
                </ul>,
                <SalaForm
                    salaEditando={salaEditando}
                    turmasSemSala={turmasSemSala}
                    onSalvo={handleSalvo}
                    onCancelar={() => setSalaEditando(null)}
                />
            ) : (
                <label>Sem turmas disponivel!</label>
            )}


        </div >
    );


};

export default SalasPage;