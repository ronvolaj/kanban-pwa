<!--
  App.svelte: the main component.
  It owns ALL data (the issues) and passes it down to the lanes.
  Styling: Tailwind classes directly in the HTML (colors come from app.css → @theme).
-->
<script>
  import Lane from './Lane.svelte';
  import NewDialog from './NewDialog.svelte';
  import { exportCsv, notify } from './utils.js';

  // The 4 lanes of the board
  const lanes = ['Do', 'Doing', 'Done', 'Archiv'];

  // $state makes the array reactive: when it changes, the UI updates automatically.
  // Start value: whatever is saved in localStorage (or an empty list the first time).
  let issues = $state(JSON.parse(localStorage.getItem('issues') ?? '[]'));

  // Reference to the <dialog> element (filled by NewDialog via bind:dialog)
  let dialog;

  // $effect runs again every time "issues" changes
  // → saves all issues INCLUDING their lane in localStorage
  $effect(() => {
    localStorage.setItem('issues', JSON.stringify(issues));
  });

  // Open the "new issue" dialog
  function openDialog() {
    dialog.showModal();
    // Ask for notification permission (browsers only allow this after a click)
    if ('Notification' in window) Notification.requestPermission();
  }

  // Add a new issue (called from NewDialog)
  function add(issue) {
    issues.push(issue);
  }

  // Move an issue to another lane (called from Lane on drop)
  function move(id, lane) {
    const issue = issues.find((i) => i.id === id);
    if (!issue || issue.lane === lane) return; // dropped in the same lane → nothing to do

    issue.lane = lane;

    // Notification when an issue is moved to "Done"
    if (lane === 'Done') notify('Erledigt ✓', `„${issue.title}“ ist fertig.`);
  }

  // Delete an issue
  function remove(id) {
    issues = issues.filter((i) => i.id !== id);
  }
</script>

<!-- min-h-screen = at least full screen height; px/py = padding -->
<div class="min-h-screen bg-paper px-4 py-8 font-serif text-ink sm:px-12">
  <!-- Header: title on the left, buttons on the right -->
  <header class="mb-6 flex flex-wrap items-center gap-3 border-b border-line pb-5">
    <h1 class="mr-auto text-4xl tracking-tight">Kanban</h1>
    <button class="btn" onclick={() => exportCsv(issues)}>CSV exportieren</button>
    <button class="btn btn-primary" onclick={openDialog}>+ Neues Issue</button>
  </header>

  <!-- Grid: 1 column on phones, 2 on tablets, 4 on desktop -->
  <main class="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- One Lane per name; each lane only gets ITS issues -->
    {#each lanes as lane}
      <Lane name={lane} issues={issues.filter((i) => i.lane === lane)} {move} {remove} />
    {/each}
  </main>
</div>

<NewDialog bind:dialog onadd={add} />
