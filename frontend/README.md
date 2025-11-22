# StudyFlow - Sistema de Gerenciamento de Usuários

Sistema web desenvolvido com **Java 17** e **Spring Boot 3.5.7** para gerenciamento de usuários com autenticação e CRUD completo.

## 🚀 Tecnologias Utilizadas

- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Data JPA**
- **Hibernate**
- **MySQL 8.0**
- **Thymeleaf**
- **Maven**

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- Java 17 ou superior ([Download](https://www.oracle.com/java/technologies/downloads/))
- Maven 3.6+ ([Download](https://maven.apache.org/download.cgi))
- MySQL Server 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))

## ⚙️ Configuração do Banco de Dados

1. Inicie o serviço do MySQL
2. Crie o banco de dados:

```sql
CREATE DATABASE studyflow;
```

3. Configure o usuário e senha no arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/studyflow?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_AQUI
```

4. Também atualize as credenciais em `src/main/java/br/app/studyflow/studyflow/DataConfiguration.java` (linhas 22-23)

## 🔧 Como Executar

1. Clone ou extraia o projeto
2. Navegue até a pasta do projeto:

```bash
cd studyflow
```

3. Compile o projeto:

```bash
mvn clean compile
```

4. Execute a aplicação:

```bash
mvn spring-boot:run
```

5. Acesse a aplicação em: `http://localhost:8080`

## 📡 API REST - Endpoints

A aplicação expõe os seguintes endpoints REST para gerenciamento de usuários:

### Criar Usuário
```bash
POST /api/usuarios
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

### Listar Todos os Usuários
```bash
GET /api/usuarios
```

### Buscar Usuário por ID
```bash
GET /api/usuarios/{id}
```

### Atualizar Usuário
```bash
PUT /api/usuarios/{id}
Content-Type: application/json

{
  "nome": "João Silva Atualizado",
  "email": "joao.novo@email.com",
  "senha": "novasenha123"
}
```

### Deletar Usuário
```bash
DELETE /api/usuarios/{id}
```

## 🌐 Rotas Web

- `/` - Página inicial
- `/login` - Página de login
- `/cadastro` - Página de cadastro de usuário
- `/index` - Dashboard (requer autenticação)
- `/logout` - Logout do sistema

## 📁 Estrutura do Projeto

```
studyflow/
├── src/
│   ├── main/
│   │   ├── java/br/app/studyflow/studyflow/
│   │   │   ├── controller/
│   │   │   │   ├── LoginController.java
│   │   │   │   └── UsuarioRestController.java
│   │   │   ├── model/
│   │   │   │   └── Usuario.java
│   │   │   ├── repository/
│   │   │   │   └── UsuarioRepository.java
│   │   │   ├── services/
│   │   │   │   ├── UsuarioService.java
│   │   │   │   ├── CookieService.java
│   │   │   │   └── Autenticador/
│   │   │   │       ├── LoginInterceptor.java
│   │   │   │       └── LoginInterceptorAppConfig.java
│   │   │   ├── DataConfiguration.java
│   │   │   └── StudyflowApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── templates/
│   │           ├── index.html
│   │           ├── login.html
│   │           ├── cadastro.html
│   │           └── dashboard.html
│   └── test/
├── pom.xml
├── README.md
└── DOCUMENTACAO.md
```

## 📝 Documentação Completa

Para mais detalhes sobre as correções e melhorias implementadas, consulte o arquivo [DOCUMENTACAO.md](DOCUMENTACAO.md).

## ✅ Testes Realizados

Todos os endpoints da API REST foram testados e validados:

- ✅ CREATE - Criação de usuários
- ✅ READ - Listagem e busca por ID
- ✅ UPDATE - Atualização de dados
- ✅ DELETE - Remoção de usuários
- ✅ Persistência no banco de dados MySQL

## 🛠️ Melhorias Implementadas

1. Correção do dialeto do Hibernate para MySQL
2. Implementação de camada de serviço (Service Layer)
3. Criação de API RESTful completa
4. Validações robustas no modelo Usuario
5. Tratamento de erros aprimorado
6. Configuração correta do interceptor de autenticação
7. Atualização da versão do Java para 17

## 📄 Licença

Este projeto é de uso educacional.

---

**Desenvolvido por:** Manus AI  
**Data:** Novembro 2025