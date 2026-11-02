<!--
  NewDialog.svelte: form for a new issue inside the native HTML dialog element.
  The dialog element gives us a modal (dark backdrop, Esc to close) without any library.
-->
<script>
  // dialog = reference to the dialog element. $bindable lets App.svelte
  //          get this reference and call dialog.showModal() to open it.
  // onadd  = function from App.svelte that stores the new issue
  let { dialog = $bindable(), onadd } = $props();

  // Today as "yyyy-mm-dd" → default value for the due date
  const today = new Date().toISOString().slice(0, 10);

  function submit(event) {
    // FormData reads all form fields by their "name" attribute
    const form = new FormData(event.target);

    onadd({
      id: crypto.randomUUID(),                 // unique ID
      title: form.get('title'),
      description: form.get('description'),
      due: form.get('due'),                    // "2026-11-20"
      points: Number(form.get('points')),      // text → number
      priority: form.get('priority'),
      created: new Date().toISOString(),       // creation date = now
      lane: 'Do'                               // new issues always start in "Do"
    });

    event.target.reset(); // empty the form for next time
  }
</script>

<!--
  m-auto = center the dialog; backdrop:... styles the dark layer behind the modal
-->
<dialog
  bind:this={dialog}
  class="m-auto w-[min(360px,90vw)] rounded-2xl bg-card p-6 font-serif text-ink backdrop:bg-ink/50"
>
  <!-- method="dialog": submitting the form automatically closes the dialog -->
  <form method="dialog" onsubmit={submit} class="flex flex-col gap-3 font-sans text-sm text-muted">
    <h2 class="font-serif text-2xl text-ink">Neues Issue</h2>

    <!-- Each label wraps its input, so clicking the text focuses the field -->
    <label class="flex flex-col gap-1">Titel
      <input name="title" required class="rounded-lg border border-line bg-paper p-2 text-ink" />
    </label>
    <label class="flex flex-col gap-1">Beschreibung
      <textarea name="description" rows="3" class="rounded-lg border border-line bg-paper p-2 text-ink"></textarea>
    </label>
    <label class="flex flex-col gap-1">Fällig am
      <input name="due" type="date" value={today} required class="rounded-lg border border-line bg-paper p-2 text-ink" />
    </label>
    <label class="flex flex-col gap-1">Story Points
      <input name="points" type="number" min="1" value="1" required class="rounded-lg border border-line bg-paper p-2 text-ink" />
    </label>
    <label class="flex flex-col gap-1">Priorität
      <select name="priority" class="rounded-lg border border-line bg-paper p-2 text-ink">
        <option>Niedrig</option>
        <option selected>Mittel</option>
        <option>Hoch</option>
      </select>
    </label>

    <div class="mt-2 flex justify-end gap-2">
      <!-- type="button" = does NOT submit the form, only closes the dialog -->
      <button type="button" class="btn" onclick={() => dialog.close()}>Abbrechen</button>
      <button class="btn btn-primary">Anlegen</button>
    </div>
  </form>
</dialog>
