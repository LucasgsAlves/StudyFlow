package br.app.studyflow.studyflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
public class Conteudo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título do conteúdo é obrigatório")
    private String titulo;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "A prioridade é obrigatória")
    private Prioridade prioridade;

    @NotNull(message = "O tempo estimado é obrigatório")
    private Integer tempoEstimado; // Tempo em minutos (em minutos)

    // Horas definidas/planejadas para este conteúdo
    private Double horasDefinidas;

    // Horas estudadas pelo aluno neste conteúdo
    private Double horasEstudadas;

    @ManyToOne
    @JoinColumn(name = "idDisciplina", nullable = false)
    private Disciplina disciplina;

    @JsonIgnore
    @OneToMany(mappedBy = "conteudo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Estudo> estudos;



    // Construtor JPA VAZIO
    public Conteudo() {}

    public Conteudo(Long id, String titulo, Prioridade prioridade, Integer tempoEstimado, Disciplina disciplina) {
        this.id = id;
        this.titulo = titulo;
        this.prioridade = prioridade;
        this.tempoEstimado = tempoEstimado;
        this.disciplina = disciplina;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Prioridade getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(Prioridade prioridade) {
        this.prioridade = prioridade;
    }

    public Integer getTempoEstimado() {
        return tempoEstimado;
    }

    public void setTempoEstimado(Integer tempoEstimado) {
        this.tempoEstimado = tempoEstimado;
    }

    public Disciplina getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(Disciplina disciplina) {
        this.disciplina = disciplina;
    }

    public List<Estudo> getEstudos() {
        return estudos;
    }

    public void setEstudos(List<Estudo> estudos) {
        this.estudos = estudos;
    }

    public Double getHorasEstudadas() {
        return horasEstudadas;
    }

    public void setHorasEstudadas(Double horasEstudadas) {
        this.horasEstudadas = horasEstudadas;
    }

    public Double getHorasDefinidas() {
        return horasDefinidas;
    }

    public void setHorasDefinidas(Double horasDefinidas) {
        this.horasDefinidas = horasDefinidas;
    }

    @Transient
    public boolean isConcluido() {
        if (estudos == null || estudos.isEmpty()) return false;
        return estudos.stream().anyMatch(Estudo::getConcluido);
    }

    @Transient
    public int getTotalMinutosEstudados() {
        if (estudos == null) return 0;
        return estudos.stream().mapToInt(Estudo::getMinutosEstudados).sum();
    }
}
