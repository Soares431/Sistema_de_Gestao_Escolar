package br.com.mildevs.sistema_escolar_api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name="turma")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_turma")
    private Integer codTurma;

    @Column(nullable = false)
    private String nome;

    @ManyToOne(fetch =FetchType.LAZY)
    @JoinColumn(name = "cod_professor_fk",referencedColumnName = "cod_professor")
//    @JsonIgnoreProperties("turmas") - ignore
    private Professor professor;

    @ManyToMany(mappedBy = "turmas", fetch = FetchType.LAZY)
    private List<Aluno> alunos;

    

    public Integer getCodTurma() {
        return codTurma;
    }

    public void setCodTurma(Integer codTurma) {
        this.codTurma = codTurma;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<Aluno> alunos) {
        this.alunos = alunos;
    }


}
