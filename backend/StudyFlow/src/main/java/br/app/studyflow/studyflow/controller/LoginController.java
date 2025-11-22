package br.app.studyflow.studyflow.controller;

import br.app.studyflow.studyflow.model.Usuario;
import br.app.studyflow.studyflow.repository.UsuarioRepository;
import br.app.studyflow.studyflow.services.CookieService;
import br.app.studyflow.studyflow.services.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.ui.Model;

import java.io.UnsupportedEncodingException;

@Controller
public class LoginController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    //LOGIN

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @PostMapping("/logar")
    public String loginUsuario(Usuario usuario, Model model, HttpServletResponse response)
            throws UnsupportedEncodingException {

        Usuario usuarioLogado = usuarioService.login(usuario.getEmail(), usuario.getSenha());

        if (usuarioLogado == null) {
            model.addAttribute("erro", "Usuário ou senha inválidos!");
            return "login";
        }

        // Criação dos cookies
        CookieService.setCookie(response, "usuarioID", String.valueOf(usuarioLogado.getId()), 3600);
        CookieService.setCookie(response, "nomeUsuario", usuarioLogado.getNomeCompleto(), 3600);

        return "redirect:/";
    }

    //HOME/ DASHBOARD

    @GetMapping("/")
    public String dashboard(Model model, HttpServletRequest request) throws UnsupportedEncodingException {

        String nome = CookieService.getCookie(request, "nomeUsuario");

        if (nome == null || nome.isEmpty()) {
            return "redirect:/login"; // impede acesso sem login
        }

        model.addAttribute("nome", nome);
        return "index";
    }

    //CADASTRO

    @GetMapping("/cadastro")
    public String cadastro() {
        return "cadastro";
    }

    @PostMapping("/cadastro")
    public String cadastrar(@Valid Usuario usuario, BindingResult result) {

        if (result.hasErrors()) {
            return "cadastro";
        }

        usuarioService.cadastrar(usuario);
        return "redirect:/login";
    }
}
