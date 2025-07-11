
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescriptionFromReadme = async (readmeContent: string): Promise<string> => {
  if (!readmeContent.trim()) {
    return "This repository does not have a readable README file to generate a description from.";
  }

  const prompt = `
    Based on the following README.md content, generate a single, concise, and professional sentence to be used as a GitHub repository description. 
    The description should accurately summarize the project's purpose. Do not use markdown or any special formatting.
    Only return the description text.

    README content:
    ---
    ${readmeContent}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    const text = response.text.trim().replace(/^"|"$/g, ''); // Clean up quotes
    return text;
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    throw new Error("Failed to generate description. The AI service may be unavailable.");
  }
};

export const isReadmeGeneric = async (readmeContent: string): Promise<boolean> => {
    const lowerCaseContent = readmeContent.toLowerCase();
    const repoNamePlaceholder = "name of your repository";
    if (readmeContent.length < 150 && (lowerCaseContent.includes('add a readme') || lowerCaseContent.includes(repoNamePlaceholder))) {
        return true;
    }

    const prompt = `
        Analyze the following README.md content. Is it a generic, auto-generated file that provides no specific details about the project's functionality?
        For example, a README that just contains the project title and placeholder text is generic.
        Respond with only "YES" or "NO".

        README content:
        ---
        ${readmeContent}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text.trim().toUpperCase();
        return text.includes('YES');
    } catch (error) {
        console.error("Error analyzing README with Gemini:", error);
        return false;
    }
};

const MAX_FILE_CONTENT_LENGTH = 4000;

export const generateReadmeFromFiles = async (repoName: string, fileTree: { path: string, content?: string }[]): Promise<string> => {
    if (fileTree.length === 0) {
        return `# ${repoName}\n\nThis repository appears to be empty. Add some files to generate a better README.`;
    }

    const fileContents = fileTree.map(file => `
---
File: \`${file.path}\`
---
${file.content ? `${file.content.substring(0, MAX_FILE_CONTENT_LENGTH)}${file.content.length > MAX_FILE_CONTENT_LENGTH ? '\n... (file truncated)' : ''}` : '(Content not loaded)'}
---
    `).join('\n\n');

    const prompt = `
        You are an expert software developer creating a README.md file for a project.
        Based on the provided repository name and its file structure/content, generate a comprehensive and high-quality README.md file in Markdown format.

        The project name is: **${repoName}**

        The repository contains the following files and content snippets:
        ${fileContents}

        Your generated README.md should include the following sections if possible:
        1.  **Project Title**: An H1 title (e.g., \`# Project Name\`).
        2.  **Short Description**: A concise, one-paragraph summary of what the project does.
        3.  **Key Features**: A bulleted list of 2-4 main features.
        4.  **Tech Stack**: A brief mention of the main technologies or languages used.
        5.  **Getting Started**: Simple instructions on how to install or run the project if it can be inferred.

        The tone should be professional and informative. Do not include any text outside of the Markdown content itself.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating README with Gemini:", error);
        throw new Error("Failed to generate README. The AI service may be unavailable.");
    }
};