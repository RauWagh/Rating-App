import './styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// global styles imported above
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
