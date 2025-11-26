package br.app.studyflow.studyflow.controller;

import br.app.studyflow.studyflow.model.Estudo;
import br.app.studyflow.studyflow.model.Conteudo;
import br.app.studyflow.studyflow.services.EstudoService;
import br.app.studyflow.studyflow.services.ConteudoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/estudos")
public class EstudoController {

    @Autowired
    private EstudoService estudoService;

    @Autowired
    private ConteudoService conteudoService;

    @PostMapping
    public ResponseEntity<Estudo> registrarEstudo(@Valid @RequestBody Estudo estudo, @RequestParam Long conteudoId) {
        Optional<Conteudo> conteudo = conteudoService.buscarPorId(conteudoId);
        if (conteudo.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        estudo.setConteudo(conteudo.get());
        Estudo novoEstudo = estudoService.salvar(estudo);
        return new ResponseEntity<>(novoEstudo, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Estudo>> listarEstudosPorConteudo(@RequestParam Long conteudoId) {
        List<Estudo> estudos = estudoService.buscarPorConteudo(conteudoId);
        return new ResponseEntity<>(estudos, HttpStatus.OK);
    }

    @GetMapping("/data")
    public ResponseEntity<List<Estudo>> listarEstudosPorData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        List<Estudo> estudos = estudoService.buscarPorData(data);
        return new ResponseEntity<>(estudos, HttpStatus.OK);
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<Estudo>> listarEstudosPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        List<Estudo> estudos = estudoService.buscarPorPeriodo(dataInicio, dataFim);
        return new ResponseEntity<>(estudos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estudo> buscarEstudoPorId(@PathVariable Long id) {
        Optional<Estudo> estudo = estudoService.buscarPorId(id);
        return estudo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estudo> atualizarEstudo(@PathVariable Long id, @Valid @RequestBody Estudo estudoAtualizado) {
        Optional<Estudo> estudoExistente = estudoService.buscarPorId(id);
        if (estudoExistente.isPresent()) {
            Estudo estudo = estudoExistente.get();
            estudo.setData(estudoAtualizado.getData());
            estudo.setMinutosEstudados(estudoAtualizado.getMinutosEstudados());
            estudo.setConcluido(estudoAtualizado.getConcluido());
            // Não permite alterar o conteúdo por este endpoint
            Estudo estudoSalvo = estudoService.salvar(estudo);
            return new ResponseEntity<>(estudoSalvo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEstudo(@PathVariable Long id) {
        if (estudoService.buscarPorId(id).isPresent()) {
            estudoService.deletar(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
