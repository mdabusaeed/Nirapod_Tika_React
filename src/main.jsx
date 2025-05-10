import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Approutes from './routes/Approutes.jsx'
import { AuthProvider } from './components/context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Approutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
