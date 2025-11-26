package br.app.studyflow.studyflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da disciplina é obrigatório")
    private String nome;

    private String descricao;

    // Meta de horas de estudo para esta disciplina
    private Integer metaHoras;

    @ManyToOne
    @JoinColumn(name = "idUsuario", nullable = false)
    private Usuario usuario;

    @JsonIgnore
    @OneToMany(mappedBy = "disciplina", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Conteudo> conteudos;

    // Construtor JPA VAZIO
    public Disciplina() {}

    public Disciplina(Long id, String nome, String descricao, Usuario usuario) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.usuario = usuario;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<Conteudo> getConteudos() {
        return conteudos;
    }

    public void setConteudos(List<Conteudo> conteudos) {
        this.conteudos = conteudos;
    }

    public Integer getMetaHoras() {
        return metaHoras;
    }

    public void setMetaHoras(Integer metaHoras) {
        this.metaHoras = metaHoras;
    }

    @Transient
    public long getConteudosConcluidos() {
        if (conteudos == null) return 0;
        return conteudos.stream()
                .filter(Conteudo::isConcluido)
                .count();
    }
}
