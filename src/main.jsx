import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NewsFeed from './Components/NewsFeed'
//import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NewsFeed />
  </StrictMode>,
)
