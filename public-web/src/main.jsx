import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* wrap App and let the react-router-dom manage url, remember the pages before and let me go back */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

