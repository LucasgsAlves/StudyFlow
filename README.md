# StudyFlow - Sistema de Gerenciamento de Estudos

## 📚 Visão Geral do Projeto

O StudyFlow é um sistema de gerenciamento de estudos projetado para ajudar o usuário a organizar disciplinas, conteúdos e registrar o tempo dedicado a cada estudo. O sistema é dividido em duas partes principais: um **Backend** em Java com Spring Boot para a lógica de negócios e persistência de dados, e um **Frontend** em React com Vite para a interface do usuário.

### Correções Recentes (Versão Corrigida)

Esta versão inclui correções essenciais para o rastreamento de horas de estudo:

1.  **Registro de Estudo (`RegistroEstudo.jsx`):** A função de atualização de horas (`atualizarHorasConteudo`) agora é chamada após a criação, edição e exclusão de um registro de estudo. Isso garante que o total de horas estudadas para um conteúdo específico seja atualizado em tempo real.
2.  **Dashboard (`Dashboard.jsx`):** O dashboard foi ajustado para somar corretamente o total de horas estudadas de todos os conteúdos do usuário, exibindo o valor atualizado no card "Horas Estudadas".

## 🛠️ Tecnologias Utilizadas

### Backend (Java/Spring Boot)

| Tecnologia | Versão Principal | Descrição |
| :--- | :--- | :--- |
| **Linguagem** | Java 17 | Linguagem de programação principal. |
| **Framework** | Spring Boot 3.2.5 | Facilita a criação de aplicações Spring autônomas e prontas para produção. |
| **ORM** | Spring Data JPA | Para persistência de dados e mapeamento objeto-relacional. |
| **Banco de Dados** | MySQL (Produção) / H2 (Desenvolvimento) | Conector para MySQL e banco de dados em memória para testes/desenvolvimento. |
| **Segurança** | Spring Security | Para autenticação e autorização. |
| **Build Tool** | Maven | Gerenciamento de dependências e ciclo de vida do projeto. |

### Frontend (React/Vite)

| Tecnologia | Versão Principal | Descrição |
| :--- | :--- | :--- |
| **Framework** | React 18 | Biblioteca JavaScript para construção de interfaces de usuário. |
| **Build Tool** | Vite | Ferramenta de construção rápida para projetos frontend. |
| **Roteamento** | Wouter | Biblioteca de roteamento simples e leve. |
| **Estilização** | Tailwind CSS | Framework CSS utilitário para design rápido. |
| **Componentes UI** | Radix UI | Primitivas de componentes de UI acessíveis. |
| **Requisições HTTP** | Axios | Cliente HTTP baseado em Promises. |

## ⚙️ Pré-requisitos

Para executar o projeto localmente, você precisará ter instalado:

| Requisito | Versão Mínima |
| :--- | :--- |
| **Java Development Kit (JDK)** | 17 |
| **Apache Maven** | 3.2.5 (Versão do Spring Boot Parent) |
| **Node.js** | 18+ (LTS recomendado) |
| **pnpm** | 8+ |
| **MySQL** (Opcional, para ambiente de produção) | 8.0+ |

## 🚀 Como Executar o Projeto

O projeto é dividido em duas partes que devem ser iniciadas separadamente.

### 1. Configuração e Execução do Backend

1.  Navegue até o diretório do backend:
    ```bash
    cd StudyFlow-FinalVersion/StudyFlow/backend/StudyFlow
    ```

2.  **Configuração do Banco de Dados:**
    *   O projeto está configurado para usar o H2 Database em memória por padrão, o que é suficiente para testes rápidos.
    *   Se desejar usar o MySQL, você precisará configurar as credenciais no arquivo `src/main/resources/application.properties` (ou similar).

3.  **Execução:**
    Inicie o servidor Spring Boot usando o wrapper Maven:
    ```bash
    ./mvnw spring-boot:run
    ```
    O backend será iniciado em `http://localhost:8080`.

### 2. Configuração e Execução do Frontend

1.  Navegue até o diretório do frontend:
    ```bash
    cd ../../frontend
    ```

2.  **Instalação de Dependências:**
    Instale as dependências do Node.js usando `pnpm`:
    ```bash
    pnpm install
    ```

3.  **Execução:**
    Inicie o servidor de desenvolvimento do Vite:
    ```bash
    pnpm run dev
    ```
    O frontend será iniciado em `http://localhost:5173` (verifique o console para a URL exata).

**⚠️ Importante:** O frontend depende da API fornecida pelo backend. Certifique-se de que o backend esteja totalmente operacional antes de iniciar o frontend.

## 📂 Estrutura do Projeto

O projeto segue uma estrutura de monorepo simples com duas pastas principais:

```
StudyFlow-FinalVersion/
├── StudyFlow/
│   ├── backend/
│   │   └── StudyFlow/  # Projeto Spring Boot (Java)
│   │       ├── src/
│   │       └── pom.xml
│   └── frontend/
│       ├── client/     # Código-fonte React/Vite
│       ├── package.json
│       └── ...
└── README.md
```
