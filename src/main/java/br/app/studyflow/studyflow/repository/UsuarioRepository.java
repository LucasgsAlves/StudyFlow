package br.app.studyflow.studyflow.repository;

import br.app.studyflow.studyflow.model.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface UsuarioRepository extends CrudRepository<Usuario,String> {
        Usuario findById(Long id);

        @Query(value = "select * from studyflow.usuario where email = :email and senha = :senha", nativeQuery = true)
        public Usuario login(String email, String senha);
}
