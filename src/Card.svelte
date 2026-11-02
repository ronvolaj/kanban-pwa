<!--
  Card.svelte: shows ONE issue.
  The card is draggable (HTML5 drag & drop, no library).
-->
<script>
  // date-fns helpers for displaying dates nicely
  import { format, formatDistanceToNow, isAfter, endOfDay, parseISO } from 'date-fns';
  import { de } from 'date-fns/locale'; // German month names ("Nov.", "vor 3 Tagen")
  import { exportIcs, shareIssue } from './utils.js';

  // Props: data coming from the parent (Lane.svelte)
  let { issue, remove } = $props();

  // parseISO("2026-11-20") → Date in LOCAL time (new Date() would use UTC and can shift the day)
  let due = $derived(parseISO(issue.due));

  // Overdue = now is after the END of the due day (so the due day itself is still OK)
  let overdue = $derived(isAfter(new Date(), endOfDay(due)));

  // dragstart: remember WHICH issue is being dragged.
  // The Lane reads this ID again in its drop event.
  // Tailwind class for the colored left border, depending on the priority
  const priorityColor = { Niedrig: 'border-l-sage', Mittel: 'border-l-brass', Hoch: 'border-l-rust' };

  function dragStart(event) {
    event.dataTransfer.setData('text/plain', issue.id);
  }
</script>

<!--
  Tailwind classes: card look + colored left border by priority.
  If overdue is true we use red border + background, otherwise the normal look.
-->
<article
  class="mb-2.5 cursor-grab rounded-xl border border-l-4 px-3.5 py-3 shadow-sm active:cursor-grabbing
         {priorityColor[issue.priority]}
         {overdue ? 'border-rust bg-red-50' : 'border-line bg-card'}"
  draggable="true"
  ondragstart={dragStart}
>
  <!-- Visual warning when the due date has passed -->
  {#if overdue}
    <p class="mb-1.5 font-sans text-xs font-bold text-rust">
      ⚠ Überfällig · fällig {formatDistanceToNow(endOfDay(due), { locale: de, addSuffix: true })}
    </p>
  {/if}

  <header class="flex justify-between gap-2">
    <h3 class="text-lg leading-snug">{issue.title}</h3>
    <!-- Story points as a small round badge -->
    <span class="grid size-7 shrink-0 place-items-center rounded-full bg-sand font-sans text-xs">{issue.points}</span>
  </header>

  {#if issue.description}
    <p class="my-1.5 whitespace-pre-line text-muted">{issue.description}</p>
  {/if}

  <p class="my-2 font-sans text-xs leading-relaxed text-muted">
    <!-- format(): date as "20. Nov. 2026" -->
    Fällig: {format(due, 'd. MMM yyyy', { locale: de })}<br />
    <!-- formatDistanceToNow(): relative time like "vor 5 Minuten" -->
    Erstellt: vor {formatDistanceToNow(parseISO(issue.created), { locale: de })}<br />
    Priorität: {issue.priority}
  </p>

  <!-- Actions for this one issue -->
  <footer class="flex gap-1.5 border-t border-dashed border-line pt-2">
    <button class="btn px-2.5 py-0.5 text-xs" onclick={() => exportIcs(issue)}>ICS</button>
    <button class="btn px-2.5 py-0.5 text-xs" onclick={() => shareIssue(issue)}>Teilen</button>
    <button class="btn px-2.5 py-0.5 text-xs" onclick={() => remove(issue.id)} title="Löschen">✕</button>
  </footer>
</article>
