# Enhanced-AI-Chat-Desktop-Client

> A fast, ChatGPT-powered desktop client built with **Electron**, **React**, and **MongoDB**, designed for clean, efficient, and focused AI conversations. It features one-level threaded chats, a minimap for quick topic navigation, and a temporary doubts window for instant, one-off queries — all optimized for performance on Desktop.

---

## 🏷️ Key Highlights & Features
- 🧠 **ChatGPT Integration** – Context-aware, intelligent responses  
- 🧵 **One-Level Threaded Chats** – Organized, structured discussions  
- 🗺️ **Minimap Navigation** – Visual topic overview for quick jumps  
- 💭 **Temporary Doubts Window** – Instant queries without saving history  
- ⚡ **Optimized Performance** – Smooth, MongoDB-powered cloud operations  
- 🖥️ **Platform** – Desktop  

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

## 🚀 Running the Frontend

We've made it super easy to get started. Since this is an Electron app with a React frontend, you'll need to run both the renderer (React) and the main process (Electron).

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Setup & Run
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    This command runs `vite` for the frontend and `electron` simultaneously. You'll see the window pop up!

### 📖 Frontend Deep Dive
Want to know more about the design philosophy, component structure, and the "human" side of our code?  
👉 **[Read our Frontend Guide](FRONTEND_DETAILS.md)**


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
