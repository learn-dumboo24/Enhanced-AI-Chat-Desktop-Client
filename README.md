# Enhanced-AI-Chat-Desktop-Client
It features one-level threaded chats, a built-in minimap for quick topic navigation, and a temporary doubts window for one-time queries — all powered by MongoDB for smooth, cloud-based performance.
> A fast, ChatGPT-powered desktop client built with **Electron**, **React**, and **MongoDB**, designed for clean, efficient, and focused AI conversations. It features one-level threaded chats, a minimap for quick topic navigation, and a temporary doubts window for instant, one-off queries — all optimized for performance on macOS.

🏷️ Key Highlights

🧠 ChatGPT Integration – AI-driven responses with contextual understanding

🧵 One-Level Threaded Chats – Structured, focused discussion threads similar to Slack

🗺️ Minimap View – Navigate across topics visually and quickly

💭 Temporary Doubts Window – Ask quick, one-off questions without saving history

⚡ Optimized Performance – Built for speed with MongoDB and efficient data fetching

🖥️ Platform – macOS

📋 Table of Contents


### ✨ Features
✅ Current Features

Parent-Level Prompts: Start and continue main chat sessions with ChatGPT

Nested Replies: One-level nested comments for clarifications or follow-ups

Temporary Doubt Mode: Opens a clean secondary window for short-lived questions

Minimap: Visual topic overview to jump between conversations

Persistent Storage: All user data and chat logs stored securely in MongoDB

Session Management: Isolates temporary, threaded, and parent chats effectively

🛠️ Tech Stack
Frontend

Framework: Electron.js

UI Library: React (Vite)

Styling: Tailwind CSS

Backend

Runtime: Node.js

Framework: Express.js

Database: MongoDB (via Mongoose)

AI API: OpenAI / Custom Model API Integration

Dev & Tools

Version Control: Git & GitHub

Hot Reload: Electron Forge / Nodemon

Security: dotenv, CORS, Helmet

Linting: ESLint

## 🧱 Project Structure
```
Enhanced-AI-Chat-Desktop-Client/
├── src/
│   ├── main/                # Electron main process
│   ├── renderer/            # Frontend React code
│   ├── components/          # UI components (chat, minimap, threads)
│   ├── services/            # API & database logic
│   ├── utils/               # Helpers and config
│   └── assets/              # Icons, images, etc.
├── server/
│   ├── routes/              # Express routes (chats, threads, doubts)
│   ├── models/              # MongoDB schemas
│   └── controllers/         # Business logic
├── .env.example
├── package.json
└── README.md
```
