#!/bin/bash

# ShadowVPN - Complete Setup Script
# Скопируй ВЕСЬ этот скрипт и запусти на Linux:
# 1. nano setup.sh (или любой редактор)
# 2. Вставь весь код
# 3. Сохрани (Ctrl+O, Enter, Ctrl+X)
# 4. chmod +x setup.sh
# 5. ./setup.sh

echo "🚀 Создаём полный проект ShadowVPN..."

# Создаём структуру
mkdir -p shadowvpn/src/components
cd shadowvpn

# ============ БАЗОВЫЕ ФАЙЛЫ ============

cat > index.html << 'EOF'
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
EOF

cat > package.json << 'EOF'
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
EOF

cat > tsconfig.json << 'EOF'
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
EOF

cat > tsconfig.node.json << 'EOF'
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
EOF

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOF

cat > tailwind.config.js << 'EOF'
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
EOF

cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# ============ SRC ФАЙЛЫ ============

cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

cat > src/index.css << 'EOF'
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
EOF

cat > src/App.tsx << 'EOF'
import { useState, useEffect } from 'react'
import LoginScreen from './components/LoginScreen'
import ClientApp from './components/ClientApp'
import AdminApp from './components/AdminApp'
import DownloadSite from './components/DownloadSite'

function App() {
  const [route, setRoute] = useState<string>(window.location.hash || '')

  useEffect(() => {
    const handleHash = () => setRoute(window.location.hash || '')
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const navigate = (path: string) => {
    window.location.hash = path
    setRoute(path)
  }

  if (route === '#/client') {
    return <ClientApp onBack={() => navigate('')} />
  }
  if (route === '#/admin') {
    return <AdminApp onBack={() => navigate('')} />
  }
  if (route === '#/login') {
    return <LoginScreen onSelect={(mode) => navigate(`/${mode}`)} />
  }

  return <DownloadSite />
}

export default App
EOF

echo "✅ Базовые файлы и App.tsx созданы!"
echo ""
echo "⚠️  Теперь нужно скопировать компоненты вручную:"
echo ""
echo "📝 Открой в веб-интерфейсе и скопируй:"
echo "  1. src/components/LoginScreen.tsx"
echo "  2. src/components/ClientApp.tsx"
echo "  3. src/components/AdminApp.tsx"
echo "  4. src/components/DownloadSite.tsx"
echo ""
echo "И создай эти файлы в папке shadowvpn/src/components/"
echo ""
echo "🚀 После копирования:"
echo "  cd shadowvpn"
echo "  npm install"
echo "  npm run build"
echo ""
echo "📤 Затем загрузи на GitHub и подключи к Vercel"
