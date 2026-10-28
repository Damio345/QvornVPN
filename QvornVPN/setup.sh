#!/bin/bash

# ShadowVPN Project Setup Script for Linux
# Запусти этот скрипт в терминале: bash setup.sh

echo "🚀 Создаём проект ShadowVPN..."

# Создаём структуру папок
mkdir -p shadowvpn/src/components
cd shadowvpn

# index.html
cat > index.html << 'HTMLEOF'
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ShadowVPN — Безопасный VPN для всех платформ</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTMLEOF

# package.json
cat > package.json << 'PKGEOF'
{
  "name": "shadowvpn",
  "private": true,
  "version": "2.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
PKGEOF

# tsconfig.json
cat > tsconfig.json << 'TSEOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
TSEOF

# tsconfig.node.json
cat > tsconfig.node.json << 'TSNODEEOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
TSNODEEOF

# vite.config.ts
cat > vite.config.ts << 'VITEEOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
VITEEOF

# tailwind.config.js
cat > tailwind.config.js << 'TWEOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
TWEOF

# postcss.config.js
cat > postcss.config.js << 'PCEOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
PCEOF

# src/main.tsx
cat > src/main.tsx << 'MAINEOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
MAINEOF

# src/index.css
cat > src/index.css << 'CSSEOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0a0a1a;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}

::selection {
  background-color: rgba(59, 130, 246, 0.3);
  color: white;
}
CSSEOF

echo "✅ Базовые файлы созданы!"
echo ""
echo "⚠️  ВАЖНО: Теперь нужно скопировать компоненты из веб-интерфейса"
echo ""
echo "📝 Открой в веб-интерфейсе файлы:"
echo "  - src/App.tsx"
echo "  - src/components/LoginScreen.tsx"
echo "  - src/components/ClientApp.tsx"
echo "  - src/components/AdminApp.tsx"
echo "  - src/components/DownloadSite.tsx"
echo ""
echo "И скопируй их в папку shadowvpn/src/ и shadowvpn/src/components/"
echo ""
echo "🚀 После копирования выполни:"
echo "  cd shadowvpn"
echo "  npm install"
echo "  npm run build"
echo ""
echo "📤 Затем загрузи на GitHub и подключи к Vercel"
