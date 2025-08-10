# GitHub Repo Describer

An intelligent tool designed to streamline your repository management. This application automatically identifies your GitHub repositories that are missing a description, uses the Google Gemini AI to generate a concise and relevant summary from the `README.md` file, and allows you to update it directly on GitHub with a single click.

![GitHub Repo Describer Screenshot](https://storage.googleapis.com/proudcity-prod-bucket-1/uploads/2024/05/92a832f0-github-repo-describer-screenshot.png)

## ✨ Features

- **Secure Authentication**: Connects to your GitHub account securely using a Personal Access Token (PAT) with `repo` scope.
- **Automatic Repository Discovery**: Fetches and displays a list of your public, non-forked repositories that currently lack a description.
- **AI-Powered Generation**: Leverages the Google Gemini API to analyze the content of your `README.md` file and generate a high-quality, one-sentence description.
- **One-Click Updates**: Seamlessly push the generated description directly to your repository on GitHub, eliminating manual copy-pasting.
- **Real-Time Feedback**: The UI updates instantly, removing repositories from the list as you update them.
- **Clean & Responsive UI**: A modern, easy-to-use interface built with React and Tailwind CSS.

## 🚀 How It Works

1.  **Authorize**: Provide a GitHub Personal Access Token with the `repo` scope to grant the application the necessary permissions.
2.  **Fetch Repos**: The app automatically fetches your repositories and filters for those without descriptions.
3.  **Generate**: For any repository in the list, click "Generate Description". The app reads the `README.md` and asks the Gemini AI to summarize it.
4.  **Review & Update**: Review the AI-generated description. If you like it, click "Update on GitHub" to apply it to your repository instantly.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (`gemini-2.5-flash`)
- **API**: GitHub REST API

## ⚙️ Local Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fracabu/github-repo-describer.git
    cd github-repo-describer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    You will need a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey). Create a file named `.env.local` in the root of the project and add your key:
    ```
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`

5.  **Get a GitHub Personal Access Token:**
    Follow the instructions in the app to create a token with `repo` scope from [GitHub Settings](https://github.com/settings/tokens/new).
