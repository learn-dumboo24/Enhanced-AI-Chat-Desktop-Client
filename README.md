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

## 🚀 Installation & Setup

Follow these steps to get the application running on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### 2. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/learn-dumboo24/Enhanced-AI-Chat-Desktop-Client.git
cd Enhanced-AI-Chat-Desktop-Client
```

### 3. Install Dependencies
Install the necessary packages for both Electron and React:
```bash
npm install
# or
yarn install
```

### 4. Run the Application
Start the development server. This will launch the React renderer (Vite) and the Electron main process concurrently.
```bash
npm run dev
# or
yarn dev
```
*The application window should appear shortly.*

### 5. Configuration (API Key)
Since this is a client-side focused app, you need to provide your own OpenAI API Key.
1.  Click on the **Settings** button in the sidebar.
2.  Enter your **OpenAI API Key** (starts with `sk-...`).
3.  Click **Save**.
    - *Note: Your key is stored securely in your local storage and is never sent to our servers.*

---

## 📖 Frontend Deep Dive
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
