import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppProvider } from '@/shared/theme/provider'
import HomePage from '@/pages/home'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppProvider>
        <HomePage />
      </AppProvider>
    </React.StrictMode>
  )
}
