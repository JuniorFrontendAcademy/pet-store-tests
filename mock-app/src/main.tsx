import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

import './main.css';
import './styles.scss';

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
