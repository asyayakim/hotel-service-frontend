import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './hotel-display.css'
import './hotel-page.css'
import './login-register.css'
import './payment-form.css'
import './user-page.css'
import './UserReservations.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      </BrowserRouter>
  </StrictMode>,
)
