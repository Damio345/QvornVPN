# 🚀 ShadowVPN — Установка проекта

## Быстрый старт

### 1. Скачай все файлы

Поскольку ты работаешь в веб-интерфейсе, есть два способа:

**Способ А: Через интерфейс (если есть кнопка Download)**
- Найди кнопку "Download" или "Скачать" в интерфейсе
- Скачай ZIP-архив
- Распакуй его

**Способ Б: Копирование вручную**
1. Открой каждый файл в веб-интерфейсе
2. Скопируй содержимое
3. Создай файл на компьютере с тем же именем
4. Вставь содержимое

### 2. Структура проекта

```
shadowvpn/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    └── components/
        ├── LoginScreen.tsx
        ├── ClientApp.tsx
        ├── AdminApp.tsx
        └── DownloadSite.tsx
```

### 3. Установка зависимостей

```bash
npm install
```

### 4. Сборка проекта

```bash
npm run build
```

### 5. Загрузка на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЮЗЕР/shadowvpn.git
git push -u origin main
```

### 6. Деплой на Vercel

1. Зайди на [vercel.com](https://vercel.com)
2. Войди через GitHub
3. Нажми "Import Project"
4. Выбери репозиторий `shadowvpn`
5. Нажми "Deploy"

### 7. Готово!

Получишь ссылку:
- Главная: `https://твой-сайт.vercel.app/`
- Клиент: `https://твой-сайт.vercel.app/#/client`
- Админка: `https://твой-сайт.vercel.app/#/admin`

---

## Список файлов для копирования

Все файлы находятся в веб-интерфейсе. Вот их список:

### Корневые файлы:
1. `index.html`
2. `package.json`
3. `package-lock.json` (создастся автоматически после npm install)
4. `tsconfig.json`
5. `tsconfig.node.json`
6. `vite.config.ts`
7. `tailwind.config.js`
8. `postcss.config.js`

### Файлы в папке src/:
9. `src/main.tsx`
10. `src/App.tsx`
11. `src/index.css`

### Компоненты в папке src/components/:
12. `src/components/LoginScreen.tsx`
13. `src/components/ClientApp.tsx`
14. `src/components/AdminApp.tsx`
15. `src/components/DownloadSite.tsx`

---

## Альтернатива: Автоматическая установка

Если у тебя есть доступ к терминалу, можешь использовать скрипт `setup.sh` (но он создаёт только базовые файлы, компоненты нужно копировать вручную).

---

## Помощь

Если что-то не получается:
1. Проверь что все файлы скопированы
2. Убедись что структура папок правильная
3. Попробуй `npm install` заново
4. Проверь что Node.js версии 18+ установлен
