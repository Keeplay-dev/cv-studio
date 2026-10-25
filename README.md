<div align="center">
  <h1>📄 CVStudio</h1>
  <p><strong>Gerador de Currículos Interativo em Tempo Real focado em Padrões de RH & Otimização ATS</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Status-Ativo-brightgreen" alt="Status" />
    <img src="https://img.shields.io/badge/ATS-Friendly-blue" alt="ATS Friendly" />
    <img src="https://img.shields.io/badge/Export-PDF%20%7C%20DOCX-orange" alt="Export Formats" />
    <img src="https://img.shields.io/badge/Copyright-All%20Rights%20Reserved-red" alt="License" />
  </p>

  <p>
    <a href="#-sobre-o-projeto">Sobre</a> •
    <a href="#-arquitetura-e-funcionalidades">Funcionalidades</a> •
    <a href="#-padrões-de-rh-e-engenharia-ats">Padrão ATS</a> •
    <a href="#-estrutura-do-projeto">Estrutura</a> •
    <a href="#-como-executar-localmente">Instalação</a>
  </p>
</div>

---

## 🎯 Sobre o Projeto

O **CVStudio** é uma aplicação web desenvolvida para solucionar um dos maiores gargalos enfrentados por candidatos em processos seletivos modernos: a reprovação automática por softwares de triagem (**ATS — Applicant Tracking Systems**) devido a formatações inadequadas.

Enquanto ferramentas de design convencionais priorizam layouts complexos que quebram a leitura de algoritmos (como Gupy, Kenoby, Workday e Greenhouse), o **CVStudio** combina uma interface de edição fluida (**Live Preview**) com um motor de geração de documentos estritamente alinhado às diretrizes exigidas por recrutadores e comunidades de Recursos Humanos.

🔗 **Link do Repositório:** [github.com/Keeplay-dev/CVStudio](https://github.com/Keeplay-dev/cs-studio)  
🌐 **Demonstração Online (Deploy):** https://cv-studio-zeta-lac.vercel.app/

---

## ⚡ Arquitetura e Funcionalidades

### 1. Motor de Renderização em Tempo Real (Live Preview)
- **Two-Way Data Binding / Reatividade:** Sincronização instantânea entre os inputs do formulário e a folha de visualização (proporção A4 fiel à impressão).
- **Renderização Condicional Inteligente:** Seções vazias (como links opcionais, certificações ou idiomas) são omitidas automaticamente do documento final para evitar espaços em branco ou títulos órfãos.
- **Validação e Formatação de Dados:** Padronização visual automática de períodos (datas de início/fim ou "Atual"), links de contato (LinkedIn, GitHub, Portfólio) e listas de competências.

### 2. Pipeline Duplo de Exportação (`PDF` & `DOCX`)
- **Geração de PDF Vetorial:** Exportação limpa em folha A4 com margens padronizadas, preservando a seleção de texto (essencial para leitura de parsers de RH, diferente de PDFs gerados como imagem).
- **Geração de Word (`.docx`):** Construção estruturada do documento editável utilizando hierarquia nativa de parágrafos e estilos do Microsoft Word, permitindo ao usuário realizar ajustes finos pós-download caso deseje.

### 3. Gestão Modular de Seções
O formulário é dividido em blocos lógicos independentes com suporte a adição, edição, remoção e reordenação dinâmica de itens:
- **Cabeçalho & Contato:** Nome completo, cargo pretendido, localização, telefone, e-mail e links profissionais.
- **Resumo Profissional:** Bloco de texto focado em *elevator pitch* e palavras-chave da área.
- **Experiência Profissional:** Estrutura cronológica inversa com destaque para cargo, empresa, período e descrição de entregas/resultados em *bullet points*.
- **Formação Acadêmica:** Grau, instituição de ensino, curso e status/ano de conclusão.
- **Habilidades Técnicas & Idiomas:** Categorização direta sem uso de barras de progresso gráficas (que são ignoradas por robôs de leitura).

---

## 🧠 Padrões de RH e Engenharia ATS

O layout gerado pelo **CVStudio** foi projetado seguindo métricas de *eye-tracking* de recrutadores (tempo médio de triagem inicial de 6 a 10 segundos) e regras de *parsing* léxico:

| Critério Técnico | Implementação no CVStudio | Impacto na Triagem (RH / ATS) |
| :--- | :--- | :--- |
| **Coluna Única (Single-Column)** | Flux
