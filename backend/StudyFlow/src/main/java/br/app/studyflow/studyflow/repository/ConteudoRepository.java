package br.app.studyflow.studyflow.repository;

import br.app.studyflow.studyflow.model.Conteudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConteudoRepository extends JpaRepository<Conteudo, Long> {
    List<Conteudo> findByDisciplinaId(Long disciplinaId);
    List<Conteudo> findByDisciplinaUsuarioId(Long usuarioId);
}
