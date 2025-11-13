package br.app.studyflow.studyflow.controller;


import br.app.studyflow.studyflow.model.Usuario;
import br.app.studyflow.studyflow.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class LoginController {


    private UsuarioRepository ur;

    @GetMapping("/login")
    public String login(){
        return "login";
    }

    @GetMapping("/cadastro")
    public String cadastro(){
        return "cadastro";
    }

    @RequestMapping(value = "/cadastro", method = RequestMethod.POST)
    public String cadastro(@Valid Usuario usuario, BindingResult result){

        if(result.hasErrors()){
            return "redirect:/cadastro";
        }

        ur.save(usuario);

        return "";
    }
}
