package br.app.studyflow.studyflow.repository;

import br.app.studyflow.studyflow.model.Usuario;
import org.springframework.data.repository.CrudRepository;

public interface UsuarioRepository extends CrudRepository<Usuario,String> {
        Usuario findById(Long id);
}
