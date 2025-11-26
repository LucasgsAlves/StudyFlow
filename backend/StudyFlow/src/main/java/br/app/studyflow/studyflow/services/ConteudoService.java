package br.app.studyflow.studyflow.services;

import br.app.studyflow.studyflow.model.Conteudo;
import br.app.studyflow.studyflow.repository.ConteudoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConteudoService {

    @Autowired
    private ConteudoRepository conteudoRepository;

    public Conteudo salvar(Conteudo conteudo) {
        return conteudoRepository.save(conteudo);
    }

    public List<Conteudo> buscarPorDisciplina(Long disciplinaId) {
        return conteudoRepository.findByDisciplinaId(disciplinaId);
    }

    public Optional<Conteudo> buscarPorId(Long id) {
        return conteudoRepository.findById(id);
    }

    public void deletar(Long id) {
        conteudoRepository.deleteById(id);
    }

    public List<Conteudo> buscarTodosConteudosDoUsuario(Long usuarioId) {
        return conteudoRepository.findByDisciplinaUsuarioId(usuarioId);
    }
}
