import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against unhandled rejections from 3P browser extensions
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.stack || event.reason?.message || String(event.reason || '');
    if (reason.includes('chrome-extension://') || reason.includes('moz-extension://')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);

