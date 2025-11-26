package br.app.studyflow.studyflow.repository;

import br.app.studyflow.studyflow.model.Relatorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelatorioRepository extends JpaRepository<Relatorio, Long> {
    List<Relatorio> findByUsuarioId(Long usuarioId);
    List<Relatorio> findByUsuarioIdAndPeriodo(Long usuarioId, String periodo);
}
