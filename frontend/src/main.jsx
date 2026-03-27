import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
          success: { style: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' } },
          error:   { style: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
