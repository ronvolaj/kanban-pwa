<script>
  import { format, formatDistanceToNow, isAfter, endOfDay, parseISO } from 'date-fns'; // Datums-Funktionen holen
  import { de } from 'date-fns/locale';            // deutsche Sprache für Datumsangaben
  import { exportIcs, shareIssue } from './utils.js'; // ICS- und Teilen-Funktion holen

  let { issue, remove } = $props();               // Daten von der Lane bekommen: das Issue + Löschfunktion

  let due = $derived(parseISO(issue.due));        // Fälligkeitsdatum: Text → echtes Datum

  let overdue = $derived(                         // ist das Issue überfällig? (true/false)
    isAfter(new Date(), endOfDay(due))            // ist jetzt später als das Ende des Fälligkeitstags?
  );

  const priorityColor = {                         // Farbe des linken Rands je nach Priorität
    Niedrig: 'border-l-sage',                     // niedrig → grün
    Mittel: 'border-l-brass',                     // mittel → gold
    Hoch: 'border-l-rust'                         // hoch → rot
  };

  function dragStart(event) {                     // läuft, wenn man die Karte anfängt zu ziehen
    event.dataTransfer.setData('text/plain', issue.id); // ID merken, damit die Lane weiß, welche Karte es ist
  }
</script>

<article
  class="mb-2.5 cursor-grab rounded-xl border border-l-4 px-3.5 py-3 shadow-sm active:cursor-grabbing
         {priorityColor[issue.priority]}
         {overdue ? 'border-rust bg-red-50' : 'border-line bg-card'}"
  draggable="true"
  ondragstart={dragStart}
>
  <!-- Karte: Abstand, Hand-Cursor, runde Ecken, Rand, Schatten -->
  <!-- {priorityColor[...]} = Farbe des linken Rands -->
  <!-- überfällig ? roter Rand + rötlicher Hintergrund : normaler Rand + weißer Hintergrund -->
  <!-- draggable="true" = Karte kann gezogen werden -->
  <!-- ondragstart = beim Ziehen dragStart() ausführen -->

  {#if overdue}
    <!-- nur anzeigen, wenn überfällig -->
    <p class="mb-1.5 font-sans text-xs font-bold text-rust">
      <!-- kleiner, fetter, roter Text -->
      ⚠ Überfällig · fällig {formatDistanceToNow(endOfDay(due), { locale: de, addSuffix: true })}
      <!-- z. B. "⚠ Überfällig · fällig vor 12 Tagen" -->
    </p>
  {/if}
  <!-- Ende von if -->

  <header class="flex justify-between gap-2">
    <!-- Kopf der Karte: Titel links, Punkte rechts -->

    <h3 class="text-lg leading-snug">{issue.title}</h3>
    <!-- Titel des Issues -->

    <span class="grid size-7 shrink-0 place-items-center rounded-full bg-sand font-sans text-xs">{issue.points}</span>
    <!-- runder Kreis mit den Story Points -->
  </header>

  {#if issue.description}
    <!-- nur anzeigen, wenn es eine Beschreibung gibt -->
    <p class="my-1.5 whitespace-pre-line text-muted">{issue.description}</p>
    <!-- Beschreibung in grauer Schrift, Zeilenumbrüche bleiben erhalten -->
  {/if}

  <p class="my-2 font-sans text-xs leading-relaxed text-muted">
    <!-- kleiner grauer Infoblock -->

    Fällig: {format(due, 'd. MMM yyyy', { locale: de })}<br />
    <!-- Fälligkeitsdatum, z. B. "20. Nov. 2026"; <br /> = neue Zeile -->

    Erstellt: vor {formatDistanceToNow(parseISO(issue.created), { locale: de })}<br />
    <!-- Erstelldatum relativ, z. B. "vor 5 Minuten" -->

    Priorität: {issue.priority}
    <!-- Priorität: Niedrig / Mittel / Hoch -->
  </p>

  <footer class="flex gap-1.5 border-t border-dashed border-line pt-2">
    <!-- Buttonleiste unten, gestrichelte Linie darüber -->

    <button class="btn px-2.5 py-0.5 text-xs" onclick={() => exportIcs(issue)}>ICS</button>
    <!-- Klick → Issue als Kalendereintrag (.ics) herunterladen -->

    <button class="btn px-2.5 py-0.5 text-xs" onclick={() => shareIssue(issue)}>Share</button>
    <!-- Klick → Teilen-Menü öffnen (Web Share API) -->

    <button class="btn px-2.5 py-0.5 text-xs" onclick={() => remove(issue.id)} title="Löschen">✕</button>
    <!-- Klick → Issue löschen; title = Text beim Drüberfahren mit der Maus -->
  </footer>
</article>