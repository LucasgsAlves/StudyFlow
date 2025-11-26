package br.app.studyflow.studyflow.controller;

import br.app.studyflow.studyflow.model.Conteudo;
import br.app.studyflow.studyflow.model.Disciplina;
import br.app.studyflow.studyflow.services.ConteudoService;
import br.app.studyflow.studyflow.services.DisciplinaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/conteudos")
public class ConteudoController {

    @Autowired
    private ConteudoService conteudoService;

    @Autowired
    private DisciplinaService disciplinaService;

    @PostMapping
    public ResponseEntity<Conteudo> cadastrarConteudo(@Valid @RequestBody Conteudo conteudo, @RequestParam Long disciplinaId) {
        Optional<Disciplina> disciplina = disciplinaService.buscarPorId(disciplinaId);
        if (disciplina.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        conteudo.setDisciplina(disciplina.get());
        Conteudo novoConteudo = conteudoService.salvar(conteudo);
        return new ResponseEntity<>(novoConteudo, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Conteudo>> listarConteudosPorDisciplina(@RequestParam Long disciplinaId) {
        List<Conteudo> conteudos = conteudoService.buscarPorDisciplina(disciplinaId);
        return new ResponseEntity<>(conteudos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conteudo> buscarConteudoPorId(@PathVariable Long id) {
        Optional<Conteudo> conteudo = conteudoService.buscarPorId(id);
        return conteudo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Conteudo> atualizarConteudo(@PathVariable Long id, @Valid @RequestBody Conteudo conteudoAtualizado) {
        Optional<Conteudo> conteudoExistente = conteudoService.buscarPorId(id);
        if (conteudoExistente.isPresent()) {
            Conteudo conteudo = conteudoExistente.get();
            conteudo.setTitulo(conteudoAtualizado.getTitulo());
            conteudo.setPrioridade(conteudoAtualizado.getPrioridade());
            conteudo.setTempoEstimado(conteudoAtualizado.getTempoEstimado());
            conteudo.setHorasDefinidas(conteudoAtualizado.getHorasDefinidas());
            // Não permite alterar a disciplina por este endpoint
            Conteudo conteudoSalvo = conteudoService.salvar(conteudo);
            return new ResponseEntity<>(conteudoSalvo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Conteudo> atualizarHorasEstudadas(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<Conteudo> conteudoExistente = conteudoService.buscarPorId(id);
        if (conteudoExistente.isPresent()) {
            Conteudo conteudo = conteudoExistente.get();
            
            // Atualizar apenas os campos fornecidos
            if (updates.containsKey("horasEstudadas")) {
                Double horasEstudadas = ((Number) updates.get("horasEstudadas")).doubleValue();
                conteudo.setHorasEstudadas(horasEstudadas);
            }
            
            Conteudo conteudoSalvo = conteudoService.salvar(conteudo);
            return new ResponseEntity<>(conteudoSalvo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConteudo(@PathVariable Long id) {
        if (conteudoService.buscarPorId(id).isPresent()) {
            conteudoService.deletar(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
