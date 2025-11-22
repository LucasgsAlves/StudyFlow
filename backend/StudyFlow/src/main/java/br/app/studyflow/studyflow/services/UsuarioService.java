package br.app.studyflow.studyflow.services;

import br.app.studyflow.studyflow.model.Usuario;
import br.app.studyflow.studyflow.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE
    public Usuario cadastrar(Usuario usuario){

        // Encripta a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        return usuarioRepository.save(usuario);
    }

    // READ All
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // READ by ID
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    // UPDATE
    public Usuario atualizar(Long id, Usuario usuarioDetalhes) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID: " + id));

        usuarioExistente.setNomeCompleto(usuarioDetalhes.getNomeCompleto());
        usuarioExistente.setEmail(usuarioDetalhes.getEmail());
        usuarioExistente.setEndereco(usuarioDetalhes.getEndereco());
        usuarioExistente.setTelefone(usuarioDetalhes.getTelefone());
        usuarioExistente.setEscolaridade(usuarioDetalhes.getEscolaridade());

        // Atualiza senha apenas se foi enviada
        if (usuarioDetalhes.getSenha() != null && !usuarioDetalhes.getSenha().isEmpty()) {
            usuarioExistente.setSenha(passwordEncoder.encode(usuarioDetalhes.getSenha()));
        }

        return usuarioRepository.save(usuarioExistente);
    }

    // DELETE
    public void deletar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com o ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // LOGIN
    public Usuario login(String email, String senha){
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElse(null);

        if(usuario == null)
            return null;

        if (!passwordEncoder.matches(senha, usuario.getSenha()))
            return null;

        return usuario;
    }

}

