# ICS-ASTRA

ICS-ASTRA is a web application for managing and viewing alumni profiles for the Institute of Computer Science.

## 🚀 Getting Started

Before you begin, make sure you have:

- **Node.js** installed on your computer — [Download Node.js](https://nodejs.org/)
- **pnpm** installed — [Install pnpm](https://pnpm.io/installation)

### ✅ Install Node.js

Download and install Node.js from the official website:  
👉 [https://nodejs.org/](https://nodejs.org/)

After installation, verify:

```bash
node -v
npm -v
```

### ✅ Install pnpm

Follow the instructions here:  
👉 [https://pnpm.io/installation](https://pnpm.io/installation)

## 🛠 Run the Project Locally

1. **Install dependencies**

   ```bash
   pnpm i
   ```

2. **Start the backend server**

   ```bash
   pnpm api-watch
   ```

3. **Start the frontend client**

   ```bash
   pnpm dev
   ```

4. **Open the app in your browser**

   ```
   http://localhost:3000
   ```

## 🧪 Code Quality

To check for code convention errors using ESLint:

```bash
pnpm eslint ./app
pnpm eslint ./api
```

## 🔐 Environment Variables

The `.env` file contains sensitive configuration and is only accessible to project collaborators.

---

Made with ❤️ by the ICS-ASTRA team.
