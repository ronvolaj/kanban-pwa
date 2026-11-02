import { mount } from 'svelte';    // Funktion holen, die eine Komponente auf die Seite bringt
import './app.css';                // globales CSS laden (Tailwind + unsere Farben)
import App from './App.svelte';    // Hauptkomponente holen

mount(App, {                       // App auf der Seite anzeigen …
  target: document.getElementById('app') // … im <div id="app"> aus index.html
});
