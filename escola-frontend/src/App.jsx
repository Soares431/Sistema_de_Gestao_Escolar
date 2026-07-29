import { useEffect, useState } from 'react';
import axios from 'axios';
import AlunoForm from './components/AlunoForm';
import { Link, Route, Routes } from 'react-router-dom';
import AlunosPages from './pages/AlunosPage';
import ProfessoresPages from './pages/ProfessoresPage';
import TurmasPages from './pages/TurmasPage';
import SalasPages from './pages/SalasPage';


function App() {

  return (
    <div>
      <Link to="/alunos">Alunos</Link> <br />
      <Link to="/professores">Professores</Link> <br />
      <Link to="/turmas">Turmas</Link> <br />
      <Link to="/salas">Salas</Link> <br />


      <Routes>
        <Route path='/alunos' element={<AlunosPages />}></Route>
        <Route path='/professores' element={<ProfessoresPages />}></Route>
        <Route path='/turmas' element={<TurmasPages />}></Route>
        <Route path='/salas' element={<SalasPages />}></Route>
      </Routes>


    </div>
  );
}

export default App; 