import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 uses this import
import './index.css'; // Optional: Your global CSS styles
import IntegratedApp from './components'; // Import from your components directory

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <IntegratedApp />
  </React.StrictMode>
);
