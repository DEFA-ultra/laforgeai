import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './Landing.jsx'
import App from './App.jsx'
import Marketing from './Marketing.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/generator" element={<App />} />
        <Route path="/marketing" element={<Marketing />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
