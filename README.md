# Enhanced-AI-Chat-Desktop-Client

> A fast, ChatGPT-powered desktop client built with **Electron**, **React**, and **MongoDB**, designed for clean, efficient, and focused AI conversations. It features one-level threaded chats, a minimap for quick topic navigation, and a temporary doubts window for instant, one-off queries — all optimized for performance on macOS.

---

## 🏷️ Key Highlights & Features
- 🧠 **ChatGPT Integration** – Context-aware, intelligent responses  
- 🧵 **One-Level Threaded Chats** – Organized, structured discussions  
- 🗺️ **Minimap Navigation** – Visual topic overview for quick jumps  
- 💭 **Temporary Doubts Window** – Instant queries without saving history  
- ⚡ **Optimized Performance** – Smooth, MongoDB-powered cloud operations  
- 🖥️ **Platform** – macOS  

---

## 🛠️ Tech Stack

**Frontend**
- Framework: `Electron.js`
- UI Library: `React (Vite)`
- Styling: `Tailwind CSS`

**Backend**
- Runtime: `Node.js`
- Framework: `Express.js`
- Database: `MongoDB (Mongoose)`
- AI API: `OpenAI / Custom API Integration`

**Dev & Tools**
- Version Control: `Git & GitHub`
- Hot Reload: `Electron Forge / Nodemon`
- Security: `dotenv, CORS, Helmet`
- Linting: `ESLint`

---

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
