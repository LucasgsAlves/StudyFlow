package br.app.studyflow.studyflow.controller;

import br.app.studyflow.studyflow.model.Relatorio;
import br.app.studyflow.studyflow.model.Usuario;
import br.app.studyflow.studyflow.services.RelatorioService;
import br.app.studyflow.studyflow.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<Relatorio> criarRelatorio(@Valid @RequestBody Relatorio relatorio, @RequestParam Long usuarioId) {
        Optional<Usuario> usuario = usuarioService.buscarPorId(usuarioId);
        if (usuario.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        relatorio.setUsuario(usuario.get());
        Relatorio novoRelatorio = relatorioService.salvar(relatorio);
        return new ResponseEntity<>(novoRelatorio, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Relatorio>> listarRelatoriosPorUsuario(@RequestParam Long usuarioId) {
        List<Relatorio> relatorios = relatorioService.buscarPorUsuario(usuarioId);
        return new ResponseEntity<>(relatorios, HttpStatus.OK);
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<Relatorio>> listarRelatoriosPorPeriodo(
            @RequestParam Long usuarioId,
            @RequestParam String periodo) {
        List<Relatorio> relatorios = relatorioService.buscarPorUsuarioEPeriodo(usuarioId, periodo);
        return new ResponseEntity<>(relatorios, HttpStatus.OK);
    }

    @GetMapping("/progresso")
    public ResponseEntity<Double> calcularProgresso(@RequestParam Long usuarioId) {
        Double progresso = relatorioService.calcularProgresso(usuarioId);
        return new ResponseEntity<>(progresso, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Relatorio> buscarRelatorioPorId(@PathVariable Long id) {
        Optional<Relatorio> relatorio = relatorioService.buscarPorId(id);
        return relatorio.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Relatorio> atualizarRelatorio(@PathVariable Long id, @Valid @RequestBody Relatorio relatorioAtualizado) {
        Optional<Relatorio> relatorioExistente = relatorioService.buscarPorId(id);
        if (relatorioExistente.isPresent()) {
            Relatorio relatorio = relatorioExistente.get();
            relatorio.setPeriodo(relatorioAtualizado.getPeriodo());
            relatorio.setResumo(relatorioAtualizado.getResumo());
            relatorio.setTotalHorasEstudadas(relatorioAtualizado.getTotalHorasEstudadas());
            relatorio.setTotalConteudosConcluidos(relatorioAtualizado.getTotalConteudosConcluidos());
            relatorio.setPercentualConclusao(relatorioAtualizado.getPercentualConclusao());
            relatorio.setDataInicio(relatorioAtualizado.getDataInicio());
            relatorio.setDataFim(relatorioAtualizado.getDataFim());
            // Não permite alterar o usuário por este endpoint
            Relatorio relatorioSalvo = relatorioService.salvar(relatorio);
            return new ResponseEntity<>(relatorioSalvo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarRelatorio(@PathVariable Long id) {
        if (relatorioService.buscarPorId(id).isPresent()) {
            relatorioService.deletar(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
