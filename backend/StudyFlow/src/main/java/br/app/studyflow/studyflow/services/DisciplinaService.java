package br.app.studyflow.studyflow.services;

import br.app.studyflow.studyflow.model.Disciplina;
import br.app.studyflow.studyflow.model.Usuario;
import br.app.studyflow.studyflow.repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DisciplinaService {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public Disciplina salvar(Disciplina disciplina) {
        return disciplinaRepository.save(disciplina);
    }

    public List<Disciplina> buscarPorUsuario(Long usuarioId) {
        return disciplinaRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Disciplina> buscarPorId(Long id) {
        return disciplinaRepository.findById(id);
    }

    public void deletar(Long id) {
        disciplinaRepository.deleteById(id);
    }
}
