# Sistema Escolar

Sistema de gestão escolar full stack, migrado de uma aplicação de console em Java (DAO + JDBC/Hibernate puro) para uma arquitetura moderna com **API REST em Spring Boot** e **front-end em React**.

## Sobre o projeto

O projeto original (`Sistema-Escolar`) era um app de console simples, sem API e sem front-end, usado apenas para CRUD local de alunos, professores, turmas e salas. Esta versão reescreve o back-end como uma API REST profissional e adiciona uma interface web para uso real por uma secretaria escolar.

## Tecnologias

**Back-end**
- Java 17
- Spring Boot 3.5.16
- Spring Data JPA / Hibernate
- PostgreSQL
- Flyway (controle de versão do schema do banco)
- Maven

**Front-end**
- React (Vite)
- React Router DOM (navegação entre páginas)
- Axios (requisições HTTP)

## Arquitetura

- API REST organizada em `Controller → Repository → Entity`, com camada de **DTOs** (Request/Response) para nunca expor as entidades JPA diretamente — evita loops de serialização e vazamento de dados internos do Hibernate.
- Schema do banco controlado via **migrations versionadas do Flyway** (`ddl-auto=validate`), sem alterações automáticas em produção.
- **CORS** configurado para permitir o front-end (`localhost:5173`) consumir a API (`localhost:8080`).

## Entidades e relacionamentos

| Entidade | Campos principais | Relacionamento |
|---|---|---|
| **Aluno** | matrícula, nome, série, data de nascimento | `@ManyToMany` com Turma |
| **Professor** | código, nome, telefone, nível de graduação, salário, disciplina | `@ManyToOne` a partir de Turma |
| **Turma** | código, nome | `@ManyToOne` com Professor, `@ManyToMany` com Aluno, `@OneToOne` inverso com Sala |
| **Sala** | número, largura, comprimento, altura | `@OneToOne` com Turma (dono da relação) |

## Estrutura de pastas

```
sistema-escolar-api/          # Back-end (Spring Boot)
  src/main/java/br/com/mildevs/sistema_escolar_api/
    entity/                   # Entidades JPA
    repository/                # Interfaces JpaRepository
    controller/                 # Controllers REST
    dto/                       # DTOs de request/response
  src/main/resources/
    db/migration/               # Migrations Flyway (V1__init.sql, ...)
    application.properties

escola-frontend/              # Front-end (React + Vite)
  src/
    pages/                    # Uma página por entidade (AlunosPage, ProfessoresPage, ...)
    components/                 # Formulários e componentes reutilizáveis
    App.jsx                    # Rotas e navegação
    main.jsx                   # Ponto de entrada
```

## Principais endpoints

```
GET    /alunos
GET    /alunos/{matricula}
POST   /alunos
PUT    /alunos/{matricula}
DELETE /alunos/{matricula}
PUT    /alunos/{matricula}/turmas/{codTurma}     # vincula aluno a uma turma
DELETE /alunos/{matricula}/turmas/{codTurma}     # remove aluno de uma turma

GET    /professores | POST | PUT /{cod} | DELETE /{cod}

GET    /turmas | POST | PUT /{cod} | DELETE /{cod}
PUT    /turmas/{cod}/professor/{codProfessor}
DELETE /turmas/{cod}/professor

GET    /salas | POST | PUT /{nro} | DELETE /{nro}
PUT    /salas/{nro}/turma/{codTurma}
DELETE /salas/{nro}/turma
```

## Como rodar o projeto

### Back-end

1. Cria um banco PostgreSQL (ex: `escola_db`)
2. Configura `src/main/resources/application.properties` com usuário/senha do seu banco
3. Roda a aplicação (`SistemaEscolarApiApplication`) — o Flyway aplica as migrations automaticamente

### Front-end

```bash
cd escola-frontend
npm install
npm run dev
```

Acessa `http://localhost:5173`. É necessário que o back-end esteja rodando em `localhost:8080` ao mesmo tempo.

## Próximos passos

- [ ] Regra de capacidade de sala (limite de alunos por turma calculado a partir da metragem da sala)
- [ ] Estilização do front-end
- [ ] Autenticação com Spring Security + JWT (login de professores/coordenação)
