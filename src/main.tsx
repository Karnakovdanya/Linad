import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './app/App';
import { PreferencesProvider } from './app/PreferencesProvider';
import { AuthProvider } from './account/AuthProvider';
import './styles/tokens.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreferencesProvider>
      <AuthProvider><HashRouter>
        <App />
      </HashRouter></AuthProvider>
    </PreferencesProvider>
  </StrictMode>,
);
