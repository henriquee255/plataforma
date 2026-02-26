import { BrowserRouter } from 'react-router-dom'
import MainLayout from './MainLayout'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import { ToastProvider } from './contexts/ToastContext'
import { Toaster } from '@/components/ui/toaster'
import ToastContainer from './components/ToastContainer'
import { useEffect } from 'react'

/**
 * Componente raiz da aplicação
 * Configura providers de contexto e layout principal
 * @returns {JSX.Element}
 */
function App() {
  // Define o título da página como "Plataforma" sempre
  useEffect(() => {
    document.title = 'Plataforma'
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <AppProvider>
            <ToastProvider>
              {/* WCAG 2.1 AA - Skip Link */}
              <a href="#main-content" className="skip-link">
                Pular para conteúdo principal
              </a>
              <MainLayout />
              <Toaster />
              <ToastContainer />
            </ToastProvider>
          </AppProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
