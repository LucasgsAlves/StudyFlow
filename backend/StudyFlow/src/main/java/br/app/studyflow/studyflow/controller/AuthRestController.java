package br.app.studyflow.studyflow.controller;

import br.app.studyflow.studyflow.model.Usuario;
import br.app.studyflow.studyflow.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthRestController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Endpoint para login via API REST
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String senha = credentials.get("senha");

        if (email == null || senha == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email e senha são obrigatórios");
            return ResponseEntity.badRequest().body(error);
        }

        Usuario usuario = usuarioService.login(email, senha);

        if (usuario == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email ou senha incorretos");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Remove a senha antes de retornar
        usuario.setSenha(null);

        return ResponseEntity.ok(usuario);
    }

    /**
     * Endpoint para cadastro via API REST
     * POST /api/auth/cadastrar
     */
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody Usuario usuario) {
        try {
            // Verifica se o email já existe
            if (usuarioService.listarTodos().stream()
                    .anyMatch(u -> u.getEmail().equals(usuario.getEmail()))) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email já cadastrado");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }

            Usuario novoUsuario = usuarioService.cadastrar(usuario);

            // Remove a senha antes de retornar
            novoUsuario.setSenha(null);

            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao cadastrar usuário: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Endpoint para solicitação de recuperação de senha
     * POST /api/auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email é obrigatório");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            // Verifica se o usuário existe
            Usuario usuario = usuarioService.listarTodos().stream()
                    .filter(u -> u.getEmail().equals(email))
                    .findFirst()
                    .orElse(null);

            if (usuario == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email não encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            // Gera um token de recuperação (simulado - em produção, use JWT ou UUID)
            String token = java.util.UUID.randomUUID().toString();
            
            // TODO: Em produção, salvar o token no banco com data de expiração
            // TODO: Enviar email com link de recuperação
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email de recuperação enviado com sucesso");
            response.put("token", token); // Apenas para desenvolvimento
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao processar solicitação: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
