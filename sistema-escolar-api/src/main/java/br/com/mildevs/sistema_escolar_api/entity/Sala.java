package br.com.mildevs.sistema_escolar_api.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "sala")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nro_sala")
    private Integer nroSala;

    @Column(nullable = false)
    private double largura;

    @Column(nullable = false)
    private double comprimento;

    @Column(nullable = false)
    private double altura;

    @OneToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name="cod_turma_fk", referencedColumnName = "cod_turma")
    private Turma turma;


    public Integer getNroSala() {
        return nroSala;
    }

    public void setNroSala(Integer nroSala) {
        this.nroSala = nroSala;
    }

    public double getLargura() {
        return largura;
    }

    public void setLargura(double largura) {
        this.largura = largura;
    }

    public double getComprimento() {
        return comprimento;
    }

    public void setComprimento(double comprimento) {
        this.comprimento = comprimento;
    }

    public double getAltura() {
        return altura;
    }

    public void setAltura(double altura) {
        this.altura = altura;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }
}
