<script>
  import Lane from './Lane.svelte';            // Spalten-Komponente holen
  import NewDialog from './NewDialog.svelte';  // Popup-Formular holen
  import { exportCsv, notify } from './utils.js'; // 2 Hilfsfunktionen holen

  const lanes = ['Do', 'Doing', 'Done', 'Archiv']; // Namen der 4 Spalten

  let issues = $state(                          // Liste aller Issues, reaktiv (Bildschirm aktualisiert sich)
    JSON.parse(                                 // Text → Liste umwandeln
      localStorage.getItem('issues')            // gespeicherte Issues aus dem Browser lesen
      ?? '[]'                                   // falls nichts da: leere Liste
    )
  );

let dialog = $state();                                   // hier kommt später das Popup rein

  $effect(() => {                               // läuft bei jeder Änderung von issues
    localStorage.setItem(                       // im Browser speichern …
      'issues',                                 // … unter dem Namen "issues"
      JSON.stringify(issues)                    // Liste → Text umwandeln
    );
  });

  function openDialog() {                       // wird beim Klick auf "+ Neues Issue" ausgeführt
    dialog.showModal();                         // Popup öffnen
    if ('Notification' in window)               // kann der Browser Benachrichtigungen?
      Notification.requestPermission();         // Erlaubnis fragen
  }

  function add(issue) {                         // neues Issue bekommen
    issues.push(issue);                         // ans Ende der Liste hängen
  }

  function move(id, lane) {                     // Issue in andere Spalte schieben
    const issue = issues.find((i) => i.id === id); // Issue mit dieser ID suchen
    if (!issue || issue.lane === lane) return;  // nicht gefunden oder gleiche Spalte → abbrechen
    issue.lane = lane;                          // neue Spalte setzen
    if (lane === 'Done')                        // wenn nach "Done" verschoben …
      notify('Erledigt ✓', `„${issue.title}“ ist fertig.`); // … Benachrichtigung zeigen
  }

  function remove(id) {                         // Issue löschen
    issues = issues.filter((i) => i.id !== id); // alle behalten außer diesem
  }
</script>

<div class="min-h-screen bg-paper px-4 py-8 font-serif text-ink sm:px-12">
  <!-- ganze Seite: volle Höhe, Papierfarbe, Abstand, Schrift, Textfarbe -->

  <header class="mb-6 flex flex-wrap items-center gap-3 border-b border-line pb-5">
    <!-- Kopfzeile: nebeneinander, zentriert, Linie unten -->

    <h1 class="mr-auto text-4xl tracking-tight">Kanban</h1>
    <!-- Überschrift links, schiebt die Buttons nach rechts -->

    <button class="btn" onclick={() => exportCsv(issues)}>CSV exportieren</button>
    <!-- Klick → alle Issues als CSV herunterladen -->

    <button class="btn btn-primary" onclick={openDialog}>+ Neues Issue</button>
    <!-- Klick → Popup öffnen -->
  </header>

  <main class="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Raster: Handy 1, Tablet 2, Laptop 4 Spalten -->

    {#each lanes as lane}
      <!-- Schleife: für jede der 4 Spalten … -->

      <Lane name={lane} issues={issues.filter((i) => i.lane === lane)} {move} {remove} />
      <!-- … eine Lane mit Name, nur ihren Issues, und den Funktionen move & remove -->

    {/each}
    <!-- Ende der Schleife -->
  </main>
</div>

<NewDialog bind:dialog onadd={add} />
<!-- Popup-Formular; bind:dialog füllt die Variable dialog, onadd ruft add() auf -->