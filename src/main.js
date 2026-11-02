// main.js: entry point of the app.
// It loads the global CSS (Tailwind) and renders the App component
// into <div id="app"> in index.html.

import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';

mount(App, { target: document.getElementById('app') });
