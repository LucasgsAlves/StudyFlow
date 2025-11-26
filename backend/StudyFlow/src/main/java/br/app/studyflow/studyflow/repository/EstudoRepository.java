package br.app.studyflow.studyflow.repository;

import br.app.studyflow.studyflow.model.Estudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EstudoRepository extends JpaRepository<Estudo, Long> {
    List<Estudo> findByConteudoId(Long conteudoId);
    List<Estudo> findByData(LocalDate data);
    List<Estudo> findByDataBetween(LocalDate dataInicio, LocalDate dataFim);
}
