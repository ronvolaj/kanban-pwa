<!--
  Lane.svelte: one column of the board (Do, Doing, Done or Archiv).
  It is also the DROP ZONE for drag & drop.
-->
<script>
  import Card from './Card.svelte';

  // name   = name of the lane, e.g. "Done"
  // issues = only the issues that belong to this lane
  // move / remove = functions from App.svelte that change the data
  let { name, issues, move, remove } = $props();

  // $derived: recalculates automatically whenever "issues" changes
  // → sum of story points in this lane
  let points = $derived(issues.reduce((sum, issue) => sum + issue.points, 0));

  // true while a card is dragged over this lane (for the highlight)
  let over = $state(false);

  // dragover: the browser only allows a drop if we call preventDefault()
  function dragOver(event) {
    event.preventDefault();
    over = true;
  }

  // drop: read the ID that Card.svelte stored in dragstart and move the issue here
  function drop(event) {
    event.preventDefault();
    over = false;
    const id = event.dataTransfer.getData('text/plain');
    move(id, name);
  }
</script>

<!-- While a card is dragged over the lane (over = true), the dashed border turns golden -->
<section
  class="min-h-80 rounded-2xl border-2 border-dashed bg-sand p-4 transition-colors
         {over ? 'border-brass' : 'border-transparent'}"
  ondragover={dragOver}
  ondragleave={() => (over = false)}
  ondrop={drop}
>
  <h2 class="mb-4 flex items-baseline justify-between text-xl">
    {name}
    <!-- Sum of story points per lane -->
    <small class="font-sans text-sm font-semibold text-forest">{points} SP</small>
  </h2>

  <!-- One card per issue. (issue.id) is the "key" so Svelte can track each card -->
  {#each issues as issue (issue.id)}
    <Card {issue} {remove} />
  {:else}
    <p class="mt-10 text-center italic text-muted/70">Karten hierher ziehen</p>
  {/each}
</section>
