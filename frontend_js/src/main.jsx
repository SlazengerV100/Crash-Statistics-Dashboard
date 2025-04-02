import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ThemedApp from './ThemedApp.jsx'

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemedApp />
    </StrictMode>,
  );
}
