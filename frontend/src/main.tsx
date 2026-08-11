import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
<<<<<<< Updated upstream
import { LanguageProvider } from './context/LanguageContext'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LanguageProvider>
            <App />
        </LanguageProvider>
=======
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
>>>>>>> Stashed changes
    </StrictMode>,
)