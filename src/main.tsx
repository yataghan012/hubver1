import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CMSProvider } from './context/CMSContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CMSProvider>
      <App />
    </CMSProvider>
  </StrictMode>,
);
