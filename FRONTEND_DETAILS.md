# Frontend Architecture & Design Philosophy

## 👋 Welcome to the Frontend!

Hi there! If you're diving into the frontend code, you're in for a treat. We've built this with a lot of love and attention to detail, aiming for a desktop experience that feels both powerful and incredibly smooth.

We didn't just want another chat app; we wanted something that feels "native" and premium. Here's a little tour of what makes it tick.

## 🎨 Design Philosophy: "Focus & Flow"

The core idea is **one-level threading**. We noticed that chat interfaces often get cluttered. By keeping threads just one level deep and tucking them into a sidebar, we keep your main conversation clean while ensuring you never lose context.

We used **Tailwind CSS** for everything. It allowed us to iterate fast and create a custom design system that feels cohesive. You'll notice a lot of dark grays, subtle borders, and specific "hover" states—these micro-interactions are what make the app feel alive.

## 🧩 Key Components

### 1. **The Minimap (`Minimap.jsx`)**
Think of this as your "birds-eye view". It's not just a list of chats; it's a visual anchor. We designed it to be slim and unobtrusive, letting you jump between contexts without feeling overwhelmed.

### 2. **Threaded Sidebar (`ThreadSidebar.jsx`)**
This is where the magic happens. Instead of cluttering the main view with replies, we open a dedicated space on the right. It slides in smoothly, giving you a focused area to discuss specific messages without derailing the main chat.

### 3. **Doubts Window (`DoubtsWindow.jsx`)**
Ever had a quick question you didn't want to save? That's what this is for. It's a transient, floating window for those "quick Google search" type queries. It feels distinct from the main chat, almost like a scratchpad.

## 🛠️ Under the Hood

- **React & Vite**: We chose Vite for its blazing fast dev server. You'll notice changes reflect almost instantly.
- **Context API**: We use a simple `ChatContext` to manage state. No complex Redux boilerplate here—just clean, React-native state management.
- **Electron IPC**: The frontend talks to the backend (Electron main process) via secure IPC channels. It's safe and fast.

## 🚀 Getting Started

If you want to tweak the UI:
1.  Go to `src/renderer`.
2.  `App.jsx` is your entry point.
3.  Components are neatly organized in `components/`.

Feel free to break things and put them back together. That's the best way to learn! Happy coding! 🚀
