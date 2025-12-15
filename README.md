<h1 align="center">GitHub Repo Describer</h1>
<h3 align="center">AI-powered repository description generator</h3>

<p align="center">
  <em>Auto-generate descriptions for repos missing them using Gemini AI</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
</p>

<p align="center">
  :gb: <a href="#english">English</a> | :it: <a href="#italiano">Italiano</a>
</p>

---

## Overview

<!-- ![GitHub Repo Describer Overview](assets/repo-describer-overview.png) -->

---

<a name="english"></a>
## :gb: English

### What is GitHub Repo Describer?

An intelligent tool that identifies your GitHub repos missing a description, uses **Gemini AI** to generate a summary from the README, and lets you update it with one click.

### Features

- **Secure Authentication**: GitHub PAT with `repo` scope
- **Auto Discovery**: Finds repos without descriptions
- **AI-Powered**: Gemini analyzes README and generates descriptions
- **One-Click Update**: Push directly to GitHub
- **Real-Time UI**: Removes updated repos from list

### How It Works

1. Authorize with GitHub PAT
2. App fetches repos without descriptions
3. Click "Generate Description" - AI reads README
4. Review and click "Update on GitHub"

### Quick Start

```bash
git clone https://github.com/fracabu/github-repo-describer.git
cd github-repo-describer
npm install

# Add GEMINI_API_KEY to .env.local
npm run dev
```

---

<a name="italiano"></a>
## :it: Italiano

### Cos'e GitHub Repo Describer?

Uno strumento intelligente che identifica le tue repo GitHub senza descrizione, usa **Gemini AI** per generare un riassunto dal README, e ti permette di aggiornarlo con un click.

### Funzionalita

- **Autenticazione Sicura**: GitHub PAT con scope `repo`
- **Scoperta Automatica**: Trova repo senza descrizioni
- **AI-Powered**: Gemini analizza il README e genera descrizioni
- **Aggiornamento One-Click**: Push diretto su GitHub
- **UI Real-Time**: Rimuove le repo aggiornate dalla lista

### Come Funziona

1. Autorizza con GitHub PAT
2. L'app recupera le repo senza descrizione
3. Clicca "Genera Descrizione" - l'AI legge il README
4. Rivedi e clicca "Aggiorna su GitHub"

### Quick Start

```bash
git clone https://github.com/fracabu/github-repo-describer.git
cd github-repo-describer
npm install

# Aggiungi GEMINI_API_KEY a .env.local
npm run dev
```

---

## Tech Stack

React, TypeScript, Tailwind CSS, Google Gemini API, GitHub REST API

## License

MIT

---

<p align="center">
  <a href="https://github.com/fracabu">
    <img src="https://img.shields.io/badge/Made_by-fracabu-8B5CF6?style=flat-square" alt="Made by fracabu" />
  </a>
</p>
