# Kanban PWA

Ein einfaches Kanban-Board mit **Svelte 5**, **Vite** und **Tailwind CSS**. Es lässt sich als **Progressive Web App** installieren und funktioniert komplett offline.

## Features

- 4 Lanes: **Do, Doing, Done, Archiv**, jeweils mit der **Summe der Story Points**
- Neue Issues über ein HTML-`<dialog>` anlegen
- Issues mit **Drag & Drop** verschieben (native HTML5-API, ohne Library)
- Eigenschaften: Titel, Beschreibung, Erstelldatum, Fälligkeitsdatum, Story Points, Priorität
- Alle Issues inkl. Lane werden in **localStorage** gespeichert
- **ICS-Export** und **Teilen** (Web Share API) pro Issue
- **CSV-Export** aller Issues
- **date-fns** für die Datumsanzeige
- **Warnung**, wenn ein Issue überfällig ist
- **Notification**, wenn ein Issue nach Done verschoben wird

## Starten

```bash
npm install
npm run dev        # Entwicklung
npm run build      # Produktions-Build
npm run preview    # Build ansehen: hier ist die PWA installierbar und offline nutzbar
```

## Struktur

| Datei | Aufgabe |
|---|---|
| `src/main.js` | Einstiegspunkt, rendert `App.svelte` |
| `src/App.svelte` | Hält alle Daten und speichert sie in localStorage |
| `src/Lane.svelte` | Eine Spalte, Drop-Zone und Story-Point-Summe |
| `src/Card.svelte` | Ein Issue, draggable, mit Überfällig-Warnung |
| `src/NewDialog.svelte` | `<dialog>` zum Anlegen eines Issues |
| `src/utils.js` | ICS, CSV, Share und Notification |
| `src/app.css` | Tailwind und eigene Farbpalette |
| `vite.config.js` | Vite, Tailwind und PWA (Manifest und Service Worker) |
