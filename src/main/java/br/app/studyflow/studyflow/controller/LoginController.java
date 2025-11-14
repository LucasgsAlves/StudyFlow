package br.app.studyflow.studyflow.controller;

import br.app.studyflow.studyflow.model.Usuario;
import br.app.studyflow.studyflow.repository.UsuarioRepository;
import br.app.studyflow.studyflow.services.CookieService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.management.StringValueExp;
import java.io.UnsupportedEncodingException;

@Controller
public class LoginController {

    @Autowired
    private UsuarioRepository ur;

    @GetMapping("/login")
    public String login(){
        return "login";
    }

    @GetMapping("/")
    public String dashboard(){
        return "index";
    }


    @PostMapping("/logar")
    public String loginUsuario(Usuario usuario, Model model, HttpServletResponse response) throws UnsupportedEncodingException {
        Usuario usuarioLogado = this.ur.login(usuario.getEmail(), usuario.getSenha());
        if (usuarioLogado != null){
            CookieService.setCookie(response, "UsuarioID", String.valueOf(usuarioLogado.getId()), 10000);
            CookieService.setCookie(response, "nomeUsuario", String.valueOf(usuarioLogado.getNome()), 10000);
            return "redirect:/index";
        }

        model.addAttribute("erro", "Usuario Inválido!");
        return "login/login";
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
        return "redirect/login";
    }
}
