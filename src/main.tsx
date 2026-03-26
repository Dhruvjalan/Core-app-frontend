// clientid: 493222136166-1r1qtntlnjnvv7212ckiquu4tsv0838o.apps.googleusercontent.com
// client secret; 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

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename= "/crossroads">
        <App />
    </BrowserRouter>
  </React.StrictMode>,
)
