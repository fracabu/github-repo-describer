# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs Vite development server)
- **Build for production**: `npm run build` (builds the app using Vite)
- **Preview production build**: `npm run preview` (serves the production build locally)
- **Install dependencies**: `npm install`

## Code Architecture

### Core Application Structure

This is a React/TypeScript application built with Vite that helps users automatically generate descriptions for GitHub repositories without descriptions using Google's Gemini AI.

**Main Entry Point**: `App.tsx` - Contains authentication state management, user login/logout flow, and repository fetching logic.

**Key Services**:
- `services/githubService.ts` - All GitHub API interactions including authentication, repository fetching, README retrieval, and description updates
- `services/geminiService.ts` - Google Gemini AI integration for description generation and README analysis

**Component Structure**:
- `components/Auth.tsx` - Handles GitHub Personal Access Token authentication
- `components/RepoList.tsx` - Displays grid/list of repositories without descriptions
- `components/RepoItem.tsx` - Individual repository card with generate/update functionality
- `components/Header.tsx` - Application header
- `components/icons/` - SVG icon components

**Type Definitions**: `types.ts` - TypeScript interfaces for GitHub API responses and application data structures

### Environment Configuration

The application requires a `GEMINI_API_KEY` environment variable for Google Gemini AI integration. The Vite config (`vite.config.ts`) exposes this as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` in the build.

### Authentication Flow

1. User provides GitHub Personal Access Token (PAT) with `repo` scope
2. Application authenticates and fetches user profile
3. Fetches all user repositories, filters for public non-forked repos without descriptions
4. For each repo, can generate description from README using Gemini AI
5. Updates repository description directly via GitHub API

### Key Features Implementation

- **Pagination handling** for GitHub API responses in `fetchUserRepos`
- **README analysis** to determine if content is generic before generating descriptions
- **File tree exploration** for repositories without READMEs to generate content
- **Real-time UI updates** removing repositories from list after successful description updates