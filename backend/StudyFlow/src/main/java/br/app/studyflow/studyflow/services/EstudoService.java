package br.app.studyflow.studyflow.services;

import br.app.studyflow.studyflow.model.Estudo;
import br.app.studyflow.studyflow.repository.EstudoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EstudoService {

    @Autowired
    private EstudoRepository estudoRepository;

    public Estudo salvar(Estudo estudo) {
        return estudoRepository.save(estudo);
    }

    public List<Estudo> buscarPorConteudo(Long conteudoId) {
        return estudoRepository.findByConteudoId(conteudoId);
    }

    public List<Estudo> buscarPorData(LocalDate data) {
        return estudoRepository.findByData(data);
    }

    public List<Estudo> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return estudoRepository.findByDataBetween(dataInicio, dataFim);
    }

    public Optional<Estudo> buscarPorId(Long id) {
        return estudoRepository.findById(id);
    }

    public void deletar(Long id) {
        estudoRepository.deleteById(id);
    }
}
