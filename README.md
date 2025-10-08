
# CLSystem PDV Simples

# Funções
- **Login/Logout**
- **Cadastro de Produtos**
- **Cadastro de Funcionários**
- **Cadastro de Vendas**
- **Edição/Exclusão de item**
- **Fechamento/Cancelamento**
- **Auxílio com troco e escolha de método de pagamento**
- **Abertura/Fechamento de Caixa**
- **Histórico de Vendas por Caixa**

## Tecnologias Utilizadas

### Backend (Server)
- **Java 21**: Linguagem de programação principal
- **Spring Boot 3.1.1**: Framework para desenvolvimento de aplicações Java
- **Spring Security**: Implementação de autenticação e autorização
- **OAuth2/JWT**: Autenticação baseada em tokens
- **Spring Data JPA**: Persistência de dados e ORM
- **PostgreSQL**: Banco de dados relacional
- **Lombok**: Redução de código boilerplate
- **Maven**: Gerenciamento de dependências e build

### Frontend (Client)
- **Angular**: Framework para desenvolvimento de aplicações web
- **TypeScript**: Linguagem de programação tipada baseada em JavaScript
- **Angular CLI**: Ferramenta de linha de comando para desenvolvimento Angular

## Configuração do Ambiente

### Requisitos
- Java 21 JDK
- Node.js e npm
- PostgreSQL
- Maven

### Backend
O servidor backend roda na porta 8081 por padrão e se conecta a um banco de dados PostgreSQL.

### Frontend
O cliente frontend roda na porta 4201 por padrão.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4201/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Segurança
O projeto utiliza Spring Security com autenticação JWT. As chaves públicas e privadas são configuradas no arquivo application.properties.

## Configuração de CORS
O backend está configurado para aceitar requisições do frontend rodando em `http://localhost:4201`.

# Arquivos de configuração
application.properties.example -> Configurações a serem preenchidas
application.properties -> Adicionar perfil ativo [spring.profiles.active=dev,prod
application-dev.properties -> Configurações do perfil dev
application-prod.properties -> Configurações do perfil prod
messages_pt_BR.properties -> Mensagens

