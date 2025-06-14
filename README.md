# Sistema de Gestão Escolar - Projeto de Remanejamento ACEX

![Logo do Colégio Plus](public/images/colegio-plus-logo.png)

Este é um sistema avançado de gestão escolar, desenvolvido como uma Prova de Conceito (PoC) para o Colégio Plus. O foco principal é a automação e otimização do **remanejamento de aulas**, utilizando tecnologias modernas para resolver conflitos de horário, gerenciar ausências de professores e garantir a continuidade pedagógica com o mínimo de impacto.

O projeto foi construído com **Next.js** e **TypeScript**, apresentando uma interface rica e reativa criada com **Shadcn/ui** e **Tailwind CSS**.

## ✨ Funcionalidades Principais

O sistema é dividido em vários módulos e dashboards, cada um com um propósito específico, demonstrando uma evolução em fases de complexidade tecnológica.

### Fase 1: Gestão Essencial
* **Dashboard Principal**: Visão geral com estatísticas e ações rápidas.
* **Gestão Acadêmica**: Módulos para gerenciar:
    * **Professores**
    * **Turmas**
    * **Disciplinas**
    * **Horários**
    * **Salas**
* **Remanejamento Automático**: Ferramenta para executar algoritmos de otimização e resolver conflitos pendentes.
* **Integrações**: Conexão com serviços externos como Google Calendar e WhatsApp.
* **Autenticação e Perfil**: Sistema de login seguro e página de perfil de usuário.

### Fase 2: IA e Análise Avançada
* **Dashboard Avançado**: Centraliza workflows, analytics e backups.
* **Machine Learning**: Dashboard para predição de ausências de professores, análise de padrões e insights de IA para prevenção de conflitos.
* **Dashboard Executivo**: KPIs, tendências e previsões para a tomada de decisão estratégica.
* **Workflows Automatizados**: Sistema de aprovação e notificação em múltiplos passos para processos críticos.

### Fase 3: Tecnologias de Vanguarda
* **Dashboard de Tecnologias Avançadas**: Demonstração de conceitos como:
    * **IoT (Internet das Coisas)**: Monitoramento de salas com sensores inteligentes.
    * **Realidade Aumentada (AR)**: Navegação e visualização 3D do ambiente escolar.
    * **IA Conversacional**: Assistente virtual para interagir com o sistema.
    * **Blockchain**: Trilha de auditoria imutável para registros críticos.

## 🚀 Tecnologias Utilizadas

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: Shadcn/ui, Radix UI
- **Gerenciamento de Formulários**: React Hook Form, Zod
- **Animações**: Framer Motion
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Gerenciador de Pacotes**: pnpm

## 📂 Estrutura do Projeto

O código está organizado da seguinte forma:

-   `app/`: Contém as rotas e páginas da aplicação, seguindo o padrão do App Router do Next.js.
-   `components/`: Abriga todos os componentes React reutilizáveis.
    -   `components/ui/`: Componentes base do Shadcn/ui.
    -   `components/auth/`, `components/modals/`, etc.: Componentes específicos de cada funcionalidade.
-   `lib/`: Onde reside a maior parte da lógica de negócio do sistema.
    -   `lib/algorithms/`: Implementação dos diferentes algoritmos de remanejamento.
    -   `lib/auth/`: Serviço de autenticação e gerenciamento de sessão.
    -   `lib/workflow/`: Motores de workflow simples e avançado para automação de processos.
    -   `lib/ml/`, `lib/iot/`, `lib/ar/`, etc.: Serviços que simulam as tecnologias avançadas.
-   `public/`: Arquivos estáticos, como imagens e logos.
-   `styles/` e `app/globals.css`: Arquivos de estilização global.

## 🏁 Como Começar

Siga os passos abaixo para executar o projeto localmente.

### Pré-requisitos

-   Node.js (versão 22.x ou superior)
-   `pnpm` instalado (`npm install -g pnpm`)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DA_PASTA>
    ```

2.  Instale as dependências com pnpm:
    ```bash
    pnpm install
    ```

### Executando o Projeto

Para iniciar o servidor de desenvolvimento, execute:

```bash
pnpm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## 📜 Scripts Disponíveis

No arquivo `package.json`, você encontrará os seguintes scripts:

-   `pnpm dev`: Inicia o servidor de desenvolvimento.
-   `pnpm build`: Gera a build de produção da aplicação.
-   `pnpm start`: Inicia um servidor de produção após a build.
-   `pnpm lint`: Executa o linter do Next.js para verificar a qualidade do código.
