import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
function render() {
    const root =document.getElementById('root');
    ReactDOM.createRoot(root).render(<App />);
}

render();