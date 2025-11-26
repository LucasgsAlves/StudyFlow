package br.app.studyflow.studyflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
public class Relatorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O período é obrigatório")
    private String periodo; // Ex: "Semanal", "Mensal", "Anual"

    private String resumo; // Resumo do relatório

    private Integer totalHorasEstudadas = 0; // Total de horas estudadas no período

    private Integer totalConteudosConcluidos = 0; // Total de conteúdos concluídos

    private Double percentualConclusao = 0.0; // Percentual de conclusão

    private LocalDate dataInicio;

    private LocalDate dataFim;

    @ManyToOne
    @JoinColumn(name = "idUsuario", nullable = false)
    private Usuario usuario;

    // Construtor JPA VAZIO
    public Relatorio() {}

    public Relatorio(Long id, String periodo, String resumo, Integer totalHorasEstudadas,
                     Integer totalConteudosConcluidos, Double percentualConclusao,
                     LocalDate dataInicio, LocalDate dataFim, Usuario usuario) {
        this.id = id;
        this.periodo = periodo;
        this.resumo = resumo;
        this.totalHorasEstudadas = totalHorasEstudadas;
        this.totalConteudosConcluidos = totalConteudosConcluidos;
        this.percentualConclusao = percentualConclusao;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.usuario = usuario;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public String getResumo() {
        return resumo;
    }

    public void setResumo(String resumo) {
        this.resumo = resumo;
    }

    public Integer getTotalHorasEstudadas() {
        return totalHorasEstudadas;
    }

    public void setTotalHorasEstudadas(Integer totalHorasEstudadas) {
        this.totalHorasEstudadas = totalHorasEstudadas;
    }

    public Integer getTotalConteudosConcluidos() {
        return totalConteudosConcluidos;
    }

    public void setTotalConteudosConcluidos(Integer totalConteudosConcluidos) {
        this.totalConteudosConcluidos = totalConteudosConcluidos;
    }

    public Double getPercentualConclusao() {
        return percentualConclusao;
    }

    public void setPercentualConclusao(Double percentualConclusao) {
        this.percentualConclusao = percentualConclusao;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
