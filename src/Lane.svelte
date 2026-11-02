<script>
  import Card from './Card.svelte';               // Karten-Komponente holen

  let { name, issues, move, remove } = $props();  // Daten von App: Name, Issues, 2 Funktionen

  let points = $derived(                          // Summe der Story Points (rechnet automatisch neu)
    issues.reduce((sum, issue) => sum + issue.points, 0) // alle Punkte zusammenzählen, Start bei 0
  );

  let over = $state(false);                       // true, solange eine Karte über der Spalte schwebt

  function dragOver(event) {                      // Karte wird über die Spalte gezogen
    event.preventDefault();                       // nötig, sonst kein Ablegen möglich
    over = true;                                  // Spalte hervorheben
  }

  function drop(event) {                          // Karte wird losgelassen
    event.preventDefault();                       // Standardverhalten verhindern
    over = false;                                 // Hervorhebung aus
    const id = event.dataTransfer.getData('text/plain'); // ID der Karte lesen
    move(id, name);                               // App: Issue in diese Spalte verschieben
  }
</script>

<!-- Spalte; goldener Rand, solange eine Karte drüber schwebt -->
<section
  role="region"
  aria-label={name}
  class="min-h-80 rounded-2xl border-2 border-dashed bg-sand p-4 transition-colors
         {over ? 'border-brass' : 'border-transparent'}"
  ondragover={dragOver}
  ondragleave={() => (over = false)}
  ondrop={drop}
>
  <!-- Überschrift: Name links, Punkte rechts -->
  <h2 class="mb-4 flex items-baseline justify-between text-xl">
    {name}
    <small class="font-sans text-sm font-semibold text-forest">{points} SP</small>
  </h2>

  <!-- für jedes Issue eine Karte; leer → Hinweis -->
  {#each issues as issue (issue.id)}
    <Card {issue} {remove} />
  {:else}
    <p class="mt-10 text-center italic text-muted/70">Karten hierher ziehen</p>
  {/each}
</section>