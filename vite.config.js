// vite.config.js
// Vite is the build tool: it starts the dev server and bundles the app for production.

import { defineConfig } from 'vite';
// Plugin that lets Vite understand .svelte files
import { svelte } from '@sveltejs/vite-plugin-svelte';
// Plugin that turns the app into a PWA:
// it generates the manifest (installable) and a service worker (offline)
import { VitePWA } from 'vite-plugin-pwa';
// Tailwind CSS v4: scans our files for class names and generates only the CSS we use
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(),

    VitePWA({
      // When a new version is deployed, the service worker updates itself automatically
      registerType: 'autoUpdate',

      // The web app manifest tells the browser how the installed app looks
      manifest: {
        name: 'Kanban Board',          // full name (install dialog)
        short_name: 'Kanban',          // short name (under the app icon)
        theme_color: '#2f4a3c',        // color of the title bar
        background_color: '#f4efe6',   // background of the splash screen
        display: 'standalone',         // opens in its own window, without browser UI
        icons: [
          // One SVG icon in "any" size works for every resolution
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
        ]
      },

      // Workbox (inside the plugin) caches all of these files on first visit.
      // That is why the app works completely offline afterwards.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}']
      }
    })
  ]
});
