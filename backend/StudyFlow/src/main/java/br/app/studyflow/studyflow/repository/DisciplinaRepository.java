package br.app.studyflow.studyflow.repository;

import br.app.studyflow.studyflow.model.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {
    List<Disciplina> findByUsuarioId(Long usuarioId);
}
