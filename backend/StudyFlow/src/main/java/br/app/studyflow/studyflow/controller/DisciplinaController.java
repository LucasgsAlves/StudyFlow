package br.app.studyflow.studyflow.controller;

import br.app.studyflow.studyflow.model.Disciplina;
import br.app.studyflow.studyflow.model.Usuario;
import br.app.studyflow.studyflow.services.DisciplinaService;
import br.app.studyflow.studyflow.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/disciplinas")
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @Autowired
    private UsuarioService usuarioService; // Para buscar o usuário logado

    // Simulação de obtenção do ID do usuário logado (deve ser ajustado com a lógica de autenticação real)
    private Long getUsuarioLogadoId() {
        // **ATENÇÃO**: Em um sistema real, o ID do usuário viria do token JWT ou da sessão.
        // Para fins de desenvolvimento e teste, vamos assumir um ID fixo ou buscar o primeiro usuário.
        // O frontend deve enviar o ID do usuário ou o backend deve extrair do contexto de segurança.
        // Por enquanto, vamos retornar um ID de teste (ex: 1L) ou buscar o primeiro usuário.
        // Se a lógica de login já está funcionando, o frontend deve enviar o ID.
        // Para evitar quebrar o que já existe, vou deixar a responsabilidade de passar o ID para o frontend.
        // Se o frontend não passar, o endpoint deve ser ajustado para receber o ID do usuário.
        return 1L; // ID de teste
    }

    @PostMapping
    public ResponseEntity<Disciplina> cadastrarDisciplina(@Valid @RequestBody Disciplina disciplina, @RequestParam Long usuarioId) {
        Optional<Usuario> usuario = usuarioService.buscarPorId(usuarioId);
        if (usuario.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        disciplina.setUsuario(usuario.get());
        Disciplina novaDisciplina = disciplinaService.salvar(disciplina);
        return new ResponseEntity<>(novaDisciplina, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Disciplina>> listarDisciplinas(@RequestParam Long usuarioId) {
        List<Disciplina> disciplinas = disciplinaService.buscarPorUsuario(usuarioId);
        return new ResponseEntity<>(disciplinas, HttpStatus.OK);
    }

    @GetMapping("/com-conteudos")
    public ResponseEntity<List<Disciplina>> listarDisciplinasComConteudos(@RequestParam Long usuarioId) {
        List<Disciplina> disciplinas = disciplinaService.buscarPorUsuario(usuarioId);
        // O JPA deve carregar os conteúdos automaticamente devido ao @OneToMany em Disciplina
        // Se não carregar, pode ser necessário um método de busca customizado no repository
        return new ResponseEntity<>(disciplinas, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disciplina> buscarDisciplinaPorId(@PathVariable Long id) {
        Optional<Disciplina> disciplina = disciplinaService.buscarPorId(id);
        return disciplina.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Disciplina> atualizarDisciplina(@PathVariable Long id, @Valid @RequestBody Disciplina disciplinaAtualizada) {
        Optional<Disciplina> disciplinaExistente = disciplinaService.buscarPorId(id);
        if (disciplinaExistente.isPresent()) {
            Disciplina disciplina = disciplinaExistente.get();
            disciplina.setNome(disciplinaAtualizada.getNome());
            disciplina.setDescricao(disciplinaAtualizada.getDescricao());
            // Não permite alterar o usuário dono da disciplina por este endpoint
            Disciplina disciplinaSalva = disciplinaService.salvar(disciplina);
            return new ResponseEntity<>(disciplinaSalva, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDisciplina(@PathVariable Long id) {
        if (disciplinaService.buscarPorId(id).isPresent()) {
            disciplinaService.deletar(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
