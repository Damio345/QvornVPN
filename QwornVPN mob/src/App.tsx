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

  // Отдельные приложения
  if (route === '#/client') {
    return <ClientApp onBack={() => navigate('')} />
  }
  if (route === '#/admin') {
    return <AdminApp onBack={() => navigate('')} />
  }
  if (route === '#/login') {
    return <LoginScreen onSelect={(mode) => navigate(`/${mode}`)} />
  }

  // Главная страница — сайт для скачивания
  return <DownloadSite />
}

export default App
