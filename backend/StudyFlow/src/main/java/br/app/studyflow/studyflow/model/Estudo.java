package br.app.studyflow.studyflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
public class Estudo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "A data é obrigatória")
    private LocalDate data;

    @NotNull(message = "O número de minutos estudados é obrigatório")
    private Integer minutosEstudados; // Tempo em minutos

    // **NOVO CAMPO ADICIONADO PARA RESOLVER O ERRO DO SQL**
    @Column(name = "horas_estudadas")
    private Double horasEstudadas = 0.0; // Valor padrão para evitar o erro NOT NULL

    private Boolean concluido = false; // Indica se o conteúdo foi concluído

    @ManyToOne
    @JoinColumn(name = "id_conteudo", nullable = false) // Corrigi o 'idConteudo' para 'id_conteudo'
    private Conteudo conteudo;

    // Construtor JPA VAZIO
    public Estudo() {}

    // Construtor completo atualizado
    public Estudo(Long id, LocalDate data, Integer minutosEstudados, Double horasEstudadas, Boolean concluido, Conteudo conteudo) {
        this.id = id;
        this.data = data;
        this.minutosEstudados = minutosEstudados;
        this.horasEstudadas = horasEstudadas;
        this.concluido = concluido;
        this.conteudo = conteudo;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Integer getMinutosEstudados() {
        return minutosEstudados;
    }

    public void setMinutosEstudados(Integer minutosEstudados) {
        this.minutosEstudados = minutosEstudados;

        // **OPCIONAL:** Se você quiser que o valor seja calculado automaticamente
        // this.horasEstudadas = minutosEstudados / 60.0;
    }

    // Novo Getter e Setter
    public Double getHorasEstudadas() {
        return horasEstudadas;
    }

    public void setHorasEstudadas(Double horasEstudadas) {
        this.horasEstudadas = horasEstudadas;
    }

    public Boolean getConcluido() {
        return concluido;
    }

    public void setConcluido(Boolean concluido) {
        this.concluido = concluido;
    }

    public Conteudo getConteudo() {
        return conteudo;
    }

    public void setConteudo(Conteudo conteudo) {
        this.conteudo = conteudo;
    }
}