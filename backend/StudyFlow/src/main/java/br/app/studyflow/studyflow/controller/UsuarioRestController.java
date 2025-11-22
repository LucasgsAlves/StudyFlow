package br.app.studyflow.studyflow.controller;

import br.app.studyflow.studyflow.model.Usuario;
import br.app.studyflow.studyflow.services.CookieService;
import br.app.studyflow.studyflow.services.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/usuarios")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UsuarioRestController {

    @Autowired
    private UsuarioService usuarioService;

    //CREATE - POST
    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@Valid @RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioService.cadastrar(usuario);
        // Remove a senha antes de retornar
        novoUsuario.setSenha(null);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    //READ All - GET
    @GetMapping
    public ResponseEntity<List<Usuario>> listar(){
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    //READ by ID - GET
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id){
        Optional<Usuario> usuario = usuarioService.buscarPorId(id);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //UPDATE - PUT
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @Valid @RequestBody Usuario usuarioDetalhes) {
        try {
            Usuario usuarioAtualizado = usuarioService.atualizar(id, usuarioDetalhes);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //DELETE by ID - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> deletar(@PathVariable Long id){
        try{
            usuarioService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuario-logado")
    public ResponseEntity<Usuario> getUsuarioLogado(HttpServletRequest request) throws UnsupportedEncodingException {

        String idUsuario = CookieService.getCookie(request, "idUsuario");

        if (idUsuario == null) {
            return ResponseEntity.status(401).build();
        }

        Usuario usuario = usuarioService.buscarPorId(Long.parseLong(idUsuario))
                .orElse(null);

        return ResponseEntity.ok(usuario);
    }
}
