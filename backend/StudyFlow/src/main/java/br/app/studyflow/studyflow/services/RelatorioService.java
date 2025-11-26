package br.app.studyflow.studyflow.services;

import br.app.studyflow.studyflow.model.Conteudo;
import br.app.studyflow.studyflow.model.Estudo;
import br.app.studyflow.studyflow.model.Relatorio;
import br.app.studyflow.studyflow.repository.RelatorioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RelatorioService {

    @Autowired
    private RelatorioRepository relatorioRepository;

    @Autowired
    private ConteudoService conteudoService;

    @Autowired
    private EstudoService estudoService;

    public Relatorio salvar(Relatorio relatorio) {
        return relatorioRepository.save(relatorio);
    }

    public List<Relatorio> buscarPorUsuario(Long usuarioId) {
        return relatorioRepository.findByUsuarioId(usuarioId);
    }

    public List<Relatorio> buscarPorUsuarioEPeriodo(Long usuarioId, String periodo) {
        return relatorioRepository.findByUsuarioIdAndPeriodo(usuarioId, periodo);
    }

    public Optional<Relatorio> buscarPorId(Long id) {
        return relatorioRepository.findById(id);
    }

    public void deletar(Long id) {
        relatorioRepository.deleteById(id);
    }

    public Double calcularProgresso(Long usuarioId) {
        List<Conteudo> todosConteudos = conteudoService.buscarTodosConteudosDoUsuario(usuarioId);
        if (todosConteudos.isEmpty()) {
            return 0.0;
        }

        long conteudosConcluidos = todosConteudos.stream()
                .filter(conteudo -> {
                    List<Estudo> estudos = estudoService.buscarPorConteudo(conteudo.getId());
                    return estudos.stream().anyMatch(Estudo::getConcluido);
                })
                .count();

        return (double) conteudosConcluidos / todosConteudos.size() * 100;
    }
}
