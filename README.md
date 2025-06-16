
# 🚀 CEF-Transform-Config - Automação de Provisionamento de Rede

Sistema composto por dois módulos principais: uma API backend desenvolvida com **NestJS** e uma interface frontend desenvolvida com **Angular**, projetados para automatizar a geração de scripts de configuração de rede.

---

## 📌 Visão Geral

O **Sistema Quality - Script Automation** foi criado para acelerar e padronizar processos de provisionamento de equipamentos de rede, reduzindo erros manuais e aumentando a eficiência operacional das equipes de TI.

---

## 📂 Estrutura do Projeto

```
Script_Automation/
├── backend/   # API NestJS responsável pela lógica de geração dos scripts
└── frontend/  # Aplicação Angular responsável pela interface web
```

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) (Recomendado: versão 16.x ou superior)
- [npm](https://www.npmjs.com/) (Incluído com o Node.js)
- [Angular CLI](https://angular.io/cli) (Instalação global)

### Instalar Angular CLI:

```bash
npm install -g @angular/cli
```

---

## 🚀 Instalação e Execução

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd Script_Automation
```

### 2. Instalar Dependências

| Módulo    | Comando                    |
|-----------|----------------------------|
| Backend   | `cd backend && npm install` |
| Frontend  | `cd frontend && npm install` |

### 3. Executar em Ambiente de Desenvolvimento

#### ▶️ Backend (NestJS)

```bash
cd backend
npm run start:dev
```
> API disponível em: [http://localhost:3000/api](http://localhost:3000/api)

#### ▶️ Frontend (Angular)

```bash
cd frontend
ng serve
```
> Aplicação disponível em: [http://localhost:4200](http://localhost:4200)

### 4. Gerar Build para Produção

| Módulo    | Comando                                 |
|-----------|-----------------------------------------|
| Backend   | `npm run build`                         |
| Frontend  | `ng build --configuration production`   |

---

## ⚙️ Configurações Adicionais

- **CORS:** O backend já está preparado para aceitar requisições do frontend.
- **Variáveis de Ambiente:** Caso necessário, configure variáveis em arquivos `.env` no backend.
- **Customizações:** Consulte os arquivos `package.json` de cada módulo para ajustes específicos.

---

## 🛡️ Boas Práticas

- **Executar o backend antes do frontend** para evitar falhas de comunicação.
- Manter dependências atualizadas.
- Utilizar controle de versão (branches, commits semânticos e pull requests).

---

## 📣 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

- Abrir **issues** para reportar bugs ou sugerir melhorias.
- Criar **pull requests** com novas funcionalidades ou correções.

Por favor, siga o padrão de código e a estrutura existente.

---

<div align="center">
  <strong>Desenvolvido com 💙 para automação de redes.</strong><br/>
  <em>Facilitando o provisionamento, um script por vez.</em>
</div>
